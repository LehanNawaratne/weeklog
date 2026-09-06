import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthShell } from '@/components/auth-shell'
import { FormField } from '@/components/form-field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { homePathFor, useAuth } from '@/context/auth-context'
import { toFieldErrors } from '@/lib/form-errors'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showBanner = error && Object.keys(fieldErrors).length === 0

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const user = await signIn(form)
      navigate(homePathFor(user), { replace: true })
    } catch (failure) {
      setError(failure.message)
      setFieldErrors(toFieldErrors(failure))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      description="Enter your details to reach your weekly reports."
      footer={
        <>
          No account yet?{' '}
          <Link to="/register" className="text-foreground font-medium underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {showBanner ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <FormField id="email" label="Email" error={fieldErrors.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField id="password" label="Password" error={fieldErrors.password}>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}
