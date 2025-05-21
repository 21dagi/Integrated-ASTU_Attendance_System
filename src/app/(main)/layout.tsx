import Navbar from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />

        <SidebarInset>
          <Navbar />
          <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
