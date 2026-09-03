export function extractReportContent(report) {
  const { tasksCompleted, tasksPlannedNextWeek, blockers, achievements, hoursByType, notes } =
    report.toObject();

  return { tasksCompleted, tasksPlannedNextWeek, blockers, achievements, hoursByType, notes };
}
