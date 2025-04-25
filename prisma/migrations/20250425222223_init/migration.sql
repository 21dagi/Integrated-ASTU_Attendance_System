-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- CreateTable
CREATE TABLE "AcademicYears" (
    "id" SERIAL NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AcademicYears_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semesters" (
    "id" SERIAL NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schools" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER,
    "year_level" INTEGER NOT NULL,
    "label" VARCHAR NOT NULL,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" SERIAL NOT NULL,
    "uni_id" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'student',
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructors" (
    "id" SERIAL NOT NULL,
    "uni_id" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'instructor',

    CONSTRAINT "Instructors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admins" (
    "id" SERIAL NOT NULL,
    "uni_id" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'admin',

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseOfferings" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "instructor_id" INTEGER NOT NULL,

    CONSTRAINT "CourseOfferings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentSections" (
    "student_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudentSections_pkey" PRIMARY KEY ("student_id","semester_id")
);

-- CreateTable
CREATE TABLE "AttendanceSessions" (
    "id" SERIAL NOT NULL,
    "course_offering_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "session_date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,

    CONSTRAINT "AttendanceSessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecords" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schools_name_key" ON "Schools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Students_uni_id_key" ON "Students"("uni_id");

-- CreateIndex
CREATE UNIQUE INDEX "Students_email_key" ON "Students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instructors_uni_id_key" ON "Instructors"("uni_id");

-- CreateIndex
CREATE UNIQUE INDEX "Instructors_email_key" ON "Instructors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_uni_id_key" ON "Admins"("uni_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Courses_code_key" ON "Courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOfferings_course_id_semester_id_section_id_instructor_key" ON "CourseOfferings"("course_id", "semester_id", "section_id", "instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecords_session_id_student_id_key" ON "AttendanceRecords"("session_id", "student_id");

-- AddForeignKey
ALTER TABLE "Semesters" ADD CONSTRAINT "Semesters_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYears"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "Schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseOfferings" ADD CONSTRAINT "CourseOfferings_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSections" ADD CONSTRAINT "StudentSections_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSections" ADD CONSTRAINT "StudentSections_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSections" ADD CONSTRAINT "StudentSections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSessions" ADD CONSTRAINT "AttendanceSessions_course_offering_id_fkey" FOREIGN KEY ("course_offering_id") REFERENCES "CourseOfferings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSessions" ADD CONSTRAINT "AttendanceSessions_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecords" ADD CONSTRAINT "AttendanceRecords_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "AttendanceSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecords" ADD CONSTRAINT "AttendanceRecords_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
