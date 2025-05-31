import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentAttendanceResponse } from "@/types/api";
import { cn, formatTime } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  List,
} from "lucide-react";

interface AttendanceListProps {
  records: StudentAttendanceResponse["attendance_records"];
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PRESENT":
      return {
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        icon: CheckCircle2,
        variant: "default" as const,
      };
    case "LATE":
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        icon: AlertCircle,
        variant: "secondary" as const,
      };
    case "ABSENT":
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800",
        icon: XCircle,
        variant: "destructive" as const,
      };
    default:
      return {
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        borderColor: "border-muted",
        icon: Calendar,
        variant: "outline" as const,
      };
  }
};

export const AttendanceList = ({ records }: AttendanceListProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-900/30 rounded">
            <List className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <CardTitle className="text-lg">Attendance Records</CardTitle>
          {records.length > 0 && (
            <Badge variant="outline" className="ml-auto text-xs">
              {records.length} sessions
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No attendance records found
              </p>
            </div>
          ) : (
            records.map((record) => {
              const statusConfig = getStatusConfig(record.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={record.session_id}
                  className={cn(
                    "group/item relative overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:shadow-sm",
                    statusConfig.bgColor,
                    statusConfig.borderColor
                  )}
                >
                  {/* Status indicator line */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full w-1",
                      statusConfig.color.replace("text-", "bg-")
                    )}
                  />

                  <div className="flex items-center justify-between ml-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        <StatusIcon
                          className={cn("h-4 w-4", statusConfig.color)}
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">
                            {format(
                              new Date(record.date),
                              "EEEE, MMMM dd, yyyy"
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(record.start_time), "hh:mm a")} -{" "}
                              {format(new Date(record.end_time), "hh:mm a")}
                            </span>
                          </div>
                          {record.recorded_at && (
                            <div className="flex items-center gap-1">
                              <span>•</span>
                              <span>
                                Recorded:{" "}
                                {formatTime(new Date(record.recorded_at))}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant={statusConfig.variant}
                        className="text-xs font-medium flex items-center gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {record.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              );
            })
          )}
        </div>

        {records.length > 0 && (
          <div className="flex items-center justify-center pt-4 mt-4 border-t text-xs text-muted-foreground">
            <span>End of attendance records</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
