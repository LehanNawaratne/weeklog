import { CheckCircle2, MessageSquare, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/format'

const ACTIONS = {
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-status-approved-bg text-status-approved'
  },
  requested_changes: {
    label: 'Changes requested',
    icon: RotateCcw,
    className: 'bg-status-correction-bg text-status-correction'
  }
}

export function CommentHistory({ comments, versions }) {
  if (comments.length === 0) {
    return (
      <div className="border-border text-muted-foreground flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center">
        <MessageSquare className="size-5" />
        <p className="text-sm">No review decisions yet.</p>
      </div>
    )
  }

  const versionNumbers = new Map(versions.map((version) => [version.id, version.versionNumber]))

  return (
    <ol className="flex flex-col gap-3">
      {comments.map((entry) => {
        const action = ACTIONS[entry.action] ?? ACTIONS.requested_changes
        const ActionIcon = action.icon
        const versionNumber = versionNumbers.get(entry.versionId)

        return (
          <li key={entry.id} className="border-border rounded-xl border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  action.className
                )}
              >
                <ActionIcon className="size-3.5" />
                {action.label}
              </span>

              <span className="text-sm font-medium">{entry.manager?.name ?? 'A manager'}</span>

              {versionNumber ? (
                <span className="text-muted-foreground text-xs">on version {versionNumber}</span>
              ) : null}

              <span className="text-muted-foreground ml-auto text-xs whitespace-nowrap">
                {formatDateTime(entry.createdAt)}
              </span>
            </div>

            {entry.comment ? (
              <p className="mt-2 text-sm whitespace-pre-wrap">{entry.comment}</p>
            ) : (
              <p className="text-muted-foreground mt-2 text-sm">No comment left.</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
