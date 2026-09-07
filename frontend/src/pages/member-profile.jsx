import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { TeamReportTable } from '@/components/report/team-report-table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeamReports } from '@/hooks/use-team-reports'
import { getUser } from '@/api/users'
import { initialsOf } from '@/lib/initials'

const STAT_LABELS = [
  { key: 'total', label: 'Reports submitted' },
  { key: 'approved', label: 'Approved' },
  { key: 'needsCorrection', label: 'Needs correction' },
  { key: 'submitted', label: 'Awaiting review' }
]

function Stat({ label, value }) {
  return (
    <div className="bg-muted/60 rounded-xl px-4 py-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

export function MemberProfilePage() {
  const { id } = useParams()

  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const { reports, isLoading: isLoadingReports } = useTeamReports({ userId: id, page: 1, limit: 50 })

  useEffect(() => {
    getUser(id)
      .then((result) => {
        setMember(result)
        setError('')
      })
      .catch((failure) => setError(failure.message))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex max-w-4xl flex-col gap-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const stats = member.reportStats ?? {}

  return (
    <div className="max-w-4xl">
      <PageHeader title={member.name} subtitle={member.email}>
        <Button asChild variant="ghost">
          <Link to="/team">
            <ArrowLeft className="size-4" />
            Team
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="bg-brand text-brand-foreground font-semibold">
                  {initialsOf(member.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {member.role} · {member.isActive ? 'active' : 'removed'}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STAT_LABELS.map(({ key, label }) => (
                <Stat key={key} label={label} value={stats[key] ?? 0} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report history</CardTitle>
            <CardDescription>Every report this person has submitted, newest first.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((row) => (
                  <Skeleton key={row} className="h-10 w-full" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nothing submitted yet. Drafts stay private until they are sent for review.
              </p>
            ) : (
              <TeamReportTable reports={reports} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
