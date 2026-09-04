import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { getSubmissionDeadline, getWeekRange } from '../utils/week.js';

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
