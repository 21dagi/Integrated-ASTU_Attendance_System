"use client";

import { useGetStudentAttendance } from "@/api/student";
import { AttendanceOverview } from "./_components/AttendanceOverview";
import { AttendanceList } from "./_components/AttendanceList";
import { AttendanceSkeleton } from "./_components/AttendanceSkeleton";
import { useParams } from "next/navigation";

export default function StudentAttendancePage() {
  const params = useParams();
  const offeringId = params?.offeringId as string;
  const { data, isLoading, error } = useGetStudentAttendance(offeringId);

  if (isLoading) {
    return <AttendanceSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground text-red-500">
          Error loading attendance data
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {data.course_details.course_code}
        </h1>
        <p className="text-muted-foreground">
          {data.course_details.course_title}
        </p>
      </div>
      <div className="grid gap-6">
        <AttendanceOverview
          courseDetails={data.course_details}
          attendanceSummary={data.attendance_summary}
        />
        <AttendanceList records={data.attendance_records} />
      </div>
    </div>
  );
}
