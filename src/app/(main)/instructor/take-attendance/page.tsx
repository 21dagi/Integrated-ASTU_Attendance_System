"use client";
import { useGetClasses } from "@/api/instructor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSessionForm } from "./_components/CreateSessionForm";
import { Skeleton } from "@/components/ui/skeleton";

const TakeAttendancePage = () => {
  const { data: classes, isLoading, error } = useGetClasses();

  if (isLoading) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Failed to load classes. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>No Classes Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don&apos;t have any classes assigned for the current semester.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Attendance Session</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSessionForm classes={classes} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeAttendancePage;
