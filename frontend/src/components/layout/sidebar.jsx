import { NavLink } from 'react-router-dom'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

import { navItemsFor } from './nav-items'

function SidebarLink({ to, label, icon: Icon, end }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex size-10 items-center justify-center rounded-lg transition-colors',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )
          }
        >
          <Icon className="size-5" />
          <span className="sr-only">{label}</span>
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="bg-sidebar hidden w-16 shrink-0 flex-col items-center gap-1 py-4 md:flex">
      {navItemsFor(user).map((item) => (
        <SidebarLink key={item.to} {...item} />
      ))}
    </aside>
  )
}

export function SidebarLinkList({ onNavigate }) {
  const { user } = useAuth()

  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItemsFor(user).map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary'
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
