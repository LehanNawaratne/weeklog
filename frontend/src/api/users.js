import { api } from './client'

export async function listUsers(filters) {
  const res = await api.get('/users', { params: filters })
  return { users: res.data, pagination: res.pagination }
}

export async function getUser(id) {
  const res = await api.get(`/users/${id}`)
  return res.data
}

export async function inviteUser({ name, email, role }) {
  const res = await api.post('/users/invite', { name, email, role })
  return res.data
}

export async function updateUserRole(id, role) {
  const res = await api.patch(`/users/${id}/role`, { role })
  return res.data
}

export async function assignProjects(id, projectIds) {
  const res = await api.patch(`/users/${id}/projects`, { projectIds })
  return res.data
}

export async function removeUser(id) {
  const res = await api.delete(`/users/${id}`)
  return res.data
}
