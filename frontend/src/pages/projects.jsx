import { FolderKanban, Loader2, Pencil, Trash2 } from 'lucide-react'
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
import { createProject, deleteProject, updateProject } from '@/api/projects'
import { toFieldErrors } from '@/lib/form-errors'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const emptyForm = { name: '', description: '' }

function ProjectForm({ project, onSaved, onCancel }) {
  const isEditing = Boolean(project)

  const [form, setForm] = useState(
    project ? { name: project.name, description: project.description ?? '' } : emptyForm
  )
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
      const saved = isEditing ? await updateProject(project.id, form) : await createProject(form)

      setForm(emptyForm)
      toast.success(isEditing ? `${saved.name} updated` : `${saved.name} added`)
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
        <CardTitle>{isEditing ? 'Edit project' : 'Add project'}</CardTitle>
        <CardDescription>
          {isEditing ? `Changing ${project.name}.` : 'Reports are filed under one of these.'}
        </CardDescription>
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

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : null}
              {isEditing ? 'Save changes' : 'Save project'}
            </Button>

            {isEditing ? (
              <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ProjectTable({ projects, isLoading, editingId, onEdit, onDelete }) {
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} data-state={project.id === editingId ? 'selected' : undefined}>
              <TableCell className="font-medium whitespace-nowrap">{project.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-md">
                {project.description || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {dateFormatter.format(new Date(project.createdAt))}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(project)}
                    aria-label={`Edit ${project.name}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(project)}
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
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

  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSaved() {
    setEditingProject(null)
    await reload()
  }

  async function handleDelete() {
    setIsDeleting(true)

    try {
      await deleteProject(deletingProject.id)
      toast.success(`${deletingProject.name} deleted`)

      if (editingProject?.id === deletingProject.id) {
        setEditingProject(null)
      }

      await reload()
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setIsDeleting(false)
      setDeletingProject(null)
    }
  }

  return (
    <>
      <PageHeader title="Projects" subtitle="The tags that weekly reports are filed under." />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <ProjectForm
          key={editingProject?.id ?? 'new'}
          project={editingProject}
          onSaved={handleSaved}
          onCancel={() => setEditingProject(null)}
        />

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
              <ProjectTable
                projects={projects}
                isLoading={isLoading}
                editingId={editingProject?.id}
                onEdit={setEditingProject}
                onDelete={setDeletingProject}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => (open ? null : setDeletingProject(null))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deletingProject?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. A project already used by reports cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
