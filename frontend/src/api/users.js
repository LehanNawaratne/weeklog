import { api } from './client'

// Manager-only, except getUser which also works for viewing yourself.

// filters: { page, limit }
export async function listUsers(filters) {
  const res = await api.get('/users', { params: filters })
  return { users: res.data, pagination: res.pagination }
}

// Includes reportStats: { total, submitted, needsCorrection, approved }
export async function getUser(id) {
  const res = await api.get(`/users/${id}`)
  return res.data
}

// The response includes a one-time inviteToken. Show it to the manager once -
// the backend only stores a hash of it and cannot show it again.
export async function inviteUser({ name, email, role }) {
  const res = await api.post('/users/invite', { name, email, role })
  return res.data
}

// Refused by the backend if it would leave no managers.
export async function updateUserRole(id, role) {
  const res = await api.patch(`/users/${id}/role`, { role })
  return res.data
}

export async function assignProjects(id, projectIds) {
  const res = await api.patch(`/users/${id}/projects`, { projectIds })
  return res.data
}

// This deactivates the account rather than erasing it, so the person's
// past reports stay readable.
export async function removeUser(id) {
  const res = await api.delete(`/users/${id}`)
  return res.data
}
