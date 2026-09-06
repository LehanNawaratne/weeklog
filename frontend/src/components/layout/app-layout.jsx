import { Outlet } from 'react-router-dom'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

/**
 * The frame every signed-in page sits inside: top bar across the top,
 * icon rail down the left, and the page itself in the remaining space.
 *
 * <Outlet /> is where React Router puts the current page.
 * Because the frame is a route of its own, the top bar and sidebar are NOT
 * re-rendered when you move between pages - only the middle changes.
 */
export function AppLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
