import { api } from './client'

// Any signed-in user can read the list. Only managers can change it.

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

// Fails with a 409 if any report already uses this project.
export async function deleteProject(id) {
  await api.delete(`/projects/${id}`)
}
