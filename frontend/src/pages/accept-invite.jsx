import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { AuthShell } from '@/components/auth-shell'
import { FormField } from '@/components/form-field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { homePathFor, useAuth } from '@/context/auth-context'
import { acceptInvite } from '@/api/auth'

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams()
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const [token, setToken] = useState(() => searchParams.get('token') ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setFieldErrors({})
    setIsSaving(true)

    try {
      const user = await acceptInvite({ token, password })
      setUser(user)
      navigate(homePathFor(user), { replace: true })
    } catch (failure) {
      setError(failure.message)
      setFieldErrors(
        failure.status === 400 && failure.fieldErrors.length === 0
          ? { token: failure.message }
          : {}
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthShell
      title="Set your password"
      description="Your manager invited you. Choose a password to finish setting up."
      footer={
        <>
          Already set up?{' '}
          <Link to="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && Object.keys(fieldErrors).length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          id="token"
          label="Invite code"
          error={fieldErrors.token}
          hint="Taken from your invite link."
        >
          <Input value={token} onChange={(event) => setToken(event.target.value)} required />
        </FormField>

        <FormField
          id="password"
          label="Choose a password"
          error={fieldErrors.password}
          hint="At least 8 characters."
        >
          <Input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </FormField>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" /> : null}
          Set password and sign in
        </Button>
      </form>
    </AuthShell>
  )
}
