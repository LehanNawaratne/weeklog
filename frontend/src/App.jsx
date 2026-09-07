import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/app-layout'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/protected-route'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, homePathFor, useAuth } from '@/context/auth-context'

import { AcceptInvitePage } from '@/pages/accept-invite'
import { AccountSettingsPage } from '@/pages/account-settings'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { MemberProfilePage } from '@/pages/member-profile'
import { MyReportsPage } from '@/pages/my-reports'
import { NotFoundPage } from '@/pages/not-found'
import { ProjectsPage } from '@/pages/projects'
import { RegisterPage } from '@/pages/register'
import { ReportDetailPage } from '@/pages/report-detail'
import { ReportEditorPage } from '@/pages/report-editor'
import { ReportReviewPage } from '@/pages/report-review'
import { SectionComparePage } from '@/pages/section-compare'
import { TeamMembersPage } from '@/pages/team-members'
import { TeamReportsPage } from '@/pages/team-reports'
import { UserManagementPage } from '@/pages/user-management'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={homePathFor(user)} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider delayDuration={0}>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomeRedirect />} />

              <Route element={<AppLayout />}>
                <Route element={<ProtectedRoute role="member" />}>
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/my-reports/new" element={<ReportEditorPage />} />
                  <Route path="/my-reports/:id/edit" element={<ReportEditorPage />} />
                </Route>

                <Route path="/reports/:id" element={<ReportDetailPage />} />
                <Route path="/settings" element={<AccountSettingsPage />} />

                <Route element={<ProtectedRoute role="manager" />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/dashboard/reports" element={<TeamReportsPage />} />
                  <Route path="/dashboard/compare" element={<SectionComparePage />} />
                  <Route path="/dashboard/reports/:id/review" element={<ReportReviewPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/team" element={<TeamMembersPage />} />
                  <Route path="/team/:id" element={<MemberProfilePage />} />
                  <Route path="/users" element={<UserManagementPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster position="top-right" />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
