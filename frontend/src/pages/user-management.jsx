import { Check, Copy, Loader2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { PageHeader } from '@/components/page-header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useAuth } from '@/context/auth-context'
import { useUsers } from '@/hooks/use-users'
import { inviteUser, removeUser, updateUserRole } from '@/api/users'
import { toFieldErrors } from '@/lib/form-errors'

const emptyInvite = { name: '', email: '', role: 'member' }

function InviteLink({ user, onDismiss }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/accept-invite?token=${user.inviteToken}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast.success('Invite link copied')
    } catch {
      toast.error('Could not copy. Select the text and copy it manually.')
    }
  }

  return (
    <Card className="border-brand/50 bg-brand-muted/40 mb-4">
      <CardHeader>
        <CardTitle className="text-base">Invite link for {user.name}</CardTitle>
        <CardDescription>
          Send this to them. It is shown once — the server only keeps a hashed copy, so it cannot be
          shown again.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input readOnly value={link} onFocus={(event) => event.target.select()} />
        <div className="flex gap-2">
          <Button type="button" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>
          <Button type="button" variant="ghost" onClick={onDismiss}>
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function InviteForm({ onInvited }) {
  const [form, setForm] = useState(emptyInvite)
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
      const invited = await inviteUser(form)
      setForm(emptyInvite)
      toast.success(`${invited.name} invited`)
      await onInvited(invited)
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
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Invite someone</CardTitle>
        <CardDescription>They set their own password from the link you send.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField id="invite-name" label="Full name" error={fieldErrors.name}>
            <Input
              name="name"
              placeholder="Sam Fernando"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              required
            />
          </FormField>

          <FormField id="invite-email" label="Email" error={fieldErrors.email}>
            <Input
              name="email"
              type="email"
              placeholder="sam@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </FormField>

          <FormField id="invite-role" label="Role" error={fieldErrors.role}>
            <Select
              value={form.role}
              onValueChange={(role) => setForm((current) => ({ ...current, role }))}
            >
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Team member</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <UserPlus className="size-4" />}
            Send invite
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function UserManagementPage() {
  const { user: signedInUser } = useAuth()
  const { users, isLoading, error, reload } = useUsers()

  const [invited, setInvited] = useState(null)
  const [removing, setRemoving] = useState(null)
  const [busyId, setBusyId] = useState(null)

  async function handleInvited(newUser) {
    setInvited(newUser)
    await reload()
  }

  async function changeRole(person, role) {
    setBusyId(person.id)

    try {
      await updateUserRole(person.id, role)
      toast.success(`${person.name} is now a ${role}`)
      await reload()
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setBusyId(null)
    }
  }

  async function confirmRemove() {
    setBusyId(removing.id)

    try {
      await removeUser(removing.id)
      toast.success(`${removing.name} removed`)
      await reload()
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setBusyId(null)
      setRemoving(null)
    }
  }

  return (
    <>
      <PageHeader
        title="User management"
        subtitle="Invite people, change roles, and remove accounts."
      />

      {invited?.inviteToken ? (
        <InviteLink user={invited} onDismiss={() => setInvited(null)} />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <InviteForm onInvited={handleInvited} />

        <Card>
          <CardHeader>
            <CardTitle>Everyone</CardTitle>
            <CardDescription>
              Removing someone keeps their past reports and blocks them from signing in.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error ? <p className="text-destructive text-sm">{error}</p> : null}

            {!error && isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((row) => (
                  <Skeleton key={row} className="h-10 w-full" />
                ))}
              </div>
            ) : null}

            {!error && !isLoading ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-40">Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((person) => {
                      const isSelf = person.id === signedInUser?.id
                      const isBusy = busyId === person.id

                      return (
                        <TableRow key={person.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {person.name}
                            {isSelf ? (
                              <span className="text-muted-foreground ml-2 text-xs">you</span>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{person.email}</TableCell>
                          <TableCell>
                            <Select
                              value={person.role}
                              disabled={isBusy || !person.isActive}
                              onValueChange={(role) => changeRole(person, role)}
                            >
                              <SelectTrigger aria-label={`Role for ${person.name}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">Team member</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground text-xs capitalize">
                              {person.isActive ? person.accountStatus : 'removed'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isSelf || isBusy || !person.isActive}
                                onClick={() => setRemoving(person)}
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={Boolean(removing)}
        onOpenChange={(open) => (open ? null : setRemoving(null))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removing?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will not be able to sign in again. Their past reports stay in the system so the
              team history is not broken.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
