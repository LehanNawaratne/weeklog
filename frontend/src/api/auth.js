import { api } from './client'

// Matches the backend's /api/auth routes.

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

// Called on every page load to find out who is signed in.
// Throws a 401 error when nobody is.
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
