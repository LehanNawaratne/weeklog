import { PageHeader } from '@/components/page-header'
import { PagePlaceholder } from '@/components/page-placeholder'

export function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projects" subtitle="The tags that reports are filed under." />
      <PagePlaceholder note="Will hold the project list with add, edit and delete." />
    </>
  )
}
