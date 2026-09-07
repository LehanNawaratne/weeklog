import { CheckCircle2 } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'
import { TeamReportTable } from '@/components/report/team-report-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeamReports } from '@/hooks/use-team-reports'

const AWAITING_REVIEW = { status: 'submitted', page: 1, limit: 20 }

function AwaitingReview() {
  const { reports, pagination, isLoading, error } = useTeamReports(AWAITING_REVIEW)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Awaiting your review</CardTitle>
        <CardDescription>
          {isLoading
            ? 'Checking…'
            : pagination?.total
              ? `${pagination.total} report${pagination.total === 1 ? '' : 's'} submitted and waiting.`
              : 'Every submitted report has been reviewed.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}

        {!error && isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((row) => (
              <Skeleton key={row} className="h-10 w-full" />
            ))}
          </div>
        ) : null}

        {!error && !isLoading && reports.length === 0 ? (
          <div className="border-border text-muted-foreground flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center">
            <CheckCircle2 className="size-5" />
            <p className="text-sm font-medium">Nothing waiting for you</p>
            <p className="max-w-xs text-xs">
              New submissions from the team will appear here.
            </p>
          </div>
        ) : null}

        {!error && !isLoading && reports.length > 0 ? (
          <TeamReportTable reports={reports} showStatus={false} />
        ) : null}
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Team health at a glance: submissions, blockers and workload."
      />

      <div className="flex flex-col gap-4">
        <AwaitingReview />

        <PagePlaceholder note="Summary metrics, charts and the activity feed arrive with the analytics dashboard." />
      </div>
    </>
  )
}
