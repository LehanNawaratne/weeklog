import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true
})

function toApiError(error) {
  const body = error.response?.data

  const apiError = new Error(
    body?.message ?? 'Could not reach the server. Is the backend running?'
  )

  apiError.status = error.response?.status ?? 0
  apiError.fieldErrors = body?.errors ?? []

  return apiError
}

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(toApiError(error))
)
