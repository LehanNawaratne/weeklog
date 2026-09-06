import { api } from './client'

export async function getSummary(weekStart) {
  const res = await api.get('/dashboard/summary', { params: { weekStart } })
  return res.data
}

export async function getChart(type, range) {
  const res = await api.get('/dashboard/charts', { params: { type, ...range } })
  return res.data
}

export async function getActivity(limit = 20) {
  const res = await api.get('/dashboard/activity', { params: { limit } })
  return res.data
}
