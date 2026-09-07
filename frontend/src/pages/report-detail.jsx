import { AlertCircle, Pencil, ShieldOff, Stamp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { CommentHistory } from '@/components/report/comment-history'
import { ReportContent } from '@/components/report/report-content'
import { VersionHistory } from '@/components/report/version-history'
import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'
import { getMyReport, getReport } from '@/api/reports'
import { formatWeekRange } from '@/lib/week'

const EDITABLE = ['draft', 'needs_correction']

function LoadFailure({ error }) {
  if (error.status === 403) {
    return (
      <Card className="max-w-lg">
        <CardContent className="flex flex-col items-start gap-3 py-8">
          <ShieldOff className="text-muted-foreground size-5" />
          <p className="text-sm font-medium">This report is not yours to view</p>
          <p className="text-muted-foreground text-sm">
            Team members can only open their own reports. Your manager can see them once they are
            submitted.
          </p>
          <Button asChild>
            <Link to="/my-reports">Back to my reports</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Alert variant="destructive" className="max-w-lg">
      <AlertCircle />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}

export function ReportDetailPage() {
  const { id } = useParams()
  const { isManager } = useAuth()

  const [detail, setDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setDetail(isManager ? await getReport(id) : await getMyReport(id))
        setError(null)
      } catch (failure) {
        setError(failure)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id, isManager])

  if (isLoading) {
    return (
      <div className="flex max-w-4xl flex-col gap-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error) {
    return <LoadFailure error={error} />
  }

  const { report, versions, comments } = detail
  const canEdit = !isManager && EDITABLE.includes(report.status)
  const canReview = isManager && report.status === 'submitted'

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={`Week of ${formatWeekRange(report.weekStart)}`}
        subtitle={isManager ? `${report.user.name} · ${report.project.name}` : report.project.name}
      >
        <StatusBadge status={report.status} />

        {canReview ? (
          <Button asChild>
            <Link to={`/dashboard/reports/${report.id}/review`}>
              <Stamp className="size-4" />
              Review this report
            </Link>
          </Button>
        ) : null}

        {canEdit ? (
          <Button asChild>
            <Link to={`/my-reports/${report.id}/edit`}>
              <Pencil className="size-4" />
              Edit report
            </Link>
          </Button>
        ) : null}
      </PageHeader>

      {report.status === 'needs_correction' && report.latestComment ? (
        <Alert className="border-status-correction/40 bg-status-correction-bg mb-4">
          <AlertCircle className="text-status-correction" />
          <AlertTitle>
            {isManager ? 'Sent back for correction' : 'Your manager asked for changes'}
          </AlertTitle>
          <AlertDescription>{report.latestComment}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent>
            <ReportContent content={report} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
            <CardDescription>
              A snapshot is saved every time this report is submitted. Open one to read it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VersionHistory versions={versions} currentVersionId={report.currentVersionId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review history</CardTitle>
            <CardDescription>Every decision made on this report, newest first.</CardDescription>
          </CardHeader>
          <CardContent>
            <CommentHistory comments={comments} versions={versions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
