import { AlertCircle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '@/components/form-field'
import { PageHeader } from '@/components/page-header'
import { CommentHistory } from '@/components/report/comment-history'
import { ReportContent } from '@/components/report/report-content'
import { VersionHistory } from '@/components/report/version-history'
import { StatusBadge } from '@/components/status-badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { getReport, reviewReport } from '@/api/reports'
import { formatDateTime } from '@/lib/format'
import { formatWeekRange } from '@/lib/week'

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

function NotAwaitingReview({ report }) {
  return (
    <div className="max-w-lg">
      <PageHeader title={`Week of ${formatWeekRange(report.weekStart)}`}>
        <StatusBadge status={report.status} />
      </PageHeader>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-8">
          <CheckCircle2 className="text-muted-foreground size-5" />
          <p className="text-sm font-medium">This report is not waiting for a decision</p>
          <p className="text-muted-foreground text-sm">
            Only a submitted report can be approved or sent back. This one has already been
            reviewed, or is still being written.
          </p>
          <Button asChild>
            <Link to={`/reports/${report.id}`}>View the report</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function ReportReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [detail, setDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setDetail(await getReport(id))
        setLoadError('')
      } catch (failure) {
        setLoadError(failure.message)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id])

  async function decide(action) {
    if (action === 'request_changes' && comment.trim().length === 0) {
      setCommentError('Explain what needs changing so the team member knows what to fix.')
      return
    }

    setCommentError('')
    setPendingAction(action)

    try {
      await reviewReport(id, { action, comment: comment.trim() })
      toast.success(action === 'approve' ? 'Report approved' : 'Sent back for correction')
      navigate(`/reports/${id}`)
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setPendingAction(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex max-w-4xl flex-col gap-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (loadError) {
    return (
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle />
        <AlertDescription>{loadError}</AlertDescription>
      </Alert>
    )
  }

  const { report, versions, comments } = detail

  if (report.status !== 'submitted') {
    return <NotAwaitingReview report={report} />
  }

  const currentVersion = versions.find((version) => version.id === report.currentVersionId)
  const isBusy = pendingAction !== null

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={`Week of ${formatWeekRange(report.weekStart)}`}
        subtitle={`${report.user.name} · ${report.project.name}`}
      >
        <StatusBadge status={report.status} />
      </PageHeader>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem label="Team member" value={report.user.name} />
            <SummaryItem label="Project" value={report.project.name} />
            <SummaryItem
              label="Submitted"
              value={report.submittedAt ? formatDateTime(report.submittedAt) : '—'}
            />
            <SummaryItem
              label="Under review"
              value={currentVersion ? `Version ${currentVersion.versionNumber}` : '—'}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <ReportContent content={report} />
          </CardContent>
        </Card>

        {versions.length > 1 ? (
          <Card>
            <CardHeader>
              <CardTitle>Earlier versions</CardTitle>
              <CardDescription>
                What this report looked like before the last correction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VersionHistory versions={versions} currentVersionId={report.currentVersionId} />
            </CardContent>
          </Card>
        ) : null}

        {comments.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Earlier decisions</CardTitle>
              <CardDescription>What has already been said about this report.</CardDescription>
            </CardHeader>
            <CardContent>
              <CommentHistory comments={comments} versions={versions} />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Your decision</CardTitle>
            <CardDescription>
              You can change the status and leave a comment. The report itself stays the team
              member&apos;s work.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormField
              id="comment"
              label="Comment"
              error={commentError}
              hint="Required when requesting changes. Optional when approving."
            >
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Actual percentages look optimistic against the hours spent."
                maxLength={2000}
                rows={4}
              />
            </FormField>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => decide('approve')} disabled={isBusy}>
                {pendingAction === 'approve' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Approve
              </Button>

              <Button
                variant="outline"
                onClick={() => decide('request_changes')}
                disabled={isBusy}
              >
                {pendingAction === 'request_changes' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
                Request changes
              </Button>

              <Button asChild variant="ghost" disabled={isBusy}>
                <Link to={`/reports/${id}`}>Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
