import axios from 'axios'

/**
 * One shared connection to the backend.
 *
 * Every request in the app goes through this file. That means the base URL,
 * the session cookie and error handling are configured once, not in every page.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',

  // The backend puts the login token in an httpOnly cookie. The browser will
  // only attach that cookie to a cross-origin request when this is true.
  // Without it every request looks logged out.
  withCredentials: true
})

/**
 * Turns any failed request into a plain Error with a readable message,
 * so pages can do `catch (error) { setMessage(error.message) }`.
 */
function toApiError(error) {
  const body = error.response?.data

  const apiError = new Error(
    body?.message ?? 'Could not reach the server. Is the backend running?'
  )

  // 401 = not logged in, 403 = logged in but not allowed, 409 = conflict.
  apiError.status = error.response?.status ?? 0

  // The backend sends per-field messages when validation fails,
  // e.g. [{ field: 'email', message: 'Enter a valid email address' }]
  apiError.fieldErrors = body?.errors ?? []

  return apiError
}

// The backend always answers with { success, data } and adds `pagination`
// on list endpoints. We return that whole object and let each api/*.js file
// pick the part it needs.
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(toApiError(error))
)
