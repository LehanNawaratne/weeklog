import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function MemberProfilePage() {
  return (
    <>
      <PageHeader title="Team member" subtitle="Their full report history and basic stats." />
      <PagePlaceholder note="Will show report counts alongside their history table." />
    </>
  )
}
