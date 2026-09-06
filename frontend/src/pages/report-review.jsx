import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function ReportReviewPage() {
  return (
    <>
      <PageHeader title="Review report" subtitle="Approve this week's report, or send it back with a comment." />
      <PagePlaceholder note="Will show the report plus Approve and Request changes actions." />
    </>
  )
}
