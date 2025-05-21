import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, CalendarDays, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EnrolledCourseWithDetails } from "@/types/api";

export interface ClassCardProps extends EnrolledCourseWithDetails {
  className?: string;
  colorClass?: string;
}

export const ClassCard = ({
  offering_id,
  course,
  instructor,
  attendance,
  colorClass = "bg-blue-500",
  className,
}: ClassCardProps) => {
  return (
    <Card className={cn("overflow-hidden shrink-0", className)}>
      <div className={cn("h-2", colorClass)} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {course.code}
              <Badge variant="outline" className="ml-2">
                {course.credits} Credits
              </Badge>
            </CardTitle>
            <CardDescription className="text-base font-medium mt-1">
              {course.title}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{instructor.name}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>
              {attendance.last_session.start_time} -{" "}
              {attendance.last_session.end_time}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>
              Last Session:{" "}
              {new Date(attendance.last_session.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Attendance:</span>
              <span className="text-sm">
                {attendance.attendance_rate.toFixed(1)}%
              </span>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/student/courses/${offering_id}`}>
                <span>View Details</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
