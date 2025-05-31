import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CalendarDays,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { StudentAttendanceResponse } from "@/types/api";

interface AttendanceOverviewProps {
  courseDetails: StudentAttendanceResponse["course_details"];
  attendanceSummary: StudentAttendanceResponse["attendance_summary"];
}

export const AttendanceOverview = ({
  courseDetails,
  attendanceSummary,
}: AttendanceOverviewProps) => {
  const getAttendanceStatus = (rate: number) => {
    if (rate >= 90)
      return {
        label: "Excellent",
        color: "text-green-600",
        variant: "default" as const,
      };
    if (rate >= 75)
      return {
        label: "Good",
        color: "text-blue-600",
        variant: "secondary" as const,
      };
    if (rate >= 60)
      return {
        label: "Average",
        color: "text-yellow-600",
        variant: "outline" as const,
      };
    return {
      label: "Poor",
      color: "text-red-600",
      variant: "destructive" as const,
    };
  };

  const status = getAttendanceStatus(attendanceSummary.attendance_rate);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Course Details Card */}
      <Card className="overflow-hidden group hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Course Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border-l-4 border-blue-200 dark:border-blue-800">
              <Users className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Instructor
                </p>
                <p className="text-sm text-muted-foreground">
                  {courseDetails.instructor}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border-l-4 border-green-200 dark:border-green-800">
              <CalendarDays className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Section</p>
                <p className="text-sm text-muted-foreground">
                  {courseDetails.section}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary Card */}
      <Card className="overflow-hidden group hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </div>
            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Overall Attendance
                </span>
                <span className={`font-bold ${status.color}`}>
                  {attendanceSummary.attendance_rate.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={attendanceSummary.attendance_rate}
                className="h-2"
              />
            </div>

            {/* Simplified attendance counts */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-muted-foreground">Present:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {attendanceSummary.present_count}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-muted-foreground">Late:</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {attendanceSummary.late_count}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-muted-foreground">Absent:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {attendanceSummary.absent_count}
                </span>
              </div>
            </div>

            <div className="text-center p-2 bg-muted/30 rounded border-t">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Total Sessions: {attendanceSummary.total_sessions}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
