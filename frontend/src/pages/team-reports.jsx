import { CalendarClock, ChevronLeft, ChevronRight, Columns3, SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { ReportFilters } from '@/components/report-filters'
import { TeamReportTable } from '@/components/report/team-report-table'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeamReports } from '@/hooks/use-team-reports'
import { useUsers } from '@/hooks/use-users'
import { formatWeekRange, weekKey } from '@/lib/week'

const PAGE_SIZE = 10
const FILTER_KEYS = ['userId', 'projectId', 'from', 'to', 'status']

function filtersFromParams(params) {
  return {
    userId: params.get('userId') ?? undefined,
    projectId: params.get('projectId') ?? undefined,
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
    status: params.get('status') ?? undefined,
    page: Number(params.get('page')) || 1,
    limit: PAGE_SIZE
  }
}

function paramsFromFilters(filters) {
  const params = new URLSearchParams()

  for (const key of FILTER_KEYS) {
    if (filters[key]) {
      params.set(key, filters[key])
    }
  }

  if (filters.page > 1) {
    params.set('page', String(filters.page))
  }

  return params
}

function NotStartedList({ week, members }) {
  const { reports, isLoading } = useTeamReports({ from: week, to: week, page: 1, limit: 100 })

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  const covered = new Set(reports.map((report) => report.user?.id))
  const missing = members.filter((member) => !covered.has(member.id))

  if (missing.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Everyone on the team has a report for this week.
      </p>
    )
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {missing.map((member) => (
        <li
          key={member.id}
          className="border-border flex items-center gap-2 rounded-full border px-3 py-1.5"
        >
          <span className="text-sm font-medium">{member.name}</span>
          <StatusBadge status="not_started" />
        </li>
      ))}
    </ul>
  )
}

function NotStarted({ week, members }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-4" />
          Not started
        </CardTitle>
        <CardDescription>
          {week
            ? `Members with nothing submitted for the week of ${formatWeekRange(week)}. A private draft still counts as not started here, because managers cannot see drafts.`
            : 'Pick a single week above to see who has not submitted yet.'}
        </CardDescription>
      </CardHeader>

      {week ? (
        <CardContent>
          <NotStartedList week={week} members={members} />
        </CardContent>
      ) : null}
    </Card>
  )
}

export function TeamReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { members } = useUsers()

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams])
  const { reports, pagination, isLoading, error } = useTeamReports(filters)

  const hasFilters = FILTER_KEYS.some((key) => Boolean(filters[key]))
  const totalPages = pagination?.pages ?? 1

  const singleWeek =
    filters.from && (!filters.to || weekKey(filters.to) === weekKey(filters.from))
      ? filters.from
      : null

  function applyFilters(next) {
    setSearchParams(paramsFromFilters(next))
  }

  function goToPage(page) {
    applyFilters({ ...filters, page })
  }

  return (
    <>
      <PageHeader
        title="Team reports"
        subtitle="Every member's report, filtered by week, project or status."
      >
        <Button asChild variant="outline">
          <Link to={singleWeek ? `/dashboard/compare?week=${singleWeek}` : '/dashboard/compare'}>
            <Columns3 className="size-4" />
            Compare sections
          </Link>
        </Button>
      </PageHeader>

      <ReportFilters
        value={filters}
        onChange={applyFilters}
        members={members}
        hasFilters={hasFilters}
        onClear={() => setSearchParams(new URLSearchParams())}
      />

      <Card>
        <CardContent className="flex flex-col gap-4">
          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          {!error && isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((row) => (
                <Skeleton key={row} className="h-10 w-full" />
              ))}
            </div>
          ) : null}

          {!error && !isLoading && reports.length === 0 ? (
            <div className="border-border text-muted-foreground flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center">
              <SearchX className="size-5" />
              <p className="text-sm font-medium">No reports match these filters</p>
              <p className="max-w-xs text-xs">
                Try widening the week range, or clearing a filter.
              </p>
            </div>
          ) : null}

          {!error && !isLoading && reports.length > 0 ? (
            <>
              <TeamReportTable reports={reports} />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs">
                  Showing {reports.length} of {pagination?.total ?? 0} reports
                </p>

                {totalPages > 1 ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(filters.page - 1)}
                      disabled={filters.page <= 1}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>

                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      Page {filters.page} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(filters.page + 1)}
                      disabled={filters.page >= totalPages}
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <NotStarted week={singleWeek} members={members} />
    </>
  )
}
