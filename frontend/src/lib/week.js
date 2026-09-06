const dayOnly = new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: 'UTC' })

const dayMonth = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC'
})

const dayMonthYear = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
})

export function today() {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export function startOfWeek(date) {
  const given = new Date(date)
  const dayOfWeek = given.getUTCDay()
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  return new Date(
    Date.UTC(given.getUTCFullYear(), given.getUTCMonth(), given.getUTCDate() + offsetToMonday)
  )
}

export function endOfWeek(date) {
  const weekEnd = startOfWeek(date)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)

  return weekEnd
}

export function weekKey(date) {
  return startOfWeek(date).toISOString().slice(0, 10)
}

export function toDateInputValue(date) {
  return new Date(date).toISOString().slice(0, 10)
}

export function formatWeekRange(date) {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  const startLabel = start.getUTCMonth() === end.getUTCMonth() ? dayOnly : dayMonth

  return `${startLabel.format(start)} – ${dayMonthYear.format(end)}`
}

export function recentWeeks(count) {
  const thisWeek = startOfWeek(today())

  return Array.from({ length: count }, (unused, index) => {
    const week = new Date(thisWeek)
    week.setUTCDate(week.getUTCDate() - index * 7)

    return week
  })
}
