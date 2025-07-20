import { AppSidebar } from '@/components/app-sidebar'

import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/context/use-auth'
import cookiesStorage from '@/utils/cookie-storage'
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const cookie = await cookiesStorage.getItem('auth')
    if (!cookie) return redirect({ to: '/', search: location.href })
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  useEffect(() => {
    if (!accessToken || accessToken === null) {
      navigate({ to: '/' })
    }
  }, [accessToken])
  return (
    <section className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div>
                <h1>Dashboard management</h1>
              </div>
            </div>
          </header>
          <div className=" p-4 pt-0 bg-slate-50 h-full">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
