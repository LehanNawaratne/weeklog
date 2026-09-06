import { Outlet } from 'react-router-dom'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

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
