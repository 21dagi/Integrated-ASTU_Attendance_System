import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDateTime, formatTime } from "@/lib/utils";
import { AttendanceStatus } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";

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

const getStatusConfig = (status: string | null) => {
  switch (status) {
    case "PRESENT":
      return {
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        indicatorColor: "bg-green-600 dark:bg-green-400",
        icon: CheckCircle2,
        variant: "default" as const,
      };
    case "LATE":
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        indicatorColor: "bg-yellow-600 dark:bg-yellow-400",
        icon: AlertCircle,
        variant: "secondary" as const,
      };
    case "ABSENT":
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800",
        indicatorColor: "bg-red-600 dark:bg-red-400",
        icon: XCircle,
        variant: "destructive" as const,
      };
    default:
      return {
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        borderColor: "border-muted",
        indicatorColor: "bg-muted-foreground",
        icon: Activity,
        variant: "outline" as const,
      };
  }
};

export const ActivityList = ({
  activities,
  title,
  className,
}: ActivityListProps) => {
  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-2">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const statusConfig = getStatusConfig(activity.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={index}
                    className={cn(
                      "group/item relative overflow-hidden rounded-lg border p-3 transition-all duration-200 hover:shadow-md",
                      statusConfig.bgColor,
                      statusConfig.borderColor
                    )}
                  >
                    {/* Status indicator line */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1",
                        statusConfig.indicatorColor
                      )}
                    />

                    <div className="flex items-start justify-between ml-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {activity.student && (
                          <div className="flex-shrink-0">
                            <UserAvatar
                              name={activity.student.name}
                              image={activity.student.image}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {activity.course}
                            </p>
                            {activity.student && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                {activity.student.uni_id}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDateTime(new Date(activity.date))}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatTime(new Date(activity.recorded_at))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant={statusConfig.variant}
                          className="text-xs font-medium flex items-center gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {activity.status}
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
        </ScrollArea>

        {activities.length > 0 && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t text-xs text-muted-foreground">
            <span>{activities.length} recent activities</span>
            <span className="group-hover:text-primary transition-colors">
              Scroll for more →
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
