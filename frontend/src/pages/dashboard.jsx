import { CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ChatWidget } from '@/components/assistant/chat-widget'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import {
  StatusByMemberChart,
  TasksTrendChart,
  TimeByTaskTypeChart,
  WorkloadByProjectChart
} from '@/components/dashboard/charts'
import { MetricCards } from '@/components/dashboard/metric-cards'
import { PageHeader } from '@/components/page-header'
import { TeamReportTable } from '@/components/report/team-report-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeamReports } from '@/hooks/use-team-reports'
import { getSummary } from '@/api/dashboard'
import { formatWeekRange } from '@/lib/week'

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
            <p className="max-w-xs text-xs">New submissions from the team will appear here.</p>
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
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={
          summary
            ? `Week of ${formatWeekRange(summary.weekStart)}`
            : 'Team health at a glance: submissions, blockers and workload.'
        }
      />

      <div className="flex flex-col gap-4">
        <MetricCards summary={summary} isLoading={isLoading} />

        <div className="grid gap-4 lg:grid-cols-2">
          <TasksTrendChart />
          <StatusByMemberChart />
          <WorkloadByProjectChart />
          <TimeByTaskTypeChart />
        </div>

        <AwaitingReview />

        <ActivityFeed />
      </div>

      <ChatWidget />
    </>
  )
}
