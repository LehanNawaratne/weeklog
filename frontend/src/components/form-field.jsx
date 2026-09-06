import { cloneElement } from 'react'

import { Label } from '@/components/ui/label'

export function FormField({ id, label, error, hint, children }) {
  const message = error ?? hint
  const messageId = message ? `${id}-message` : undefined

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': messageId
      })}

      {message ? (
        <p
          id={messageId}
          className={error ? 'text-destructive text-xs' : 'text-muted-foreground text-xs'}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
