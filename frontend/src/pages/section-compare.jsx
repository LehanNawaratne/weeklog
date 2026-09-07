import { ArrowLeft, CalendarClock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { FlaggedItems } from '@/components/report/report-content'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeamReports } from '@/hooks/use-team-reports'
import { useUsers } from '@/hooks/use-users'
import { getReport } from '@/api/reports'
import { formatWeekRange, toDateInputValue, today } from '@/lib/week'

const SECTIONS = {
  blockers: {
    label: 'Blockers',
    field: 'blockers',
    flagField: 'isKeyIssue',
    flagLabel: 'Key issue',
    emptyLabel: 'No blockers this week.'
  },
  achievements: {
    label: 'Achievements',
    field: 'achievements',
    flagField: 'isKeyAchievement',
    flagLabel: 'Key highlight',
    emptyLabel: 'No achievements recorded.'
  }
}

function useWeekReportDetails(week) {
  const { reports, isLoading: isListLoading } = useTeamReports({
    from: week,
    to: week,
    page: 1,
    limit: 100
  })

  const ids = reports.map((report) => report.id).join(',')

  const [details, setDetails] = useState([])
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  useEffect(() => {
    if (!ids) {
      setDetails([])
      return
    }

    let isCurrent = true
    setIsLoadingDetails(true)

    Promise.all(ids.split(',').map((id) => getReport(id)))
      .then((results) => {
        if (isCurrent) setDetails(results.map((result) => result.report))
      })
      .catch(() => {
        if (isCurrent) setDetails([])
      })
      .finally(() => {
        if (isCurrent) setIsLoadingDetails(false)
      })

    return () => {
      isCurrent = false
    }
  }, [ids])

  return { details, isLoading: isListLoading || isLoadingDetails }
}

export function SectionComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { members } = useUsers()

  const week = searchParams.get('week') ?? toDateInputValue(today())
  const sectionKey = SECTIONS[searchParams.get('section')] ? searchParams.get('section') : 'blockers'
  const section = SECTIONS[sectionKey]

  const { details, isLoading } = useWeekReportDetails(week)

  function update(name, value) {
    const next = new URLSearchParams(searchParams)
    next.set(name, value)
    setSearchParams(next)
  }

  const covered = new Set(details.map((report) => report.user?.id))
  const missing = members.filter((member) => !covered.has(member.id))

  return (
    <>
      <PageHeader
        title="Compare across the team"
        subtitle="One section from every member's week, side by side."
      >
        <Button asChild variant="ghost">
          <Link to="/dashboard/reports">
            <ArrowLeft className="size-4" />
            Team reports
          </Link>
        </Button>
      </PageHeader>

      <Card className="mb-4">
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="compare-week" className="text-muted-foreground text-xs">
              Week
            </Label>
            <Input
              id="compare-week"
              type="date"
              value={week}
              onChange={(event) => update('week', event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="compare-section" className="text-muted-foreground text-xs">
              Section
            </Label>
            <Select value={sectionKey} onValueChange={(value) => update('section', value)}>
              <SelectTrigger id="compare-section" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SECTIONS).map(([key, entry]) => (
                  <SelectItem key={key} value={key}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end lg:col-span-2">
            <p className="text-muted-foreground text-xs">
              {section.label} for the week of {formatWeekRange(week)}
            </p>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((card) => (
            <Skeleton key={card} className="h-44 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="text-base">{report.user?.name}</CardTitle>
                <CardDescription>{report.project?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <FlaggedItems
                  items={report[section.field] ?? []}
                  flagField={section.flagField}
                  flagLabel={section.flagLabel}
                  emptyLabel={section.emptyLabel}
                />
              </CardContent>
            </Card>
          ))}

          {missing.map((member) => (
            <Card key={member.id} className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>Nothing submitted for this week</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarClock className="size-4" />
                <StatusBadge status="not_started" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
