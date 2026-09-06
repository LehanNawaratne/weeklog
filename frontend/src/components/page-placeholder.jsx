import { Hammer } from 'lucide-react'

/**
 * A dashed empty card, borrowed from the reference design's empty slots.
 *
 * Used to mark a page whose layout exists but whose contents are not built yet,
 * so it is obvious at a glance what is finished and what is not.
 * Delete the usage as each page gets its real content.
 */
export function PagePlaceholder({ note }) {
  return (
    <div className="border-border text-muted-foreground flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center">
      <Hammer className="size-5" />
      <p className="text-sm font-medium">Not built yet</p>
      {note ? <p className="max-w-sm text-xs">{note}</p> : null}
    </div>
  )
}
