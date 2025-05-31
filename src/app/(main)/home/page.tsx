"use client";
import { Button } from "@/components/ui/button";
import { DotIcon, Loader2, LogOutIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { StudentDashboard } from "./_components/StudentDashboard";
import { AdminDashboard } from "./_components/AdminDashboard";
import InstructorDashboard from "./_components/InstructorDashboard";

const HomePage = () => {
  const { data, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full h-full top-16">
      {data?.user.role == "student" && <StudentDashboard />}
      {data?.user.role == "admin" && <AdminDashboard />}
      {data?.user.role == "instructor" && <InstructorDashboard />}
    </div>
  );
};

export default HomePage;
