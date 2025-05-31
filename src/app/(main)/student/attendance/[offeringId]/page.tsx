"use client";

import { useGetStudentAttendance } from "@/api/student";
import { AttendanceOverview } from "./_components/AttendanceOverview";
import { AttendanceList } from "./_components/AttendanceList";
import { AttendanceSkeleton } from "./_components/AttendanceSkeleton";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertTriangle, Calendar } from "lucide-react";

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
        <Card className="p-8 max-w-md mx-auto text-center border-destructive/20">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Unable to Load Data
          </h3>
          <p className="text-muted-foreground">
            There was an error loading your attendance data. Please try
            refreshing the page.
          </p>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-6 border">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {data.course_details.course_code}
              </h1>
              <Badge variant="outline" className="text-xs">
                Course
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground mb-3">
              {data.course_details.course_title}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Academic Session</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Attendance Tracking
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
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
