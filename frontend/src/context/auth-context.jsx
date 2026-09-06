import { createContext, useContext, useEffect, useState } from 'react'

import * as authApi from '@/api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        setUser(await authApi.getMe())
      } catch {
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

export function homePathFor(user) {
  return user?.role === 'manager' ? '/dashboard' : '/my-reports'
}
