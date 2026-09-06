import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function MyReportsPage() {
  return (
    <>
      <PageHeader title="My reports" subtitle="Every week you have logged, and where each one stands." />
      <PagePlaceholder note="Will list your reports by week with a status badge." />
    </>
  )
}
