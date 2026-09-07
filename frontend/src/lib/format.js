const dateOnly = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const dateAndTime = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

export function formatDate(value) {
  return dateOnly.format(new Date(value))
}

export function formatDateTime(value) {
  return dateAndTime.format(new Date(value))
}
