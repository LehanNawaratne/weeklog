import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function ReportDetailPage() {
  return (
    <>
      <PageHeader title="Report" subtitle="The full report, its past versions and every review comment." />
      <PagePlaceholder note="Read-only view shared by team members and managers." />
    </>
  )
}
