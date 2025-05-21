import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CalendarDays } from "lucide-react";
import { StudentAttendanceResponse } from "@/types/api";

interface AttendanceOverviewProps {
  courseDetails: StudentAttendanceResponse["course_details"];
  attendanceSummary: StudentAttendanceResponse["attendance_summary"];
}

export const AttendanceOverview = ({
  courseDetails,
  attendanceSummary,
}: AttendanceOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Course Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Instructor</p>
                <p className="text-sm text-muted-foreground">
                  {courseDetails.instructor}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Section</p>
                <p className="text-sm text-muted-foreground">
                  {courseDetails.section}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Overall Attendance
                </span>
                <span className="font-medium">
                  {attendanceSummary.attendance_rate.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={attendanceSummary.attendance_rate}
                className="h-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-green-600">
                  {attendanceSummary.present_count}
                </p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  {attendanceSummary.late_count}
                </p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">
                  {attendanceSummary.absent_count}
                </p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Total Sessions: {attendanceSummary.total_sessions}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
