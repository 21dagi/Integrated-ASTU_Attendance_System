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

export type CurrentSemesterDetail = {
  name: string;
  academic_year: string;
  start_date: string;
  end_date: string;
};
export type EnrolledCourseWithDetails = {
  offering_id: number;
  course: {
    code: string;
    title: string;
    credits: number;
  };
  instructor: {
    name: string;
    uni_id: string;
    image: string;
  };
  attendance: {
    total_sessions: number;
    present_count: number;
    attendance_rate: number;
    last_session: {
      date: string;
      start_time: string;
      end_time: string;
      status: string;
    };
  };
};
export type StudentEnrollmentDetail = {
  enrollment_id: number;
  section: {
    id: number;
    label: string; // e.g., "A", "B"
    year_level: number; // e.g., 1, 2, 3
  };
  is_active: boolean;
  courses: EnrolledCourseWithDetails[];
};

export type EnrollmentSummary = {
  total_sections: number;
  total_courses: number;
  active_enrollments: number;
};

export type StudentClassesResponse = {
  current_semester: CurrentSemesterDetail;
  enrollments: StudentEnrollmentDetail[];
  summary: EnrollmentSummary;
};

export type CourseDetails = {
  course_code: string;
  course_title: string;
  section: string; // e.g., "A", "B"
  instructor: string;
};

export type AttendanceSummary = {
  total_sessions: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  attendance_rate: number; // Percentage, e.g., 66.666
};
export type AttendanceRecordDetail = {
  session_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  recorded_at: string | null;
};

export type StudentAttendanceResponse = {
  course_details: CourseDetails;
  attendance_summary: AttendanceSummary;
  attendance_records: AttendanceRecordDetail[];
};
