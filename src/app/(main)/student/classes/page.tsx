"use client";

import { ClassList } from "./_components/ClassList";
import { useGetStudentClasses } from "@/api/student";
import { ClassListSkeleton } from "./_components/ClassListSkeleton";

export default function StudentClassesPage() {
  const { data, isLoading, error } = useGetStudentClasses();
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-gray-500",
  ];

  if (isLoading) {
    return <ClassListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground text-red-500">
          Error loading classes
        </p>
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
      colorClass: colors[Math.floor(Math.random() * colors.length)],
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
