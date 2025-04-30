"use client";
import { Button } from "@/components/ui/button";
import { DotIcon, LogOutIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const HomePage = () => {
  const { data, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-full top-16">
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
    </div>
  );
};

export default HomePage;
