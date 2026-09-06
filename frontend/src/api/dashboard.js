import { api } from './client'

// Manager-only. All three endpoints are read-only.

// Returns the four headline numbers plus a compliance breakdown.
export async function getSummary(weekStart) {
  const res = await api.get('/dashboard/summary', { params: { weekStart } })
  return res.data
}

/**
 * type is one of:
 *   'tasksTrend'        - completed tasks per week
 *   'statusByMember'    - report statuses per person
 *   'workloadByProject' - hours spent per project
 *   'timeByTaskType'    - hours split across development/testing/meetings/docs
 *
 * The backend returns chart-ready { labels, values } or { labels, series },
 * so nothing needs reshaping here.
 */
export async function getChart(type, range) {
  const res = await api.get('/dashboard/charts', { params: { type, ...range } })
  return res.data
}

// Recent submissions and review decisions, newest first.
export async function getActivity(limit = 20) {
  const res = await api.get('/dashboard/activity', { params: { limit } })
  return res.data
}
