
"use client"

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
  Minus,
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
} from "@/components/ui/sidebar"

// Define menu items with unique IDs
const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    url: "/admin/dashboard",
    items: [],
  },
  {
    id: "students",
    title: "Students",
    icon: Users,
    url: "#",
    items: [
      { id: "all-students", title: "All Students", url: "#" },
      { id: "admission", title: "Admission", url: "#" },
      { id: "student-attendance", title: "Attendance", url: "#" },
      { id: "promotion", title: "Promotion", url: "#" },
    ],
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: Users,
    url: "#",
    items: [
      { id: "all-teachers", title: "All Teachers", url: "#" },
      { id: "attendance", title: "Attendance", url: "#" },
      { id: "leave-requests", title: "Leave Requests", url: "#" },
    ],
  },
  {
    id: "classes",
    title: "Classes",
    icon: BookOpen,
    url: "#",
    items: [
      { id: "all-classes", title: "All Classes", url: "#" },
      { id: "class-routine", title: "Class Routine", url: "#" },
      { id: "subjects", title: "Subjects", url: "#" },
    ],
  },
  {
    id: "examination",
    title: "Examination",
    icon: ClipboardList,
    url: "#",
    items: [
      { id: "exam-schedule", title: "Exam Schedule", url: "#" },
      { id: "grades", title: "Grades", url: "#" },
      { id: "marks", title: "Marks", url: "#" },
    ],
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: Calendar,
    url: "#",
    items: [],
  },
  {
    id: "reports",
    title: "Reports",
    icon: FileText,
    url: "#",
    items: [
      { id: "student-reports", title: "Student Reports", url: "#" },
      { id: "teacher-reports", title: "Teacher Reports", url: "#" },
      { id: "financial-reports", title: "Financial Reports", url: "#" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    url: "#",
    items: [
      { id: "system-settings", title: "System Settings", url: "#" },
      { id: "user-management", title: "User Management", url: "#" },
    ],
  },
]

const bottomMenuItems = [
  { id: "messages", title: "Messages", icon: Mail, url: "#" },
  { id: "notifications", title: "Notifications", icon: Bell, url: "#" },
  { id: "help", title: "Help", icon: HelpCircle, url: "#" },
  { id: "logout", title: "Logout", icon: LogOut, url: "#" },
]

export function AppSidebar({
  onSelectMenuItem,
  selectedItem,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onSelectMenuItem: (id: string) => void
  selectedItem: string
}) {
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
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
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
              <Collapsible
                key={item.title}
                defaultOpen={item.id === selectedItem || item.items.some((subItem) => subItem.id === selectedItem)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`hover:bg-sidebar-hover ${selectedItem === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
                      onClick={() => {
                        if (item.items.length === 0) {
                          onSelectMenuItem(item.id)
                        }
                      }}
                    >
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
                            <SidebarMenuSubButton
                              asChild
                              isActive={selectedItem === subItem.id}
                              className="hover:bg-sidebar-subitem-hover"
                            >
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  onSelectMenuItem(subItem.id)
                                }}
                              >
                                {subItem.title}
                              </a>
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
              <SidebarMenuButton
                asChild
                className={`hover:bg-sidebar-hover ${selectedItem === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onSelectMenuItem(item.id)
                  }}
                >
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
