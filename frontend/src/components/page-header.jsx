/**
 * The title block at the top of every page.
 *
 * Anything passed as children appears on the right, which is where the page's
 * main action button goes - the same place "Export report" sits in the design.
 *
 *   <PageHeader title="Projects" subtitle="...">
 *     <Button>Add project</Button>
 *   </PageHeader>
 */
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p> : null}
      </div>

      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  )
}
