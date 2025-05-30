import {
  PrismaClient,
  AttendanceStatus,
  Student,
  Instructor,
} from "@prisma/client";
import { hash } from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing database...");
  const tables: any = [
    prisma.attendanceRecord,
    prisma.attendanceSession,
    prisma.enrollment,
    prisma.courseOffering,
    prisma.course,
    prisma.section,
    prisma.department,
    prisma.school,
    prisma.semester,
    prisma.academicYear,
    prisma.student,
    prisma.instructor,
    prisma.admin,
  ];

  for (const table of tables) {
    await table.deleteMany();
  }
  console.log("Database cleared successfully");
}

async function seedAcademicYears() {
  const years = [
    {
      name: "Year 2023/2024",
      start_date: new Date("2023-09-01"),
      end_date: new Date("2024-06-30"),
      is_active: false,
    },
    {
      name: "Year 2024/2025",
      start_date: new Date("2024-09-01"),
      end_date: new Date("2025-06-30"),
      is_active: true,
    },
  ];

  const createdYears = await Promise.all(
    years.map((year) => prisma.academicYear.create({ data: year }))
  );

  await Promise.all(
    createdYears.map((year) =>
      prisma.idGenerator.create({
        data: {
          acedemic_year_id: year.id,
          qr_couter: 0,
          uni_id_couter: 0,
        },
      })
    )
  );

  console.log(
    `Created academic years: ${createdYears.map((y) => y.id).join(", ")}`
  );
  return createdYears;
}

async function seedSemesters(academicYears: any[]) {
  const semesters = [
    {
      academic_year_id: academicYears[1].id,
      name: "First Semester",
      start_date: new Date("2024-09-01"),
      end_date: new Date("2025-01-31"),
      is_active: false,
    },
    {
      academic_year_id: academicYears[1].id,
      name: "Second Semester",
      start_date: new Date("2025-02-01"),
      end_date: new Date("2025-06-30"),
      is_active: true,
    },
    {
      academic_year_id: academicYears[0].id,
      name: "First Semester",
      start_date: new Date("2023-09-01"),
      end_date: new Date("2024-01-31"),
      is_active: false,
    },
  ];

  const createdSemesters = await Promise.all(
    semesters.map((semester) => prisma.semester.create({ data: semester }))
  );
  console.log(
    `Created semesters: ${createdSemesters.map((s) => s.name).join(", ")}`
  );
  return createdSemesters;
}

async function seedSchoolsAndDepartments() {
  const schools = [
    { name: "School of Electrical Engineering" },
    { name: "School of Civil Engineering" },
    { name: "School of Mechanical Engineering" },
  ];

  const createdSchools = await Promise.all(
    schools.map((school) => prisma.school.create({ data: school }))
  );

  const departments = [
    { school_id: createdSchools[0].id, name: "Computer Science" },
    { school_id: createdSchools[0].id, name: "Software Engineering" },
    { school_id: createdSchools[1].id, name: "Civil Engineering" },
    { school_id: createdSchools[2].id, name: "Mechanical Engineering" },
  ];

  const createdDepartments = await Promise.all(
    departments.map((dept) => prisma.department.create({ data: dept }))
  );

  console.log(
    `Created schools: ${createdSchools.map((s) => s.name).join(", ")}`
  );
  console.log(
    `Created departments: ${createdDepartments.map((d) => d.name).join(", ")}`
  );
  return { schools: createdSchools, departments: createdDepartments };
}

async function seedSections(semesters: any[], departments: any[]) {
  const sections = [
    {
      semester_id: semesters[1].id,
      year_level: 1,
      label: "1",
    },
    {
      semester_id: semesters[1].id,
      department_id: departments[0].id,
      year_level: 2,
      label: "2",
    },
    {
      semester_id: semesters[1].id,
      department_id: departments[1].id,
      year_level: 2,
      label: "3",
    },
    {
      semester_id: semesters[0].id,
      department_id: departments[2].id,
      year_level: 3,
      label: "4",
    },
  ];

  const createdSections = await Promise.all(
    sections.map((section) => prisma.section.create({ data: section }))
  );

  console.log(
    `Created sections: ${createdSections
      .map((s) => `Year ${s.year_level}-${s.label}`)
      .join(", ")}`
  );
  return createdSections;
}

async function seedStudents(academicYearId: number, count: number = 200) {
  const hashedPassword = await hash("password123", 10);
  const students: Student[] = [];
  const qrGenerator = await prisma.idGenerator.findUnique({
    where: { acedemic_year_id: academicYearId },
  });

  if (!qrGenerator) throw new Error("QR ID generator not found");

  for (let i = 0; i < count; i++) {
    const yearCode = faker.helpers.arrayElement(["12", "13", "14"]);
    const randomId = faker.number.int({ min: 10000, max: 99999 });
    const uni_id = `UGR/${randomId}/${yearCode}`;
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email({
      firstName: first_name,
      lastName: last_name,
    });

    await prisma.idGenerator.update({
      where: { acedemic_year_id: academicYearId },
      data: { qr_couter: { increment: 1 } },
    });

    students.push({
      id: i,
      uni_id,
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      qr_id: qrGenerator.qr_couter + i + 1,
      image: faker.image.avatar(),
      role: "student",
      gender: faker.helpers.arrayElement(["F", "M"]),
    });
  }

  await prisma.student.createMany({ data: students });
  console.log(`Created ${students.length} students.`);
  return students;
}

async function seedInstructors(academicYearId: number, count: number = 50) {
  const hashedPassword = await hash("password123", 10);
  const instructors: Instructor[] = [];
  const qrGenerator = await prisma.idGenerator.findUnique({
    where: { acedemic_year_id: academicYearId },
  });

  if (!qrGenerator) throw new Error("QR ID generator not found");

  for (let i = 0; i < count; i++) {
    const yearCode = faker.helpers.arrayElement(["12", "13", "14"]);
    const instructorId = String(i + 1).padStart(3, "0");
    const uni_id = `INS/I${instructorId}/${yearCode}`;
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email({
      firstName: first_name,
      lastName: last_name,
    });

    await prisma.idGenerator.update({
      where: { acedemic_year_id: academicYearId },
      data: { qr_couter: { increment: 1 } },
    });

    instructors.push({
      id: i,
      uni_id,
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: faker.image.avatar(),
      role: "instructor",
      gender: faker.helpers.arrayElement(["F", "M"]),
    });
  }

  await prisma.instructor.createMany({ data: instructors });
  console.log(`Created ${instructors.length} instructors.`);
  return instructors;
}

async function seedAdmins() {
  const hashedPassword = await hash("password123", 10);
  const admins = [
    {
      uni_id: "ADM/A001/12",
      first_name: "Admin",
      last_name: "One",
      email: "admin1@example.com",
      password: hashedPassword,
    },
    {
      uni_id: "ADM/A002/12",
      first_name: "Admin",
      last_name: "Two",
      email: "admin2@example.com",
      password: hashedPassword,
    },
  ];

  const createdAdmins = await Promise.all(
    admins.map((admin) => prisma.admin.create({ data: admin }))
  );
  console.log(
    `Created admins: ${createdAdmins.map((a) => a.last_name).join(", ")}`
  );
  return createdAdmins;
}

async function seedCourses() {
  const courses = [
    { code: "CS101", title: "Introduction to Programming", credits: 3 },
    { code: "CS201", title: "Data Structures", credits: 4 },
    { code: "EE201", title: "Circuit Analysis I", credits: 4 },
    { code: "CS301", title: "Algorithms", credits: 3 },
    { code: "CS401", title: "Operating Systems", credits: 4 },
    { code: "ME101", title: "Mechanics I", credits: 3 },
    { code: "CE201", title: "Structural Engineering", credits: 4 },
    { code: "CS202", title: "Database Systems", credits: 3 },
    { code: "EE301", title: "Electronics", credits: 4 },
    { code: "ME201", title: "Thermodynamics", credits: 3 },
  ];

  const createdCourses = await Promise.all(
    courses.map((course) => prisma.course.create({ data: course }))
  );
  console.log(
    `Created courses: ${createdCourses.map((c) => c.code).join(", ")}`
  );
  return createdCourses;
}

async function seedCourseOfferings(
  courses: any[],
  semesters: any[],
  sections: any[],
  instructors: Instructor[]
) {
  const offerings = [];
  for (let i = 0; i < 50; i++) {
    offerings.push({
      course_id: courses[i % courses.length].id,
      semester_id: semesters[i % semesters.length].id,
      section_id: sections[i % sections.length].id,
      instructor_id: instructors[i % instructors.length].id,
    });
  }

  const createdOfferings = await Promise.all(
    offerings.map((offering) =>
      prisma.courseOffering.create({ data: offering })
    )
  );
  console.log(`Created ${createdOfferings.length} course offerings.`);
  return createdOfferings;
}

async function seedEnrollments(
  students: Student[],
  semesters: any[],
  sections: any[]
) {
  const enrollments = [];
  for (let i = 0; i < students.length; i++) {
    let semester = semesters[i % semesters.length];
    enrollments.push({
      student_id: students[i].id,
      semester_id: semester.id,
      section_id: sections[i % sections.length].id,
      is_active: semester.is_active,
    });
  }

  await prisma.enrollment.createMany({
    data: enrollments,
    skipDuplicates: true,
  });
  console.log(`Enrolled ${enrollments.length} students in sections.`);
}

async function seedAttendanceSessions(offerings: any[]) {
  const sessions = [];
  for (const offering of offerings.slice(0, 10)) {
    sessions.push(
      {
        course_offering_id: offering.id,
        session_date: new Date("2024-09-10"),
        start_time: new Date("2024-09-10T10:00:00Z"),
        end_time: new Date("2024-09-10T11:00:00Z"),
      },
      {
        course_offering_id: offering.id,
        session_date: new Date("2024-09-12"),
        start_time: new Date("2024-09-12T10:00:00Z"),
        end_time: new Date("2024-09-12T11:00:00Z"),
      }
    );
  }

  const createdSessions = await Promise.all(
    sessions.map((session) =>
      prisma.attendanceSession.create({ data: session })
    )
  );
  console.log(`Created ${createdSessions.length} attendance sessions.`);
  return createdSessions;
}

async function seedAttendanceRecords(sessions: any[], students: Student[]) {
  const records = [];
  for (const session of sessions.slice(0, 5)) {
    for (const student of students.slice(0, 5)) {
      records.push({
        session_id: session.id,
        student_id: student.id,
        status: faker.helpers.arrayElement([
          AttendanceStatus.PRESENT,
          AttendanceStatus.ABSENT,
          AttendanceStatus.LATE,
        ]),
      });
    }
  }

  await prisma.attendanceRecord.createMany({
    data: records,
    skipDuplicates: true,
  });
  console.log(`Created ${records.length} attendance records.`);
}

async function main() {
  try {
    await clearDatabase();
    console.log("Start seeding ...");

    const academicYears = await seedAcademicYears();
    const semesters = await seedSemesters(academicYears);
    const { departments } = await seedSchoolsAndDepartments();
    const sections = await seedSections(semesters, departments);
    const students = await seedStudents(academicYears[1].id);
    const instructors = await seedInstructors(academicYears[1].id);
    await seedAdmins();
    const courses = await seedCourses();
    const offerings = await seedCourseOfferings(
      courses,
      semesters,
      sections,
      instructors
    );
    await seedEnrollments(students, semesters, sections);
    const sessions = await seedAttendanceSessions(offerings);
    await seedAttendanceRecords(sessions, students);

    console.log("Seeding finished.");
  } catch (e) {
    console.error("Seeding failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
