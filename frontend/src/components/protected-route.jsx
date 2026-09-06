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

/**
 * Wraps a group of routes and decides who is allowed to see them.
 *
 * <Outlet /> is React Router's placeholder for "the matched child route".
 * So this component either renders the page, or sends the person somewhere else.
 *
 * This is only a convenience for the user, NOT security. The real protection is
 * on the backend, which checks the session on every request. Hiding a page here
 * stops an accidental click; it does not stop a determined user.
 */
export function ProtectedRoute({ role }) {
  const { user, isLoading } = useAuth()

  // Still asking the backend who is signed in. Wait before deciding.
  if (isLoading) {
    return <FullPageLoader />
  }

  // Not signed in at all.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Signed in, but this page is for a different role.
  if (role && user.role !== role) {
    return <Navigate to={homePathFor(user)} replace />
  }

  return <Outlet />
}

/**
 * The opposite: for the login and register pages.
 * Someone already signed in should not see a login form again.
 */
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
