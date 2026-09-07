import { CheckCircle2, RotateCcw, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getActivity } from '@/api/dashboard'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/format'
import { formatWeekRange } from '@/lib/week'

const STYLES = {
  submission: { icon: Send, className: 'bg-status-submitted-bg text-status-submitted' },
  approved: { icon: CheckCircle2, className: 'bg-status-approved-bg text-status-approved' },
  requested_changes: {
    icon: RotateCcw,
    className: 'bg-status-correction-bg text-status-correction'
  }
}

function describe(entry) {
  if (entry.type === 'submission') {
    return `${entry.actor} submitted version ${entry.version}`
  }

  return entry.action === 'approved'
    ? `${entry.actor} approved ${entry.reportOwner}'s report`
    : `${entry.actor} sent ${entry.reportOwner}'s report back`
}

export function ActivityFeed({ limit = 12 }) {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getActivity(limit)
      .then((result) => {
        setEntries(result)
        setError('')
      })
      .catch((failure) => {
        setEntries([])
        setError(failure.message)
      })
      .finally(() => setIsLoading(false))
  }, [limit])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Submissions and review decisions, newest first.</CardDescription>
      </CardHeader>

      <CardContent>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}

        {!error && isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((row) => (
              <Skeleton key={row} className="h-12 w-full" />
            ))}
          </div>
        ) : null}

        {!error && !isLoading && entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nothing has happened yet.</p>
        ) : null}

        {!error && !isLoading && entries.length > 0 ? (
          <ol className="flex flex-col gap-1">
            {entries.map((entry, index) => {
              const style = STYLES[entry.type === 'submission' ? 'submission' : entry.action]
              const Icon = style?.icon ?? Send

              return (
                <li key={`${entry.reportId}-${entry.at}-${index}`}>
                  <Link
                    to={`/reports/${entry.reportId}`}
                    className="hover:bg-muted/60 flex items-start gap-3 rounded-xl px-2 py-2 transition-colors"
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
                        style?.className
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm">{describe(entry)}</span>
                      <span className="text-muted-foreground block text-xs">
                        Week of {formatWeekRange(entry.week)}
                        {entry.comment ? ` · “${entry.comment}”` : ''}
                      </span>
                    </span>

                    <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                      {formatDateTime(entry.at)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        ) : null}
      </CardContent>
    </Card>
  )
}
