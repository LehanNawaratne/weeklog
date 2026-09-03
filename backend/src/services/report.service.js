import { Project } from '../models/Project.js';
import { Report } from '../models/Report.js';
import { ReportVersion } from '../models/ReportVersion.js';
import { ApiError } from '../utils/ApiError.js';
import { extractReportContent } from '../utils/reportContent.js';
import { getWeekRange } from '../utils/week.js';

const EDITABLE_STATUSES = ['draft', 'needs_correction'];

async function findProjectOrFail(projectId) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return project;
}

async function findOwnReportOrFail(reportId, userId) {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  if (!report.userId.equals(userId)) {
    throw new ApiError(403, 'You can only access your own reports');
  }

  return report;
}

export async function createReport({ weekStart, projectId }, userId) {
  await findProjectOrFail(projectId);

  const range = getWeekRange(weekStart);
  const existing = await Report.findOne({ userId, weekStart: range.weekStart });

  if (existing) {
    throw new ApiError(409, 'You already have a report for that week');
  }

  return Report.create({
    userId,
    projectId,
    weekStart: range.weekStart,
    weekEnd: range.weekEnd
  });
}

export async function updateReport(reportId, content, userId) {
  const report = await findOwnReportOrFail(reportId, userId);

  if (!EDITABLE_STATUSES.includes(report.status)) {
    throw new ApiError(409, `This report cannot be edited while it is ${report.status}`);
  }

  await findProjectOrFail(content.projectId);

  Object.assign(report, content);

  return report.save();
}

export async function submitReport(reportId, userId) {
  const report = await findOwnReportOrFail(reportId, userId);

  if (!EDITABLE_STATUSES.includes(report.status)) {
    throw new ApiError(409, `This report has already been ${report.status}`);
  }

  if (report.tasksCompleted.length === 0) {
    throw new ApiError(400, 'Add at least one completed task before submitting');
  }

  const previousVersions = await ReportVersion.countDocuments({ reportId: report._id });

  const version = await ReportVersion.create({
    reportId: report._id,
    versionNumber: previousVersions + 1,
    content: extractReportContent(report)
  });

  report.status = 'submitted';
  report.currentVersionId = version._id;
  report.submittedAt = report.submittedAt ?? version.submittedAt;

  return report.save();
}
