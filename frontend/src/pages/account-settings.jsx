import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { changePassword, updateProfile } from '@/api/auth'
import { toFieldErrors } from '@/lib/form-errors'

const emptyPasswords = { currentPassword: '', newPassword: '' }

function ProfileCard() {
  const { user, setUser } = useAuth()

  const [form, setForm] = useState({ name: user.name, email: user.email })
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setFieldErrors({})
    setIsSaving(true)

    try {
      const updated = await updateProfile(form)
      setUser(updated)
      toast.success('Profile updated')
    } catch (failure) {
      if (failure.status === 409) {
        setFieldErrors({ email: failure.message })
      } else {
        const problems = toFieldErrors(failure)
        setFieldErrors(problems)

        if (Object.keys(problems).length === 0) {
          toast.error(failure.message)
        }
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your name shows on every report you submit.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
          <FormField id="name" label="Full name" error={fieldErrors.name}>
            <Input name="name" value={form.name} onChange={handleChange} minLength={2} required />
          </FormField>

          <FormField id="email" label="Email" error={fieldErrors.email}>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </FormField>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : null}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function PasswordCard() {
  const [form, setForm] = useState(emptyPasswords)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setFieldErrors({})
    setIsSaving(true)

    try {
      await changePassword(form)
      setForm(emptyPasswords)
      toast.success('Password updated')
    } catch (failure) {
      if (failure.status === 401) {
        setFieldErrors({ currentPassword: failure.message })
      } else {
        const problems = toFieldErrors(failure)
        setFieldErrors(problems)

        if (Object.keys(problems).length === 0) {
          toast.error(failure.message)
        }
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>You need your current password to set a new one.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
          <FormField id="currentPassword" label="Current password" error={fieldErrors.currentPassword}>
            <Input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </FormField>

          <FormField
            id="newPassword"
            label="New password"
            error={fieldErrors.newPassword}
            hint="At least 8 characters, and different from the current one."
          >
            <Input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              minLength={8}
              required
            />
          </FormField>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : null}
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function AccountSettingsPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Account settings" subtitle="Update your details or change your password." />

      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileCard />
        <PasswordCard />
      </div>
    </div>
  )
}
