import type * as React from "react"
import { 
  Home, 
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Mail,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Minus
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/admin/dashboard",
    items: []
  },
  {
    title: "Students",
    icon: Users,
    url: "#",
    items: [
      { title: "All Students", url: "#" },
      { title: "Admission", url: "#" },
      { title: "Attendance", url: "#" },
    ]
  },
  
  {
    title: "Classes",
    icon: BookOpen,
    url: "#",
    items: [
      { title: "All Classes", url: "#" },
      { title: "Class Routine", url: "#" },
      { title: "Subjects", url: "#" },
    ]
  },
  {
    title: "Examination",
    icon: ClipboardList,
    url: "#",
    items: [
      { title: "Exam Schedule", url: "#" },
      { title: "Grades", url: "#" },
      { title: "Marks", url: "#" },
    ]
  },
  {
    title: "Calendar",
    icon: Calendar,
    url: "#",
    items: []
  },
  {
    title: "Reports",
    icon: FileText,
    url: "#",
    items: [
      { title: "Student Reports", url: "#" },
      { title: "Teacher Reports", url: "#" },
      { title: "Financial Reports", url: "#" },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
    items: [
      { title: "System Settings", url: "#" },
      { title: "User Management", url: "#" },
    ]
  }
]

const bottomMenuItems = [
  { title: "Messages", icon: Mail, url: "#" },
  { title: "Notifications", icon: Bell, url: "#" },
  { title: "Help", icon: HelpCircle, url: "#" },
  { title: "Logout", icon: LogOut, url: "#" }
]

export function EmployeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-sidebar-background text-sidebar-foreground">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-xl font-bold">ASTU</span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">ASTU Portal</span>
                  <span className="text-xs text-muted-foreground">Empoyee Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <Collapsible key={item.title} defaultOpen={item.title === "Dashboard"}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-sidebar-hover">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                      {item.items.length > 0 && (
                        <>
                          <Plus className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover/collapsible:opacity-100 group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover/collapsible:opacity-100 group-data-[state=closed]/collapsible:hidden" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {item.items.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="hover:bg-sidebar-subitem-hover">
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarGroup className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="hover:bg-sidebar-hover">
                <a href={item.url}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  )
}