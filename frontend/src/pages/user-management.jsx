import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function UserManagementPage() {
  return (
    <>
      <PageHeader title="User management" subtitle="Invite people, change roles and remove accounts." />
      <PagePlaceholder note="Will hold the invite form and the role dropdown." />
    </>
  )
}
