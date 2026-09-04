export function toPublicReport(report) {
  return {
    id: report._id,
    userId: report.userId,
    projectId: report.projectId,
    weekStart: report.weekStart,
    weekEnd: report.weekEnd,
    status: report.status,
    tasksCompleted: report.tasksCompleted,
    tasksPlannedNextWeek: report.tasksPlannedNextWeek,
    blockers: report.blockers,
    achievements: report.achievements,
    hoursByType: report.hoursByType,
    notes: report.notes,
    latestComment: report.latestComment,
    currentVersionId: report.currentVersionId,
    submittedAt: report.submittedAt,
    reviewedAt: report.reviewedAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  };
}

export function toReportSummary(report) {
  return {
    id: report._id,
    user: report.userId && { id: report.userId._id, name: report.userId.name },
    project: report.projectId && { id: report.projectId._id, name: report.projectId.name },
    weekStart: report.weekStart,
    weekEnd: report.weekEnd,
    status: report.status,
    taskCount: report.tasksCompleted.length,
    blockerCount: report.blockers.length,
    latestComment: report.latestComment,
    submittedAt: report.submittedAt,
    reviewedAt: report.reviewedAt
  };
}
