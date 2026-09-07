import { X } from 'lucide-react'

import { ANY_PROJECT, ProjectPicker } from '@/components/project-picker'
import { statusLabel } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { formatWeekRange } from '@/lib/week'

export const ANY = 'any'

const MANAGER_STATUSES = ['submitted', 'needs_correction', 'approved']

function Field({ id, label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-muted-foreground text-xs">
        {label}
      </Label>
      {children}
    </div>
  )
}

function rangeLabel({ from, to }) {
  if (!from) return null

  const start = formatWeekRange(from)

  if (!to || to === from) return `Week of ${start}`

  return `${start} to ${formatWeekRange(to)}`
}

export function ReportFilters({ value, onChange, members, hasFilters, onClear }) {
  function set(name, next) {
    onChange({ ...value, [name]: next, page: 1 })
  }

  const label = rangeLabel(value)

  return (
    <Card className="mb-4">
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="filter-member" label="Team member">
            <Select
              value={value.userId ?? ANY}
              onValueChange={(next) => set('userId', next === ANY ? undefined : next)}
            >
              <SelectTrigger id="filter-member" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Everyone</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="filter-project" label="Project">
            <ProjectPicker
              id="filter-project"
              allLabel="All projects"
              value={value.projectId ?? ANY_PROJECT}
              onChange={(next) => set('projectId', next === ANY_PROJECT ? undefined : next)}
            />
          </Field>

          <Field id="filter-from" label="Week from">
            <Input
              id="filter-from"
              type="date"
              value={value.from ?? ''}
              onChange={(event) => set('from', event.target.value || undefined)}
            />
          </Field>

          <Field id="filter-to" label="Week to">
            <Input
              id="filter-to"
              type="date"
              value={value.to ?? ''}
              onChange={(event) => set('to', event.target.value || undefined)}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="filter-status" label="Status">
            <Select
              value={value.status ?? ANY}
              onValueChange={(next) => set('status', next === ANY ? undefined : next)}
            >
              <SelectTrigger id="filter-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any status</SelectItem>
                {MANAGER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex items-end lg:col-span-3">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {label ? <span className="text-muted-foreground text-xs">{label}</span> : null}

              {hasFilters ? (
                <Button type="button" variant="ghost" size="sm" onClick={onClear}>
                  <X className="size-4" />
                  Clear filters
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
