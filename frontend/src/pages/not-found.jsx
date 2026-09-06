import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { homePathFor, useAuth } from '@/context/auth-context'

export function NotFoundPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">This page does not exist</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        The link may be out of date, or the address may have a typo in it.
      </p>
      <Button asChild>
        <Link to={user ? homePathFor(user) : '/login'}>Go back</Link>
      </Button>
    </div>
  )
}
