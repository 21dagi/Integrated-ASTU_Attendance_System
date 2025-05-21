import { useQuery } from "@tanstack/react-query";
import { ClassCardProps } from "@/app/(main)/student/classes/_components/ClassCard";

async function getStudentClasses(): Promise<ClassCardProps[]> {
  const response = await fetch("/api/student/classes");
  if (!response.ok) {
    throw new Error("Failed to fetch student classes");
  }
  return response.json();
}

export function useGetStudentClasses() {
  return useQuery({
    queryKey: ["student-classes"],
    queryFn: getStudentClasses,
  });
}
