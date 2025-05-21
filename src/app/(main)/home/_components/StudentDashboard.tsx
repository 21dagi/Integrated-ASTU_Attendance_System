import { useGetStudentOverview } from "@/api/student";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { SessionList } from "@/components/dashboard/SessionList";
import { BookOpen, Calendar, Clock, GraduationCap } from "lucide-react";
import { StudentDashboardSkeleton } from "./StudentDashboardSkeleton";

export const StudentDashboard = () => {
  const { data, isLoading, error } = useGetStudentOverview();

  if (isLoading) {
    return <StudentDashboardSkeleton />;
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Current Semester"
          value={data.overview.current_semester}
          description={data.overview.academic_year}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Total Courses"
          value={data.overview.total_courses}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Attendance Rate"
          value={`${data.overview.overall_attendance_rate.toFixed(1)}%`}
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Upcoming Sessions"
          value={data.upcoming_sessions.length}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Enrolled Courses</h2>
          <div className="grid gap-4">
            {data.enrolled_courses.map((course) => (
              <CourseCard
                key={course.course_id}
                courseCode={course.course_code}
                courseTitle={course.course_title}
                section={course.section}
                instructor={course.instructor}
                totalSessions={course.total_sessions}
                attendanceRate={course.attendance_rate}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SessionList
            title="Upcoming Sessions"
            sessions={data.upcoming_sessions}
          />
          <ActivityList
            title="Recent Activity"
            activities={data.recent_activity}
          />
        </div>
      </div>
    </div>
  );
};
