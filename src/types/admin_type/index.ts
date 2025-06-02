export type CurrentSemester = {
  name: string;
  academic_year: string;
  total_course_offerings: number;
  total_sections: number;
};

export type DepartmentDistribution = {
  name: string;
  count: number;
};

export type AttendanceStatistics = {
  present: number;
  absent: number;
  late: number;
};

export type GenderDistribution = {
  gender: string;
  count: number;
};

export type DashboardResponse = {
  overview: {
    total_students: number;
    total_instructors: number;
    active_classes: number;
    current_semester: CurrentSemester;
  };
  department_distribution: DepartmentDistribution[];
  attendance_statistics: AttendanceStatistics;
  gender_distribution: GenderDistribution[];
};

export type CourseOffering = {
  id: number;
  section: {
    id: number;
    year_level: number;
    semester_id: number;
    department: {
      name: string;
    };
  };

  semester: {
    id: number;
    academic_year_id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
  };
  course: {
    id: number;
    code: string;
    title: string;
    credits: number;
  };
  instructor: {
    id: number;
    uni_id: string;
    first_name: string;
    last_name: string;
    image: string;
    gender: string;
    email: string;
    role: string;
  };
  totalStudents: number;
  sessions: any[];
  averageAttendance: number | null;
};
export type Student = {
  id: number;
  uni_id: string;
  qr_id: number;
  first_name: string;
  last_name: string;
  image: string;
  role: string;
  gender: string;
  email: string;
  section: {
    id: number;
    department_id: number;
    year_level: number;
    label: string;
    semester_id: number;
    department: {
      id: number;
      school_id: number;
      name: string;
    };
  };
  department: {
    id: number;
    school_id: number;
    name: string; // Department name
  };
};
