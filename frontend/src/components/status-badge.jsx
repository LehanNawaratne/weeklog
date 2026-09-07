import { cn } from '@/lib/utils'

const STATUS_STYLES = {
  draft: {
    label: 'Draft',
    className: 'bg-status-draft-bg text-status-draft'
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-status-submitted-bg text-status-submitted'
  },
  needs_correction: {
    label: 'Needs correction',
    className: 'bg-status-correction-bg text-status-correction'
  },
  approved: {
    label: 'Approved',
    className: 'bg-status-approved-bg text-status-approved'
  },
  not_started: {
    label: 'Not started',
    className: 'text-muted-foreground border border-dashed border-border'
  }
}

export const REPORT_STATUSES = ['draft', 'submitted', 'needs_correction', 'approved']

export function statusLabel(status) {
  return (STATUS_STYLES[status] ?? STATUS_STYLES.not_started).label
}

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.not_started

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        style.className,
        className
      )}
    >
      {style.label}
    </span>
  )
}
