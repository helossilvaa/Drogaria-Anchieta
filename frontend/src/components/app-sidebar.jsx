"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Fulana",
    email: "Fulana@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "#", icon: SquareTerminal, isActive: true },
    { title: "Nova venda", url: "#", icon: Bot },
    { title: "Produtos", url: "#", icon: BookOpen },
    { title: "Programa de fidelidade", url: "#", icon: Settings2 },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar
      style={{ top: "var(--header-height)" }}
      className="h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex justify-center items-center py-4">
                <div className="w-32 h-16 flex justify-center items-center">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} className="flex flex-col items-center" />
      </SidebarContent>

      <SidebarFooter className="flex justify-center">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
