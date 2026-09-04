import { DEFAULT_CHART_WEEKS } from '../config/constants.js';
import { Report } from '../models/Report.js';
import { ReportVersion } from '../models/ReportVersion.js';
import { ReviewComment } from '../models/ReviewComment.js';
import { User } from '../models/User.js';
import { getSubmissionDeadline, getWeekRange } from '../utils/week.js';

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const REPORT_STATUSES = ['submitted', 'needs_correction', 'approved'];

const asWeekLabel = (date) => date.toISOString().slice(0, 10);

function buildRangeMatch({ weekStart, weekEnd }) {
  const end = getWeekRange(weekEnd ?? new Date()).weekStart;
  const start = weekStart
    ? getWeekRange(weekStart).weekStart
    : new Date(end.getTime() - (DEFAULT_CHART_WEEKS - 1) * WEEK_IN_MS);

  return { weekStart: { $gte: start, $lte: end }, submittedAt: { $ne: null } };
}

async function buildTasksTrend(match) {
  const rows = await Report.aggregate([
    { $match: match },
    {
      $project: {
        weekStart: 1,
        completed: {
          $size: {
            $filter: {
              input: '$tasksCompleted',
              cond: { $eq: ['$$this.status', 'completed'] }
            }
          }
        }
      }
    },
    { $group: { _id: '$weekStart', value: { $sum: '$completed' } } },
    { $sort: { _id: 1 } }
  ]);

  return {
    labels: rows.map((row) => asWeekLabel(row._id)),
    values: rows.map((row) => row.value)
  };
}

async function buildStatusByMember(match) {
  const rows = await Report.aggregate([
    { $match: match },
    { $group: { _id: { user: '$userId', status: '$status' }, count: { $sum: 1 } } },
    {
      $group: {
        _id: '$_id.user',
        counts: { $push: { status: '$_id.status', count: '$count' } }
      }
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $sort: { 'user.name': 1 } }
  ]);

  const countFor = (row, status) =>
    row.counts.find((entry) => entry.status === status)?.count ?? 0;

  return {
    labels: rows.map((row) => row.user.name),
    series: REPORT_STATUSES.map((status) => ({
      name: status,
      values: rows.map((row) => countFor(row, status))
    }))
  };
}

async function buildWorkloadByProject(match) {
  const rows = await Report.aggregate([
    { $match: match },
    { $group: { _id: '$projectId', value: { $sum: { $sum: '$tasksCompleted.timeSpent' } } } },
    { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
    { $unwind: '$project' },
    { $sort: { value: -1 } }
  ]);

  return {
    labels: rows.map((row) => row.project.name),
    values: rows.map((row) => row.value)
  };
}

async function buildTimeByTaskType(match) {
  const [totals] = await Report.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        development: { $sum: '$hoursByType.development' },
        testing: { $sum: '$hoursByType.testing' },
        meetings: { $sum: '$hoursByType.meetings' },
        documentation: { $sum: '$hoursByType.documentation' }
      }
    }
  ]);

  return {
    labels: ['Development', 'Testing', 'Meetings', 'Documentation'],
    values: [
      totals?.development ?? 0,
      totals?.testing ?? 0,
      totals?.meetings ?? 0,
      totals?.documentation ?? 0
    ]
  };
}

const CHART_BUILDERS = {
  tasksTrend: buildTasksTrend,
  statusByMember: buildStatusByMember,
  workloadByProject: buildWorkloadByProject,
  timeByTaskType: buildTimeByTaskType
};

export function getChart(type, range) {
  return CHART_BUILDERS[type](buildRangeMatch(range));
}

export async function getSummary(requestedWeek) {
  const { weekStart, weekEnd } = getWeekRange(requestedWeek ?? new Date());
  const deadline = getSubmissionDeadline(weekStart);
  const submittedInWeek = { weekStart, submittedAt: { $ne: null } };

  const [expected, submitted, late, needsCorrection, blockers] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Report.countDocuments(submittedInWeek),
    Report.countDocuments({ weekStart, submittedAt: { $gt: deadline } }),
    Report.countDocuments({ status: 'needs_correction' }),
    Report.aggregate([
      { $match: submittedInWeek },
      { $group: { _id: null, total: { $sum: { $size: '$blockers' } } } }
    ])
  ]);

  return {
    weekStart,
    weekEnd,
    deadline,
    submittedThisWeek: submitted,
    needsCorrection,
    openBlockers: blockers[0]?.total ?? 0,
    compliance: {
      expected,
      submitted,
      late,
      pending: Math.max(expected - submitted, 0),
      rate: expected === 0 ? 0 : Number((submitted / expected).toFixed(2))
    }
  };
}

const withReportOwner = {
  path: 'reportId',
  select: 'weekStart userId',
  populate: { path: 'userId', select: 'name' }
};

const activityFor = (report) => ({
  reportId: report._id,
  reportOwner: report.userId?.name ?? null,
  week: report.weekStart
});

export async function getActivity(limit) {
  const [versions, reviews] = await Promise.all([
    ReportVersion.find().populate(withReportOwner).sort({ submittedAt: -1 }).limit(limit),
    ReviewComment.find()
      .populate(withReportOwner)
      .populate('managerId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
  ]);

  const submissions = versions
    .filter((version) => version.reportId)
    .map((version) => ({
      type: 'submission',
      at: version.submittedAt,
      actor: version.reportId.userId?.name ?? null,
      version: version.versionNumber,
      ...activityFor(version.reportId)
    }));

  const decisions = reviews
    .filter((review) => review.reportId)
    .map((review) => ({
      type: 'review',
      at: review.createdAt,
      actor: review.managerId?.name ?? null,
      action: review.action,
      comment: review.comment,
      ...activityFor(review.reportId)
    }));

  return [...submissions, ...decisions].sort((a, b) => b.at - a.at).slice(0, limit);
}
