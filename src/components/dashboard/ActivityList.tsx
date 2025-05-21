import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDateTime } from "@/lib/utils";
import { AttendanceStatus } from "@prisma/client";

interface ActivityItem {
  course: string;
  status: AttendanceStatus | null;
  date: string;
  recorded_at: string;
}

interface ActivityListProps {
  activities: ActivityItem[];
  title: string;
  className?: string;
}

const getStatusColor = (status: AttendanceStatus | null) => {
  switch (status) {
    case "PRESENT":
      return "text-green-500";
    case "ABSENT":
      return "text-red-500";
    case "LATE":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

export const ActivityList = ({
  activities,
  title,
  className,
}: ActivityListProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.course}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(new Date(activity.date))}
                </p>
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  getStatusColor(activity.status)
                )}
              >
                {activity.status || "No Record"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
