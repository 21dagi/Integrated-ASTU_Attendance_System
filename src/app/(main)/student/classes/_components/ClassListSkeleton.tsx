import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const ClassListSkeleton = () => {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search classes..." className="pl-8" disabled />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-2 w-full" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-[150px] mb-2" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ))}
                <div className="flex items-center justify-between mt-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
