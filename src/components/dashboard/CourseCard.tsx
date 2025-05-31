import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, Users, Calendar, TrendingUp, Clock } from "lucide-react";

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
  // Generate dynamic colors based on course code
  const colors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-teal-500 to-teal-600",
  ];

  const colorIndex =
    courseCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  const gradientColor = colors[colorIndex];

  // Determine attendance status
  const getAttendanceStatus = (rate: number) => {
    if (rate >= 90)
      return {
        label: "Excellent",
        variant: "default" as const,
        color: "text-green-600",
      };
    if (rate >= 75)
      return {
        label: "Good",
        variant: "secondary" as const,
        color: "text-blue-600",
      };
    if (rate >= 60)
      return {
        label: "Average",
        variant: "outline" as const,
        color: "text-yellow-600",
      };
    return {
      label: "Poor",
      variant: "destructive" as const,
      color: "text-red-600",
    };
  };

  const attendanceStatus = getAttendanceStatus(attendanceRate);

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md",
        className
      )}
    >
      {/* Gradient Header */}
      <div
        className={`h-20 bg-gradient-to-r ${gradientColor} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-2 right-2">
          <BookOpen className="h-5 w-5 text-white/80" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/10 rounded-full"></div>
      </div>

      <CardHeader className="pb-3 -mt-6 relative z-10">
        <div className="bg-background rounded-lg p-4 shadow-sm border">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="text-xs font-medium">
              {courseCode}
            </Badge>
            <Badge variant={attendanceStatus.variant} className="text-xs">
              {attendanceStatus.label}
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold text-foreground leading-tight">
            {courseTitle}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Details Grid */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Section:</span>
            <span className="font-medium ml-auto">{section}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Instructor:</span>
            <span className="font-medium ml-auto truncate">{instructor}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Sessions:</span>
            <span className="font-medium ml-auto">{totalSessions}</span>
          </div>
        </div>

        {/* Attendance Progress Section */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Attendance</span>
            </div>
            <span className={`text-sm font-bold ${attendanceStatus.color}`}>
              {attendanceRate.toFixed(1)}%
            </span>
          </div>

          <div className="space-y-2">
            <Progress value={attendanceRate} className="h-2 bg-muted/50" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>Perfect</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="flex items-center justify-between pt-2 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-3 mt-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last updated today</span>
          </div>
          <div className="text-xs font-medium text-primary group-hover:text-primary/80 transition-colors">
            View Details →
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
