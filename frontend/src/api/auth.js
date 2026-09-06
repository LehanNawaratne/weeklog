import { api } from './client'

export async function register(details) {
  const res = await api.post('/auth/register', details)
  return res.data
}

export async function login(credentials) {
  const res = await api.post('/auth/login', credentials)
  return res.data
}

export async function logout() {
  await api.post('/auth/logout')
}

export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data
}

export async function acceptInvite(details) {
  const res = await api.post('/auth/accept-invite', details)
  return res.data
}

export async function updateProfile(changes) {
  const res = await api.patch('/auth/me', changes)
  return res.data
}

export async function changePassword(passwords) {
  await api.patch('/auth/me/password', passwords)
}
