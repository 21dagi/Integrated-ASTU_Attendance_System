import Navbar from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 pt-16">{children}</div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default DashboardLayout;
