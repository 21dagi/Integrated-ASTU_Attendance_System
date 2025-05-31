"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="flex w-full max-w-sm flex-col gap-6 ">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
