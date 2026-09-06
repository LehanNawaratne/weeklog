import { api } from './client'

/**
 * IMPORTANT - filter names
 *
 * The backend expects `userId`, `from` and `to`.
 * The written API contract calls them `memberId`, `weekStart` and `weekEnd`.
 * The backend wins. Sending the wrong name does NOT cause an error - the
 * backend quietly ignores it and returns everything, which looks like a
 * broken filter. Always use the names below.
 */

// ---------------------------------------------------------------- team member

// filters: { status, projectId, from, to, page, limit }
export async function listMyReports(filters) {
  const res = await api.get('/reports/mine', { params: filters })
  return { reports: res.data, pagination: res.pagination }
}

// Returns the report plus its version snapshots and review comments.
export async function getMyReport(id) {
  const res = await api.get(`/reports/mine/${id}`)
  return res.data
}

// Creates an empty report for a week. It starts as a draft.
export async function createReport({ weekStart, projectId }) {
  const res = await api.post('/reports', { weekStart, projectId })
  return res.data
}

// Saves the whole report. Only works while it is a draft or needs correction.
export async function updateReport(id, content) {
  const res = await api.put(`/reports/${id}`, content)
  return res.data
}

// Sends the report to the manager and saves a version snapshot.
export async function submitReport(id) {
  const res = await api.post(`/reports/${id}/submit`)
  return res.data
}

export async function listReportVersions(id) {
  const res = await api.get(`/reports/${id}/versions`)
  return res.data
}

// -------------------------------------------------------------------- manager

// filters: { userId, projectId, status, from, to, page, limit }
export async function listAllReports(filters) {
  const res = await api.get('/reports', { params: filters })
  return { reports: res.data, pagination: res.pagination }
}

export async function getReport(id) {
  const res = await api.get(`/reports/${id}`)
  return res.data
}

// action is 'approve' or 'request_changes'. A comment is required to request changes.
export async function reviewReport(id, { action, comment }) {
  const res = await api.post(`/reports/${id}/review`, { action, comment })
  return res.data
}
