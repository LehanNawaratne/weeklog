import { Eye, Stamp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatDateTime } from '@/lib/format'
import { formatWeekRange } from '@/lib/week'

function RowAction({ report }) {
  if (report.status === 'submitted') {
    return (
      <Button asChild size="sm">
        <Link to={`/dashboard/reports/${report.id}/review`}>
          <Stamp className="size-4" />
          Review
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild size="sm" variant="ghost">
      <Link to={`/reports/${report.id}`}>
        <Eye className="size-4" />
        View
      </Link>
    </Button>
  )
}

export function TeamReportTable({ reports, showStatus = true }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team member</TableHead>
            <TableHead className="whitespace-nowrap">Week</TableHead>
            <TableHead>Project</TableHead>
            {showStatus ? <TableHead>Status</TableHead> : null}
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
              {showStatus ? (
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
              ) : null}
              <TableCell className="text-right tabular-nums">{report.taskCount}</TableCell>
              <TableCell className="text-right tabular-nums">{report.blockerCount}</TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {report.submittedAt ? formatDateTime(report.submittedAt) : '—'}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <RowAction report={report} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
