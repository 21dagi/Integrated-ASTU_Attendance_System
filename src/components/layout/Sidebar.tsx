"use client";
import {
  Calendar,
  Home,
  Users,
  BookOpen,
  ClipboardCheck,
  School,
  UserCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
// Menu items for different roles
const studentItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Classes",
    url: "/student/classes",
    icon: BookOpen,
  },
];

const instructorItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Take Attendance",
    url: "/instructor/take-attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Classes",
    url: "/instructor/classes",
    icon: School,
  },
  {
    title: "Attendance Records",
    url: "/instructor/attendance",
    icon: UserCheck,
  },
];

const adminItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Classes",
    url: "/admin/classes",
    icon: School,
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: Users,
  },
  {
    title: "Instructors",
    url: "/admin/instructors",
    icon: Users,
  },
  {
    title: "Attendance",
    url: "/admin/attendance",
    icon: UserCheck,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="flex items-center gap-2 px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Image
            src="/cube.png"
            alt="Company Logo"
            width={40}
            height={40}
            className="size-10 object-cover bg-transparent"
          />
          <span className="font-semibo text-lg">Jotion</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-5">
        {userRole === "student" && (
          <SidebarGroup>
            <SidebarGroupLabel>Student Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {studentItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === "instructor" && (
          <SidebarGroup>
            <SidebarGroupLabel>Instructor Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {instructorItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
