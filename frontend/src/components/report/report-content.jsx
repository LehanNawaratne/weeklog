import { Star } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' }

const TASK_STATUS_STYLES = {
  completed: { label: 'Completed', className: 'bg-status-approved-bg text-status-approved' },
  in_progress: { label: 'In progress', className: 'bg-status-draft-bg text-status-draft' },
  blocked: { label: 'Blocked', className: 'bg-status-correction-bg text-status-correction' }
}

const HOURS_FIELDS = [
  { name: 'development', label: 'Development' },
  { name: 'testing', label: 'Testing' },
  { name: 'meetings', label: 'Meetings' },
  { name: 'documentation', label: 'Documentation' }
]

function Section({ title, count, children }) {
  return (
    <section className="border-border border-t pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {title}
        {count === undefined ? null : (
          <span className="text-muted-foreground text-xs font-normal">{count}</span>
        )}
      </h3>
      {children}
    </section>
  )
}

function Empty({ children }) {
  return <p className="text-muted-foreground text-sm">{children}</p>
}

function TaskStatus({ status }) {
  const style = TASK_STATUS_STYLES[status] ?? TASK_STATUS_STYLES.in_progress

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        style.className
      )}
    >
      {style.label}
    </span>
  )
}

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <Empty>No tasks recorded.</Empty>
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-3xl">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-44">Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Planned</TableHead>
            <TableHead className="text-right">Actual</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Hrs planned</TableHead>
            <TableHead className="text-right">Hrs spent</TableHead>
            <TableHead className="min-w-36">Output</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{task.taskName}</TableCell>
              <TableCell className="text-muted-foreground">
                {PRIORITY_LABELS[task.priority] ?? task.priority}
              </TableCell>
              <TableCell className="text-right tabular-nums">{task.plannedPct}%</TableCell>
              <TableCell className="text-right tabular-nums">{task.actualPct}%</TableCell>
              <TableCell>
                <TaskStatus status={task.status} />
              </TableCell>
              <TableCell className="text-right tabular-nums">{task.timePlanned}</TableCell>
              <TableCell className="text-right tabular-nums">{task.timeSpent}</TableCell>
              <TableCell className="text-muted-foreground">{task.output || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function FlaggedItems({ items, flagField, flagLabel, emptyLabel }) {
  if (items.length === 0) {
    return <Empty>{emptyLabel}</Empty>
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => {
        const isFlagged = Boolean(item[flagField])

        return (
          <li
            key={index}
            className={cn(
              'flex items-start gap-2 rounded-xl px-3 py-2 text-sm',
              isFlagged
                ? 'bg-brand-muted border-brand/40 border font-medium'
                : 'bg-muted/60 border border-transparent'
            )}
          >
            {isFlagged ? (
              <Star className="text-brand-strong mt-0.5 size-4 shrink-0 fill-current" />
            ) : (
              <span className="bg-muted-foreground/40 mt-2 size-1.5 shrink-0 rounded-full" />
            )}

            <span className="flex-1">{item.text}</span>

            {isFlagged ? (
              <span className="text-brand-strong shrink-0 text-xs whitespace-nowrap">
                {flagLabel}
              </span>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function PlannedItems({ items }) {
  if (items.length === 0) {
    return <Empty>Nothing planned for next week.</Empty>
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={index} className="bg-muted/60 rounded-xl px-3 py-2 text-sm">
          {item}
        </li>
      ))}
    </ul>
  )
}

function Hours({ hours }) {
  const total = HOURS_FIELDS.reduce((sum, { name }) => sum + (Number(hours[name]) || 0), 0)

  if (total === 0) {
    return <Empty>No hours recorded.</Empty>
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {HOURS_FIELDS.map(({ name, label }) => (
        <div key={name} className="bg-muted/60 rounded-xl px-3 py-2">
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-lg font-medium tabular-nums">{Number(hours[name]) || 0}</p>
        </div>
      ))}

      <div className="bg-brand-muted rounded-xl px-3 py-2">
        <p className="text-brand-strong text-xs">Total</p>
        <p className="text-brand-strong text-lg font-medium tabular-nums">{total}</p>
      </div>
    </div>
  )
}

export function ReportContent({ content }) {
  const tasks = content?.tasksCompleted ?? []
  const planned = content?.tasksPlannedNextWeek ?? []
  const blockers = content?.blockers ?? []
  const achievements = content?.achievements ?? []
  const hours = content?.hoursByType ?? {}
  const notes = content?.notes ?? ''

  return (
    <div className="flex flex-col gap-5">
      <Section title="Tasks completed" count={tasks.length}>
        <TaskList tasks={tasks} />
      </Section>

      <Section title="Tasks planned for next week" count={planned.length}>
        <PlannedItems items={planned} />
      </Section>

      <Section title="Blockers" count={blockers.length}>
        <FlaggedItems
          items={blockers}
          flagField="isKeyIssue"
          flagLabel="Key issue"
          emptyLabel="No blockers this week."
        />
      </Section>

      <Section title="Achievements" count={achievements.length}>
        <FlaggedItems
          items={achievements}
          flagField="isKeyAchievement"
          flagLabel="Key highlight"
          emptyLabel="No achievements recorded."
        />
      </Section>

      <Section title="Hours worked">
        <Hours hours={hours} />
      </Section>

      <Section title="Notes">
        {notes ? (
          <p className="text-sm whitespace-pre-wrap">{notes}</p>
        ) : (
          <Empty>No notes added.</Empty>
        )}
      </Section>
    </div>
  )
}
