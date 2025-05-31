import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDateTime } from "@/lib/utils";
import { format } from "date-fns";

interface SessionItem {
  course_code: string;
  course_title: string;
  session_date: string;
  start_time: string;
  instructor: string;
}

interface SessionListProps {
  sessions: SessionItem[];
  title: string;
  className?: string;
}

export const SessionList = ({
  sessions,
  title,
  className,
}: SessionListProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {session.course_code} - {session.course_title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(new Date(session.session_date))}
                </p>
                <p className="text-xs text-muted-foreground">
                  Instructor: {session.instructor}
                </p>
              </div>
              <span className="text-sm font-medium">
                {format(session.start_time, "hh:mm a")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
