import { api } from './client'

export async function listProjects() {
  const res = await api.get('/projects')
  return res.data
}

export async function createProject({ name, description }) {
  const res = await api.post('/projects', { name, description })
  return res.data
}

export async function updateProject(id, changes) {
  const res = await api.patch(`/projects/${id}`, changes)
  return res.data
}

export async function deleteProject(id) {
  await api.delete(`/projects/${id}`)
}
