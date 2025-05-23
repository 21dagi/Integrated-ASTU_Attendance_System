import React from "react";
import { useGetInstructorOverview } from "@/api/instructor";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { SessionList } from "@/components/dashboard/SessionList";
import { BookOpen, Calendar, Clock, Users } from "lucide-react";
import { InstructorDashboardSkeleton } from "./InstructorDashboardSkeleton";

const InstructorDashboard = () => {
  const { data, isLoading, error } = useGetInstructorOverview();

  if (isLoading) {
    return <InstructorDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground text-red-500">
          Error loading dashboard data
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 mx-auto">
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
          title="Total Students"
          value={data.overview.total_students}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Overall Attendance"
          value={`${data.overview.overall_attendance_rate.toFixed(1)}%`}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <div className="grid gap-4">
            {data.courses.map((course) => (
              <CourseCard
                key={course.id}
                courseCode={course.course.code}
                courseTitle={course.course.title}
                section={course.section}
                instructor="You"
                totalSessions={course.total_sessions}
                attendanceRate={course.average_attendance}
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

export default InstructorDashboard;
