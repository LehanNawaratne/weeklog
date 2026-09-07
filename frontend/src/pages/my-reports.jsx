import { AlertCircle, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useMyReports } from '@/hooks/use-my-reports'
import { useProjects } from '@/hooks/use-projects'
import { formatWeekRange, recentWeeks, weekKey } from '@/lib/week'

const WEEKS_SHOWN = 8
const EDITABLE = ['draft', 'needs_correction']

function buildRows(reports) {
  const byWeek = new Map(reports.map((report) => [weekKey(report.weekStart), report]))
  const keys = new Set([...recentWeeks(WEEKS_SHOWN).map(weekKey), ...byWeek.keys()])

  return [...keys]
    .sort((first, second) => second.localeCompare(first))
    .map((key) => ({ key, report: byWeek.get(key) ?? null }))
}

function RowAction({ report, weekStartKey }) {
  if (!report) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to={`/my-reports/new?week=${weekStartKey}`}>Start</Link>
      </Button>
    )
  }

  if (EDITABLE.includes(report.status)) {
    return (
      <Button asChild size="sm">
        <Link to={`/my-reports/${report.id}/edit`}>Edit</Link>
      </Button>
    )
  }

  return (
    <Button asChild variant="ghost" size="sm">
      <Link to={`/reports/${report.id}`}>View</Link>
    </Button>
  )
}

export function MyReportsPage() {
  const { reports, isLoading, error } = useMyReports()
  const { projects } = useProjects()

  const rows = useMemo(() => buildRows(reports), [reports])

  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects]
  )

  const needsCorrection = reports.filter((report) => report.status === 'needs_correction').length
  const thisWeekKey = weekKey(new Date())
  const hasThisWeek = reports.some((report) => weekKey(report.weekStart) === thisWeekKey)

  return (
    <>
      <PageHeader title="My reports" subtitle="Every week you have logged, and where each one stands.">
        {hasThisWeek ? null : (
          <Button asChild>
            <Link to={`/my-reports/new?week=${thisWeekKey}`}>
              <Plus className="size-4" />
              Start this week
            </Link>
          </Button>
        )}
      </PageHeader>

      {needsCorrection > 0 ? (
        <Alert className="mb-4">
          <AlertCircle />
          <AlertDescription>
            {needsCorrection === 1
              ? 'One report was sent back for correction. Open it to see what your manager asked for.'
              : `${needsCorrection} reports were sent back for correction.`}
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          {!error && isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((row) => (
                <Skeleton key={row} className="h-10 w-full" />
              ))}
            </div>
          ) : null}

          {!error && !isLoading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Week</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ key, report }) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatWeekRange(key)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {report ? (projectNames.get(report.projectId) ?? '—') : '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={report ? report.status : 'not_started'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <RowAction report={report} weekStartKey={key} />
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
    </>
  )
}
