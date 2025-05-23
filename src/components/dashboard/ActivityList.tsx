import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDateTime, formatTime } from "@/lib/utils";
import { AttendanceStatus } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityItem {
  course: string;
  status: string | null;
  date: string;
  recorded_at: string;
  student?: {
    name: string;
    uni_id: string;
    image: string | null;
  };
}

interface ActivityListProps {
  activities: ActivityItem[];
  title: string;
  className?: string;
}

const getStatusColor = (status: string | null) => {
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
        <ScrollArea className="h-[300px]">
          <div className="space-y-4 pr-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  {activity.student && (
                    <UserAvatar
                      name={activity.student.name}
                      image={activity.student.image}
                    />
                  )}

                  <p className="text-sm font-medium">{activity.course}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(new Date(activity.date))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getStatusColor(activity.status)
                    )}
                  >
                    {activity.status}
                  </span>
                  <span className="text-xs text-muted-foreground text-nowrap">
                    {formatTime(new Date(activity.recorded_at))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
