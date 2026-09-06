import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function TeamReportsPage() {
  return (
    <>
      <PageHeader title="Team reports" subtitle="Every member's report, filtered by week, project or status." />
      <PagePlaceholder note="Will hold the filter bar, the report table and Not Started tracking." />
    </>
  )
}
