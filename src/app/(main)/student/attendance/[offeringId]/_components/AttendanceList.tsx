import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentAttendanceResponse } from "@/types/api";
import { cn, formatDateTime, formatTime } from "@/lib/utils";
import { format } from "date-fns";

interface AttendanceListProps {
  records: StudentAttendanceResponse["attendance_records"];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PRESENT":
      return "text-green-600";
    case "LATE":
      return "text-yellow-600";
    case "ABSENT":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
};

export const AttendanceList = ({ records }: AttendanceListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No attendance records found
            </p>
          ) : (
            records.map((record) => (
              <div
                key={record.session_id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {format(record.date, "EEE MMM dd, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(record.start_time, "hh:mm")} -{" "}
                    {format(record.end_time, "hh:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getStatusColor(record.status)
                    )}
                  >
                    {record.status}
                  </span>
                  {record.recorded_at && (
                    <span className="text-xs text-muted-foreground">
                      Recorded: {formatTime(new Date(record.recorded_at))}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
