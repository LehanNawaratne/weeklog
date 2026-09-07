import { cn } from '@/lib/utils'

export function Logo({ className }) {
  return (
    <img
      src="/logo.png"
      alt="WeekLog"
      width={40}
      height={40}
      className={cn('size-9 shrink-0 object-contain', className)}
    />
  )
}
