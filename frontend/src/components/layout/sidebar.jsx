import { CalendarDays, ChevronRight } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

import { navItemsFor } from './nav-items'

export function SidebarLinkList({ onNavigate }) {
  const { user } = useAuth()

  return (
    <nav className="flex flex-col gap-1">
      {navItemsFor(user).map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              <ChevronRight
                className={cn('size-4 shrink-0 transition-opacity', isActive ? 'opacity-0' : 'opacity-40')}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside className="bg-sidebar hidden w-60 shrink-0 flex-col p-3 md:flex">
      <Link to="/" className="mb-5 flex items-center gap-2.5 px-4 py-3">
        <span className="bg-brand text-brand-foreground flex size-8 items-center justify-center rounded-xl">
          <CalendarDays className="size-4" />
        </span>
        <span className="text-base font-semibold tracking-tight">WeekLog</span>
      </Link>

      <SidebarLinkList />
    </aside>
  )
}
