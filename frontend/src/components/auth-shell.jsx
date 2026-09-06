import { CalendarDays } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthShell({ title, description, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="bg-brand text-brand-foreground flex size-8 items-center justify-center rounded-lg">
            <CalendarDays className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">WeekLog</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {footer ? (
          <p className="text-muted-foreground mt-4 text-center text-sm">{footer}</p>
        ) : null}
      </div>
    </div>
  )
}
