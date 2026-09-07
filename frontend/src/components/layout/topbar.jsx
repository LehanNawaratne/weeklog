import { Bell, LogOut, Menu, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Logo } from '@/components/logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/context/auth-context'
import { initialsOf } from '@/lib/initials'

import { SidebarLinkList } from './sidebar'

function greetingFor(date = new Date()) {
  const hour = date.getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-card hover:bg-secondary flex items-center gap-2.5 rounded-full p-1.5 pr-4 transition-colors">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-semibold">
              {initialsOf(user?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-medium">{user?.name}</span>
            <span className="text-muted-foreground block text-xs capitalize">{user?.role}</span>
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <User className="size-4" />
            My profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="size-4" />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2.5">
            <Logo />
            WeekLog
          </SheetTitle>
        </SheetHeader>
        <div className="px-3">
          <SidebarLinkList onNavigate={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Topbar() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <header className="flex shrink-0 items-center gap-3 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
      <MobileNav />

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium tracking-tight sm:text-xl">
          {greetingFor()}, {firstName}
        </p>
      </div>

      <Button variant="ghost" size="icon" className="bg-card hover:bg-secondary rounded-full">
        <Bell className="size-4" />
        <span className="sr-only">Notifications</span>
      </Button>

      <UserMenu />
    </header>
  )
}
