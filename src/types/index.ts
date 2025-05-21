import {
  AcademicYear as DBAcademicYear,
  Semester as DBSemester,
  School as DBSchool,
  Department as DBDepartment,
  Section as DBSection,
  Student as DBStudent,
  Instructor as DBInstructor,
  Admin as DBAdmin,
  Course as DBCourse,
  CourseOffering as DBCourseOffering,
  Enrollment as DBEnrollment,
  AttendanceSession as DBAttendanceSession,
  AttendanceRecord as DBAttendanceRecord,
} from "@prisma/client"; // Import Prisma's generated types
export type ROLE = "student" | "instructor" | "admin";

export type Student = Omit<DBStudent, "password">;
export type Instructor = Omit<DBInstructor, "password">;
export type Admin = Omit<DBAdmin, "password">;

export type AcademicYear = Omit<DBAcademicYear, "createdAt" | "updatedAt">;
export type Semester = Omit<DBSemester, "createdAt" | "updatedAt">;
export type School = Omit<DBSchool, "createdAt" | "updatedAt">;
export type Department = Omit<DBDepartment, "createdAt" | "updatedAt">;
export type Section = Omit<DBSection, "createdAt" | "updatedAt">;
export type Course = Omit<DBCourse, "createdAt" | "updatedAt">;
export type CourseOffering = Omit<DBCourseOffering, "createdAt" | "updatedAt">;
export type Enrollment = Omit<DBEnrollment, "createdAt" | "updatedAt">;

export type AttendanceSession = Omit<
  DBAttendanceSession,
  "createdAt" | "updatedAt"
>;
export type AttendanceRecord = Omit<
  DBAttendanceRecord,
  "createdAt" | "updatedAt"
>;
