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
