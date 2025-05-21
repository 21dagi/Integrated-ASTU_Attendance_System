import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  courseCode: string;
  courseTitle: string;
  section: string;
  instructor: string;
  totalSessions: number;
  attendanceRate: number;
  className?: string;
}

export const CourseCard = ({
  courseCode,
  courseTitle,
  section,
  instructor,
  totalSessions,
  attendanceRate,
  className,
}: CourseCardProps) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {courseCode} - {courseTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Section:</span>
            <span>{section}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Instructor:</span>
            <span>{instructor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Sessions:</span>
            <span>{totalSessions}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Attendance Rate:</span>
              <span>{attendanceRate.toFixed(1)}%</span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
