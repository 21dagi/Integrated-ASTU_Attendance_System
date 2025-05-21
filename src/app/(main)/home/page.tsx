"use client";
import { Button } from "@/components/ui/button";
import { DotIcon, Loader2, LogOutIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { StudentDashboard } from "./_components/StudentDashboard";

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
      {data?.user.role == "student" ? (
        <StudentDashboard />
      ) : (
        <>
          <h1>Home</h1>
          <p>
            Hello, {data?.user.name} <DotIcon className="inline" />{" "}
            {data?.user.role}
          </p>
          <Button
            variant={"outline"}
            className="hover:bg-red-50"
            onClick={() => signOut()}
          >
            signOut
            <LogOutIcon />
          </Button>
        </>
      )}
    </div>
  );
};

export default HomePage;
