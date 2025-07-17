import * as React from 'react'
import { Command, Frame, Map, PieChart, User2 } from 'lucide-react'
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

const data = {
  user: {
    name: 'User',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  menu: [
    {
      name: 'Berita',
      url: '/dashboard/news',
      icon: Frame,
    },
    {
      name: 'Pengumuman',
      url: '/dashboard/announcements',
      icon: PieChart,
    },
    {
      name: 'Kategori',
      url: '/dashboard/categories',
      icon: Map,
    },
    {
      name: 'User Management',
      url: '/dashboard/users',
      icon: User2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Sekolah</span>
                  <span className="truncate text-xs">Pendidikan</span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
