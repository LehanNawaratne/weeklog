import { ChevronRight, History } from 'lucide-react'
import { useState } from 'react'

import { ReportContent } from '@/components/report/report-content'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/format'

export function VersionHistory({ versions, currentVersionId }) {
  const [openId, setOpenId] = useState(null)

  if (versions.length === 0) {
    return (
      <div className="border-border text-muted-foreground flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center">
        <History className="size-5" />
        <p className="text-sm">
          No versions yet. A snapshot is saved each time this report is submitted.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {versions.map((version) => {
        const isOpen = openId === version.id
        const isCurrent = version.id === currentVersionId

        return (
          <div key={version.id} className="border-border overflow-hidden rounded-xl border">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : version.id)}
              aria-expanded={isOpen}
              className="hover:bg-muted/60 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
            >
              <ChevronRight
                className={cn('size-4 shrink-0 transition-transform', isOpen && 'rotate-90')}
              />

              <span className="text-sm font-medium">Version {version.versionNumber}</span>

              {isCurrent ? (
                <span className="bg-brand-muted text-brand-strong rounded-full px-2 py-0.5 text-xs font-medium">
                  Latest
                </span>
              ) : null}

              <span className="text-muted-foreground ml-auto text-xs whitespace-nowrap">
                {formatDateTime(version.submittedAt)}
              </span>
            </button>

            {isOpen ? (
              <div className="border-border bg-muted/30 border-t px-4 py-5">
                <ReportContent content={version.content} />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
