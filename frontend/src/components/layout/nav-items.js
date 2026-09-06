import {
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutGrid,
  Settings,
  UserCog,
  Users
} from 'lucide-react'

/**
 * The whole navigation menu, in one list.
 *
 * `role: 'manager'` means only managers see that link. An item with no role is
 * shown to everyone - managers write weekly reports too, so "My reports" is
 * not member-only.
 *
 * `end: true` means the link is only highlighted on an exact URL match.
 * Without it, "/dashboard" would stay highlighted while on "/dashboard/reports".
 */
export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, role: 'manager', end: true },
  { to: '/dashboard/reports', label: 'Team reports', icon: ClipboardList, role: 'manager' },
  { to: '/my-reports', label: 'My reports', icon: FileText },
  { to: '/projects', label: 'Projects', icon: FolderKanban, role: 'manager' },
  { to: '/team', label: 'Team', icon: Users, role: 'manager' },
  { to: '/users', label: 'User management', icon: UserCog, role: 'manager' },
  { to: '/settings', label: 'Settings', icon: Settings }
]

export function navItemsFor(user) {
  return navItems.filter((item) => !item.role || item.role === user?.role)
}
