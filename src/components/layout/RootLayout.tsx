"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "../ThemeProvider";
const queryClient = new QueryClient();
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
}
