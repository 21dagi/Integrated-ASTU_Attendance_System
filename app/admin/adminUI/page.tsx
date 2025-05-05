"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ContentRenderer } from "@/components/content/content-renderer"

export default function Page() {
  // State to track which menu item is selected
  const [selectedItem, setSelectedItem] = useState("dashboard")

  // Function to get breadcrumb title based on selected item
  const getBreadcrumbTitle = () => {
    switch (selectedItem) {
      
      default:
        return selectedItem
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar onSelectMenuItem={setSelectedItem} selectedItem={selectedItem} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <ContentRenderer selectedItem={selectedItem} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
