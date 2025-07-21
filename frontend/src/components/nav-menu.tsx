import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function NavMenu({
  menu,
}: {
  menu: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const location = useLocation()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {menu.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={cn({
              'rounded-lg bg-primary text-white':
                location.pathname === item.url,
            })}
          >
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
