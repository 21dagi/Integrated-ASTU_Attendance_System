"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AttendanceFormSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <Skeleton className="h-6 w-48" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      <ScrollArea className="h-[500px] rounded-md border p-4">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-[120px]" />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-[140px]" />
      </div>
    </Card>
  );
}
