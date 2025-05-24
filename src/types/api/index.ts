import { AttendanceStatus, Course } from "@prisma/client";

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

export type InstructorDashboardOverview = {
  current_semester: string;
  academic_year: string;
  total_courses: number;
  total_students: number; // Total students across all courses taught by this instructor
  overall_attendance_rate: number; // Overall attendance rate for all courses taught by this instructor
};

export type AttendanceStats = {
  present: number;
  late: number;
  absent: number;
};

export type InstructorDashboardCourse = {
  id: number; // CourseOffering ID
  course: {
    code: string;
    title: string;
  };
  section: string;
  total_students: number;
  total_sessions: number;
  attendance_stats: AttendanceStats;
  average_attendance: number;
};

export type InstructorRecentActivityStudentDetail = {
  name: string;
  uni_id: string;
  image: string | null;
};

export type InstructorRecentActivity = {
  student: InstructorRecentActivityStudentDetail;
  course: string;
  status: string;
  date: string;
  recorded_at: string;
};

export type InstructorDashboardResponse = {
  overview: InstructorDashboardOverview;
  courses: InstructorDashboardCourse[];
  upcoming_sessions: UpcomingSessionDetail[];
  recent_activity: InstructorRecentActivity[];
};

export type InstructorClassesResponse = {
  id: number;
  course: {
    title: string;
    code: string;
    credits: number;
  };
  semester: {
    id: number;
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
  };
  section: {
    id: number;
    label: string;
    year_level: number;
  };
  total_students: number;
};

export type SessionAttendanceStats = {
  total: number;
  present: number;
  absent: number;
  late: number;
};
export type CourseSessionDetail = {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  attendance_stats: SessionAttendanceStats;
};

export type CourseOfferingSessionsResponse = {
  course_info: {
    code: string;
    title: string;
  };
  section: string;
  semester: string; // e.g., "First Semester"
  sessions: CourseSessionDetail[];
};
export type StudentBasicInfo = {
  id: number;
  uni_id: string;
  first_name: string;
  last_name: string;
  image: string; // URL to student's image
  email: string;
};

export type SessionAttendanceRecord = {
  student: StudentBasicInfo;
  status: AttendanceStatus;
};

export type SessionDetailsResponse = {
  session_id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  course_info: {
    code: string;
    title: string;
  };
  section: string;
  semester: string;
  attendance_records: SessionAttendanceRecord[];
};
