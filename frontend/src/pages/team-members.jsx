import { ChevronRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/page-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUsers } from '@/hooks/use-users'
import { initialsOf } from '@/lib/initials'

export function TeamMembersPage() {
  const { members, isLoading, error } = useUsers()

  return (
    <>
      <PageHeader title="Team" subtitle="Everyone writing weekly reports. Open a profile to see their history." />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {!error && isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((card) => (
            <Skeleton key={card} className="h-24 w-full" />
          ))}
        </div>
      ) : null}

      {!error && !isLoading && members.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground flex min-h-40 flex-col items-center justify-center gap-2 text-center">
            <Users className="size-5" />
            <p className="text-sm font-medium">No team members yet</p>
            <p className="text-xs">Invite someone from User management.</p>
          </CardContent>
        </Card>
      ) : null}

      {!error && !isLoading && members.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link key={member.id} to={`/team/${member.id}`}>
              <Card className="hover:border-brand/50 h-full transition-colors">
                <CardContent className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-brand text-brand-foreground text-sm font-semibold">
                      {initialsOf(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{member.email}</p>
                  </div>

                  <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
    </>
  )
}
