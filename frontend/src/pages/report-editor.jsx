import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function ReportEditorPage() {
  return (
    <>
      <PageHeader title="Weekly report" subtitle="Fill in your week, save a draft, then send it for review." />
      <PagePlaceholder note="Will hold the fixed report form: tasks table, blockers, achievements and hours." />
    </>
  )
}
