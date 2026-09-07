import { CheckCircle2, Stamp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useTeamReports } from '@/hooks/use-team-reports'
import { formatDateTime } from '@/lib/format'
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
            <p className="max-w-xs text-xs">
              New submissions from the team will appear here.
            </p>
          </div>
        ) : null}

        {!error && !isLoading && reports.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team member</TableHead>
                  <TableHead className="whitespace-nowrap">Week</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead className="text-right">Blockers</TableHead>
                  <TableHead className="whitespace-nowrap">Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {report.user?.name ?? '—'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatWeekRange(report.weekStart)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.project?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{report.taskCount}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {report.blockerCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {report.submittedAt ? formatDateTime(report.submittedAt) : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button asChild size="sm">
                          <Link to={`/dashboard/reports/${report.id}/review`}>
                            <Stamp className="size-4" />
                            Review
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
