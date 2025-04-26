import React from "react";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 flex justify-between items-center p-4 h-16 bg-zinc-50 text-slate-900">
      <div className="text-2xl font-bold text-zinc-900">
        <SidebarTrigger />
        <Link href="/" className="cursor-pointer">
          Attendace
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
