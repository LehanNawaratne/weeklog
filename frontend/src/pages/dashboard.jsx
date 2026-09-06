import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Team health at a glance: submissions, blockers and workload." />
      <PagePlaceholder note="Will show four summary cards, four charts and the activity feed." />
    </>
  )
}
