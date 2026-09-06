import { Hammer } from 'lucide-react'

export function PagePlaceholder({ note }) {
  return (
    <div className="border-border text-muted-foreground flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center">
      <Hammer className="size-5" />
      <p className="text-sm font-medium">Not built yet</p>
      {note ? <p className="max-w-sm text-xs">{note}</p> : null}
    </div>
  )
}
