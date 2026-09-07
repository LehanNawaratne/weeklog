import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { ReportFilters } from '@/components/report-filters'
import { TeamReportTable } from '@/components/report/team-report-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeamReports } from '@/hooks/use-team-reports'
import { useUsers } from '@/hooks/use-users'

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

export function TeamReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { members } = useUsers()

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams])
  const { reports, pagination, isLoading, error } = useTeamReports(filters)

  const hasFilters = FILTER_KEYS.some((key) => Boolean(filters[key]))
  const totalPages = pagination?.pages ?? 1

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
      />

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
    </>
  )
}
