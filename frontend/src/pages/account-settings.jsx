import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function AccountSettingsPage() {
  return (
    <>
      <PageHeader title="Account settings" subtitle="Update your name, email or password." />
      <PagePlaceholder note="Will use PATCH /auth/me and PATCH /auth/me/password." />
    </>
  )
}
