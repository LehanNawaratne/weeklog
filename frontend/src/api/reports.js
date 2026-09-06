import { api } from './client'

export async function listMyReports(filters) {
  const res = await api.get('/reports/mine', { params: filters })
  return { reports: res.data, pagination: res.pagination }
}

export async function getMyReport(id) {
  const res = await api.get(`/reports/mine/${id}`)
  return res.data
}

export async function createReport({ weekStart, projectId }) {
  const res = await api.post('/reports', { weekStart, projectId })
  return res.data
}

export async function updateReport(id, content) {
  const res = await api.put(`/reports/${id}`, content)
  return res.data
}

export async function submitReport(id) {
  const res = await api.post(`/reports/${id}/submit`)
  return res.data
}

export async function listReportVersions(id) {
  const res = await api.get(`/reports/${id}/versions`)
  return res.data
}

export async function listAllReports(filters) {
  const res = await api.get('/reports', { params: filters })
  return { reports: res.data, pagination: res.pagination }
}

export async function getReport(id) {
  const res = await api.get(`/reports/${id}`)
  return res.data
}

export async function reviewReport(id, { action, comment }) {
  const res = await api.post(`/reports/${id}/review`, { action, comment })
  return res.data
}
