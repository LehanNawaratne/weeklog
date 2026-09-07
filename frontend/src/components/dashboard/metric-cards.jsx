import { AlertTriangle, CheckCircle2, RotateCcw, Send } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const TICKS = 20

function TickBar({ filled, total }) {
  const litCount = total === 0 ? 0 : Math.round((filled / total) * TICKS)

  return (
    <div className="mt-3 flex gap-0.5" aria-hidden="true">
      {Array.from({ length: TICKS }, (unused, index) => (
        <span
          key={index}
          className={cn(
            'h-4 flex-1 rounded-full',
            index < litCount ? 'bg-brand' : 'bg-muted'
          )}
        />
      ))}
    </div>
  )
}

function Metric({ label, value, hint, icon: Icon, tone, children }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-2">
          <p className="text-muted-foreground text-xs">{label}</p>
          <Icon className={cn('size-4', tone)} />
        </div>

        <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="text-muted-foreground mt-1 text-xs">{hint}</p> : null}

        {children}
      </CardContent>
    </Card>
  )
}

export function MetricCards({ summary, isLoading }) {
  if (isLoading || !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((card) => (
          <Skeleton key={card} className="h-36 w-full" />
        ))}
      </div>
    )
  }

  const { compliance } = summary
  const percent = Math.round(compliance.rate * 100)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Metric
        label="Submitted this week"
        value={summary.submittedThisWeek}
        hint={`${compliance.late} submitted after the deadline`}
        icon={Send}
        tone="text-brand-strong"
      />

      <Metric
        label="Compliance"
        value={`${percent}%`}
        hint={`${compliance.submitted} of ${compliance.expected} members · ${compliance.pending} pending`}
        icon={CheckCircle2}
        tone="text-brand-strong"
      >
        <TickBar filled={compliance.submitted} total={compliance.expected} />
      </Metric>

      <Metric
        label="Needs correction"
        value={summary.needsCorrection}
        hint="Sent back and not yet resubmitted"
        icon={RotateCcw}
        tone="text-status-correction"
      />

      <Metric
        label="Open blockers"
        value={summary.openBlockers}
        hint="Across reports submitted this week"
        icon={AlertTriangle}
        tone="text-status-submitted"
      />
    </div>
  )
}
