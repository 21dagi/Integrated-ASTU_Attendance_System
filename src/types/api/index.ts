import { AttendanceStatus } from "@prisma/client";

type StudentDashboardOverview = {
  current_semester: string;
  academic_year: string;
  total_courses: number;
  overall_attendance_rate: number;
};
type EnrolledCourseDetail = {
  course_id: number;
  course_code: string;
  course_title: string;
  section: string;
  instructor: string;
  total_sessions: number;
  attendance_rate: number;
};
type UpcomingSessionDetail = {
  course_code: string;
  course_title: string;
  session_date: string;
  start_time: string;
  instructor: string;
};
type RecentActivityDetail = {
  course: string;
  status: AttendanceStatus | null;
  date: string;
  recorded_at: string;
};

export type StudentDashboardResponse = {
  overview: StudentDashboardOverview;
  enrolled_courses: EnrolledCourseDetail[];
  upcoming_sessions: UpcomingSessionDetail[];
  recent_activity: RecentActivityDetail[];
};
