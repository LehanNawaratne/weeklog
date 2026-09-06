import { FolderKanban, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useProjects } from '@/hooks/use-projects'
import { createProject } from '@/api/projects'
import { toFieldErrors } from '@/lib/form-errors'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const emptyForm = { name: '', description: '' }

function ProjectForm({ onSaved }) {
  const [form, setForm] = useState(emptyForm)
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
      const project = await createProject(form)
      setForm(emptyForm)
      toast.success(`${project.name} added`)
      await onSaved()
    } catch (failure) {
      const problems = toFieldErrors(failure)
      setFieldErrors(problems)

      if (Object.keys(problems).length === 0) {
        toast.error(failure.message)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Add project</CardTitle>
        <CardDescription>Reports are filed under one of these.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField id="name" label="Name" error={fieldErrors.name}>
            <Input
              name="name"
              placeholder="Client A"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={60}
              required
            />
          </FormField>

          <FormField
            id="description"
            label="Description"
            error={fieldErrors.description}
            hint="Optional. Up to 300 characters."
          >
            <Textarea
              name="description"
              placeholder="What kind of work belongs here?"
              value={form.description}
              onChange={handleChange}
              maxLength={300}
              rows={3}
            />
          </FormField>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : null}
            Save project
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ProjectTable({ projects, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((row) => (
          <Skeleton key={row} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="border-border text-muted-foreground flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center">
        <FolderKanban className="size-5" />
        <p className="text-sm font-medium">No projects yet</p>
        <p className="max-w-xs text-xs">Add the first one using the form beside this list.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="whitespace-nowrap">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium whitespace-nowrap">{project.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-md">
                {project.description || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {dateFormatter.format(new Date(project.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ProjectsPage() {
  const { projects, isLoading, error, reload } = useProjects()

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="The tags that weekly reports are filed under."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <ProjectForm onSaved={reload} />

        <Card>
          <CardHeader>
            <CardTitle>All projects</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading…' : `${projects.length} in use across the team.`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error ? (
              <p className="text-destructive text-sm">{error}</p>
            ) : (
              <ProjectTable projects={projects} isLoading={isLoading} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
