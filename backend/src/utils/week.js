import { SUBMISSION_DEADLINE_DAY_OFFSET, SUBMISSION_DEADLINE_HOUR } from '../config/constants.js';

export function getWeekRange(date) {
  const given = new Date(date);
  const dayOfWeek = given.getUTCDay();
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(
    Date.UTC(given.getUTCFullYear(), given.getUTCMonth(), given.getUTCDate() + offsetToMonday)
  );

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

  return { weekStart, weekEnd };
}

export function getSubmissionDeadline(weekStart) {
  const deadline = new Date(weekStart);

  deadline.setUTCDate(deadline.getUTCDate() + SUBMISSION_DEADLINE_DAY_OFFSET);
  deadline.setUTCHours(SUBMISSION_DEADLINE_HOUR, 0, 0, 0);

  return deadline;
}
