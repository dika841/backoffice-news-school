import * as React from 'react'
import { ChartBarStacked, Megaphone, Newspaper, User2 } from 'lucide-react'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMenu } from './nav-menu'
import { useAuth } from '@/context/use-auth'
import { decodeToken } from '@/hooks/use-user-data'

const data = {
  user: {
    name: 'User',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  menu: [
    {
      name: 'Berita',
      url: '/dashboard',
      icon: Newspaper,
    },
    {
      name: 'Pengumuman',
      url: '/dashboard/announcements',
      icon: Megaphone,
    },
    {
      name: 'Kategori',
      url: '/dashboard/categories',
      icon: ChartBarStacked,
    },
    {
      name: 'Manajemen Akun',
      url: '/dashboard/users',
      icon: User2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { signOut, accessToken } = useAuth()
  const userData = accessToken !== null ? decodeToken(accessToken!) : null
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className=" flex aspect-square size-12 items-center justify-center rounded-lg">
                  <img src="/logo.webp" alt="logo smk muhamadiyah sumowono" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    Smk Muhammadiyah Sumowono
                  </span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu menu={data.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser role={userData?.role} signOut={signOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
