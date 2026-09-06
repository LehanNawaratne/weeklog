import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'

import { homePathFor, useAuth } from '@/context/auth-context'

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  )
}

export function ProtectedRoute({ role }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={homePathFor(user)} replace />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (user) {
    return <Navigate to={homePathFor(user)} replace />
  }

  return <Outlet />
}
