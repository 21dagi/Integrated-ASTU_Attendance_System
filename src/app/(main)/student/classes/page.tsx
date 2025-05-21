"use client";

import { ClassList } from "./_components/ClassList";
import { useGetStudentClasses } from "@/api/student";
import { ClassListSkeleton } from "./_components/ClassListSkeleton";

export default function StudentClassesPage() {
  const { data, isLoading, error } = useGetStudentClasses();

  if (isLoading) {
    return <ClassListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Error loading classes</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Transform the data to match the ClassCard props
  const classes = data.enrollments.flatMap((enrollment) =>
    enrollment.courses.map((course) => ({
      ...course,
      colorClass: "bg-blue-500", // You can add logic to assign different colors
    }))
  );

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">
          View and manage your enrolled courses
        </p>
      </div>
      <ClassList classes={classes} />
    </div>
  );
}
