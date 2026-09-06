import { CalendarDays, LogOut, Menu, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

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

import { SidebarLinkList } from './sidebar'

function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
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
        <button className="hover:bg-secondary flex items-center gap-3 rounded-lg p-1.5 pr-3 transition-colors">
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
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <SidebarLinkList onNavigate={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function Topbar() {
  return (
    <header className="bg-card border-border flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <MobileNav />

      <Link to="/" className="flex items-center gap-2">
        <span className="bg-brand text-brand-foreground flex size-7 items-center justify-center rounded-lg">
          <CalendarDays className="size-4" />
        </span>
        <span className="text-base font-semibold tracking-tight">WeekLog</span>
      </Link>

      <div className="flex-1" />

      <UserMenu />
    </header>
  )
}
