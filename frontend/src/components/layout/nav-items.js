import {
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutGrid,
  Settings,
  UserCog,
  Users
} from 'lucide-react'

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
