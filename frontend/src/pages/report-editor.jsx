import { AlertCircle, Loader2, Lock, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { PageHeader } from '@/components/page-header'
import { ProjectPicker } from '@/components/project-picker'
import { RequiredMark } from '@/components/required-mark'
import { FlaggedList } from '@/components/report/flagged-list'
import { StringList } from '@/components/report/string-list'
import { TaskTable } from '@/components/report/task-table'
import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { createReport, getMyReport, submitReport, updateReport } from '@/api/reports'
import { toFieldErrors } from '@/lib/form-errors'
import { formatWeekRange, toDateInputValue, today } from '@/lib/week'

const EDITABLE = ['draft', 'needs_correction']

const HOURS_FIELDS = [
  { name: 'development', label: 'Development' },
  { name: 'testing', label: 'Testing' },
  { name: 'meetings', label: 'Meetings' },
  { name: 'documentation', label: 'Documentation' }
]

function weekLabelFor(value) {
  if (!value) return null

  const parsed = new Date(value)

  return Number.isNaN(parsed.getTime()) ? null : formatWeekRange(parsed)
}

const TASK_NUMBER_FIELDS = ['plannedPct', 'actualPct', 'timePlanned', 'timeSpent']

function taskToFormState(task) {
  return {
    ...task,
    ...Object.fromEntries(TASK_NUMBER_FIELDS.map((field) => [field, String(task[field] ?? 0)]))
  }
}

function taskToPayload(task) {
  return {
    taskName: task.taskName,
    priority: task.priority,
    status: task.status,
    output: task.output ?? '',
    ...Object.fromEntries(TASK_NUMBER_FIELDS.map((field) => [field, Number(task[field]) || 0]))
  }
}

function toFormState(report) {
  const hours = report.hoursByType ?? {}

  return {
    projectId: report.projectId,
    tasksCompleted: (report.tasksCompleted ?? []).map(taskToFormState),
    tasksPlannedNextWeek: report.tasksPlannedNextWeek ?? [],
    blockers: report.blockers ?? [],
    achievements: report.achievements ?? [],
    hoursByType: Object.fromEntries(
      HOURS_FIELDS.map(({ name }) => [name, String(hours[name] ?? 0)])
    ),
    notes: report.notes ?? ''
  }
}

function withText(items) {
  return items
    .map((item) => ({ ...item, text: item.text.trim() }))
    .filter((item) => item.text.length > 0)
}

function toPayload(form) {
  return {
    projectId: form.projectId,
    tasksCompleted: form.tasksCompleted.map(taskToPayload),
    tasksPlannedNextWeek: form.tasksPlannedNextWeek
      .map((task) => task.trim())
      .filter((task) => task.length > 0),
    blockers: withText(form.blockers),
    achievements: withText(form.achievements),
    hoursByType: Object.fromEntries(
      HOURS_FIELDS.map(({ name }) => [name, Number(form.hoursByType[name]) || 0])
    ),
    notes: form.notes
  }
}

function StartReport() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [weekStart, setWeekStart] = useState(
    () => searchParams.get('week') ?? toDateInputValue(today())
  )
  const [projectId, setProjectId] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const weekLabel = weekLabelFor(weekStart)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!projectId) {
      setFieldErrors({ projectId: 'Choose a project for this report.' })
      return
    }

    setFieldErrors({})
    setIsSaving(true)

    try {
      const report = await createReport({ weekStart, projectId })
      toast.success('Draft created')
      navigate(`/my-reports/${report.id}/edit`, { replace: true })
    } catch (failure) {
      if (failure.status === 409) {
        setFieldErrors({ weekStart: failure.message })
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
    <>
      <PageHeader
        title="Start a weekly report"
        subtitle="Pick the week and the project. You can fill in the details next."
      />

      <Card className="max-w-md">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id="weekStart"
              label="Week"
              error={fieldErrors.weekStart}
              hint={weekLabel ? `Week of ${weekLabel}` : 'Any day inside the week works.'}
            >
              <Input
                type="date"
                value={weekStart}
                onChange={(event) => setWeekStart(event.target.value)}
                required
              />
            </FormField>

            <FormField id="projectId" label="Project" error={fieldErrors.projectId}>
              <ProjectPicker value={projectId} onChange={setProjectId} />
            </FormField>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" /> : null}
                Create report
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/my-reports')}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

function LockedReport({ report }) {
  return (
    <>
      <PageHeader title={`Week of ${formatWeekRange(report.weekStart)}`}>
        <StatusBadge status={report.status} />
      </PageHeader>

      <Card className="max-w-lg">
        <CardContent className="flex flex-col items-start gap-3 py-8">
          <Lock className="text-muted-foreground size-5" />
          <p className="text-sm font-medium">This report can no longer be edited</p>
          <p className="text-muted-foreground text-sm">
            Only a draft or a report sent back for correction can be changed. Your manager has this
            one now.
          </p>
          <Button asChild>
            <Link to={`/reports/${report.id}`}>View the report</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

function EditReport({ id }) {
  const navigate = useNavigate()

  const [report, setReport] = useState(null)
  const [form, setForm] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const detail = await getMyReport(id)
        setReport(detail.report)
        setForm(toFormState(detail.report))
        setLoadError('')
      } catch (failure) {
        setLoadError(failure.message)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleHoursChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      hoursByType: { ...current.hoursByType, [name]: value }
    }))
  }

  function firstProblem() {
    const unnamed = form.tasksCompleted.findIndex((task) => !task.taskName.trim())

    return unnamed === -1 ? null : `Task ${unnamed + 1} needs a name before this can be saved.`
  }

  function showFailure(failure) {
    const problems = toFieldErrors(failure)
    setFieldErrors(problems)

    if (Object.keys(problems).length === 0) {
      toast.error(failure.message)
    }
  }

  async function handleSaveDraft() {
    const problem = firstProblem()

    if (problem) {
      toast.error(problem)
      return
    }

    setFieldErrors({})
    setIsSaving(true)

    try {
      await updateReport(id, toPayload(form))
      toast.success('Draft saved')
    } catch (failure) {
      showFailure(failure)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSubmitForReview(event) {
    event.preventDefault()

    const problem = firstProblem()

    if (problem) {
      toast.error(problem)
      return
    }

    if (form.tasksCompleted.length === 0) {
      toast.error('Add at least one completed task before sending this for review.')
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await updateReport(id, toPayload(form))
      await submitReport(id)
      toast.success('Report sent to your manager')
      navigate('/my-reports')
    } catch (failure) {
      showFailure(failure)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (loadError) {
    return (
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle />
        <AlertDescription>{loadError}</AlertDescription>
      </Alert>
    )
  }

  if (!EDITABLE.includes(report.status)) {
    return <LockedReport report={report} />
  }

  return (
    <form onSubmit={handleSubmitForReview} className="max-w-3xl">
      <PageHeader
        title={`Week of ${formatWeekRange(report.weekStart)}`}
        subtitle="The week cannot be changed once a report exists."
      >
        <StatusBadge status={report.status} />
      </PageHeader>

      {report.status === 'needs_correction' && report.latestComment ? (
        <Alert className="border-status-correction/40 bg-status-correction-bg mb-4">
          <AlertCircle className="text-status-correction" />
          <AlertTitle>Your manager asked for changes</AlertTitle>
          <AlertDescription>{report.latestComment}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Project
              <RequiredMark />
            </CardTitle>
            <CardDescription>Which work this week belongs to.</CardDescription>
          </CardHeader>
          <CardContent className="max-w-sm">
            <FormField id="projectId" label="Project" error={fieldErrors.projectId}>
              <ProjectPicker
                value={form.projectId}
                onChange={(value) => updateField('projectId', value)}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Tasks completed
              <RequiredMark />
            </CardTitle>
            <CardDescription>
              At least one is needed before this report can be sent for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTable
              value={form.tasksCompleted}
              onChange={(next) => updateField('tasksCompleted', next)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks planned for next week</CardTitle>
            <CardDescription>What you intend to pick up next week.</CardDescription>
          </CardHeader>
          <CardContent>
            <StringList
              value={form.tasksPlannedNextWeek}
              onChange={(next) => updateField('tasksPlannedNextWeek', next)}
              placeholder="Finish the refund flow"
              addLabel="Add a task"
              emptyLabel="Nothing planned yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockers</CardTitle>
            <CardDescription>
              Star the one holding you back the most.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FlaggedList
              value={form.blockers}
              onChange={(next) => updateField('blockers', next)}
              flagField="isKeyIssue"
              flagLabel="Key issue"
              placeholder="Waiting on the payment provider sandbox"
              addLabel="Add a blocker"
              emptyLabel="No blockers this week."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Star the one you are proudest of.</CardDescription>
          </CardHeader>
          <CardContent>
            <FlaggedList
              value={form.achievements}
              onChange={(next) => updateField('achievements', next)}
              flagField="isKeyAchievement"
              flagLabel="Key highlight"
              placeholder="Checkout errors down 40%"
              addLabel="Add an achievement"
              emptyLabel="Nothing recorded yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours worked</CardTitle>
            <CardDescription>Roughly how the week was spent.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOURS_FIELDS.map(({ name, label }) => (
              <FormField
                key={name}
                id={`hours-${name}`}
                label={label}
                error={fieldErrors[`hoursByType.${name}`]}
              >
                <Input
                  name={name}
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.hoursByType[name]}
                  onChange={handleHoursChange}
                />
              </FormField>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Anything else worth knowing.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              id="notes"
              label="Notes or links"
              error={fieldErrors.notes}
              hint="Up to 2000 characters."
            >
              <Textarea
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                maxLength={2000}
                rows={4}
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={isSaving || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="size-4" />}
            Submit for review
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : null}
            Save as draft
          </Button>

          <Button asChild type="button" variant="ghost">
            <Link to="/my-reports">Back to my reports</Link>
          </Button>

          <p className="text-muted-foreground w-full text-xs sm:w-auto sm:flex-1 sm:text-right">
            Submitting saves a snapshot your manager reviews.
          </p>
        </div>
      </div>
    </form>
  )
}

export function ReportEditorPage() {
  const { id } = useParams()

  return id ? <EditReport id={id} /> : <StartReport />
}
