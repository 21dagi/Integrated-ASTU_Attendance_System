"use client";
import React from "react";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NavAvatar } from "@/components/nav-avatar";
import { useSession } from "next-auth/react";
const Navbar = () => {
  const { data } = useSession();
  return (
    <div className="w-full z-50 flex justify-between items-center p-4 md:px-8 h-16 bg-zinc-50 text-slate-900">
      <div className="text-2xl font-bold text-zinc-900">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          <Link href="/" className="cursor-pointer">
            Jot<span className="text-emerald-500">ion</span>
          </Link>
        </div>
      </div>
      <NavAvatar user={data?.user} />
    </div>
  );
};

export default Navbar;
