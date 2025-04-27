/*
  Warnings:

  - Added the required column `name` to the `AcademicYears` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester_id` to the `Sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceRecords" DROP CONSTRAINT "AttendanceRecords_session_id_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecords" DROP CONSTRAINT "AttendanceRecords_student_id_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceSessions" DROP CONSTRAINT "AttendanceSessions_course_offering_id_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceSessions" DROP CONSTRAINT "AttendanceSessions_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseOfferings" DROP CONSTRAINT "CourseOfferings_instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseOfferings" DROP CONSTRAINT "CourseOfferings_section_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseOfferings" DROP CONSTRAINT "CourseOfferings_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "Departments" DROP CONSTRAINT "Departments_school_id_fkey";

-- DropForeignKey
ALTER TABLE "Sections" DROP CONSTRAINT "Sections_department_id_fkey";

-- DropForeignKey
ALTER TABLE "Semesters" DROP CONSTRAINT "Semesters_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentSections" DROP CONSTRAINT "StudentSections_section_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentSections" DROP CONSTRAINT "StudentSections_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentSections" DROP CONSTRAINT "StudentSections_student_id_fkey";

-- AlterTable
ALTER TABLE "AcademicYears" ADD COLUMN     "name" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "CourseOfferings" ALTER COLUMN "instructor_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Departments" ALTER COLUMN "school_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sections" ADD COLUMN     "semester_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Semesters" ADD CONSTRAINT "Semesters_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYears"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "Schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSections" ADD CONSTRAINT "StudentSections_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSections" ADD CONSTRAINT "StudentSections_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSections" ADD CONSTRAINT "StudentSections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSessions" ADD CONSTRAINT "AttendanceSessions_course_offering_id_fkey" FOREIGN KEY ("course_offering_id") REFERENCES "CourseOfferings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSessions" ADD CONSTRAINT "AttendanceSessions_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecords" ADD CONSTRAINT "AttendanceRecords_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "AttendanceSessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecords" ADD CONSTRAINT "AttendanceRecords_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
