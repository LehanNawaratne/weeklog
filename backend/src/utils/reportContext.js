function formatDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatTask(task) {
  const progress = `planned ${task.plannedPct}%, actual ${task.actualPct}%`;
  const time = `${task.timeSpent}h spent of ${task.timePlanned}h planned`;
  const output = task.output ? `, output: ${task.output}` : '';

  return `  - ${task.taskName} [${task.status}, ${task.priority} priority, ${progress}, ${time}${output}]`;
}

function formatFlaggedItems(items, flagField) {
  return items.map((item) => `  - ${item[flagField] ? '[key] ' : ''}${item.text}`);
}

function formatLines(values) {
  return values.map((value) => `  - ${value}`);
}

function section(label, lines) {
  return lines.length ? [`${label}:`, ...lines] : [`${label}: none`];
}

function formatReport(report) {
  const hours = report.hoursByType;

  const lines = [
    `member: ${report.userId?.name ?? 'unknown'}`,
    `week: ${formatDate(report.weekStart)} to ${formatDate(report.weekEnd)}`,
    `project: ${report.projectId?.name ?? 'unknown'}`,
    `status: ${report.status}`,
    ...section('tasks completed', report.tasksCompleted.map(formatTask)),
    ...section('planned next week', formatLines(report.tasksPlannedNextWeek)),
    ...section('blockers', formatFlaggedItems(report.blockers, 'isKeyIssue')),
    ...section('achievements', formatFlaggedItems(report.achievements, 'isKeyAchievement')),
    `hours: development ${hours.development}, testing ${hours.testing}, meetings ${hours.meetings}, documentation ${hours.documentation}`,
    `notes: ${report.notes || 'none'}`
  ];

  return `<report>\n${lines.join('\n')}\n</report>`;
}

export function formatReportsForPrompt(reports) {
  if (!reports.length) {
    return 'No reports match that query.';
  }

  return reports.map(formatReport).join('\n\n');
}

export function formatMembersForPrompt(members) {
  if (!members.length) {
    return 'No active team members.';
  }

  return members.map((member) => `- ${member.name} (userId: ${member._id})`).join('\n');
}

export function formatProjectsForPrompt(projects) {
  if (!projects.length) {
    return 'No projects.';
  }

  return projects.map((project) => `- ${project.name} (projectId: ${project._id})`).join('\n');
}
