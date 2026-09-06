import { createContext, useContext, useEffect, useState } from 'react'

import * as authApi from '@/api/auth'

/**
 * Holds "who is signed in" for the whole app.
 *
 * React Context is a way to share one value with every component without
 * passing it down through props at every level. Any component can read it
 * with the useAuth() hook at the bottom of this file.
 *
 * There is no token stored in JavaScript. The backend keeps the session in an
 * httpOnly cookie the browser sends automatically, so the only way to know who
 * is signed in is to ask the backend - which is what loadUser() does below.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Starts as true so the app shows a loading screen instead of briefly
  // flashing the login page while we check the cookie.
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        setUser(await authApi.getMe())
      } catch {
        // A 401 here just means "not signed in". That is normal, not an error.
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  async function signIn(credentials) {
    const signedInUser = await authApi.login(credentials)
    setUser(signedInUser)
    return signedInUser
  }

  async function signUp(details) {
    const newUser = await authApi.register(details)
    setUser(newUser)
    return newUser
  }

  async function signOut() {
    await authApi.logout()
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    isManager: user?.role === 'manager',
    signIn,
    signUp,
    signOut,
    // Used by the account settings page so the top bar updates immediately
    // after someone changes their own name.
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth() must be used inside <AuthProvider>')
  }

  return context
}

// Where to send someone after they sign in, based on their role.
export function homePathFor(user) {
  return user?.role === 'manager' ? '/dashboard' : '/my-reports'
}
