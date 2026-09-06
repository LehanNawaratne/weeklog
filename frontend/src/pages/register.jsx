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

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const user = await signUp(form)
      navigate(homePathFor(user), { replace: true })
    } catch (failure) {
      setError(failure.message)
      setFieldErrors(
        failure.status === 409 ? { email: failure.message } : toFieldErrors(failure)
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create an account"
      description="New accounts join as a team member."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
            Sign in
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

        <FormField id="name" label="Full name" error={fieldErrors.name}>
          <Input
            name="name"
            autoComplete="name"
            placeholder="Sam Fernando"
            value={form.name}
            onChange={handleChange}
            minLength={2}
            required
          />
        </FormField>

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

        <FormField
          id="password"
          label="Password"
          error={fieldErrors.password}
          hint="At least 8 characters."
        >
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
