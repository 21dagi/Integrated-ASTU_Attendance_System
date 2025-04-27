import { PrismaClient, AttendanceStatus } from "@prisma/client";
import { hash } from "bcrypt"; // Recommended for password hashing

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing database...");

  // Delete in reverse order of dependencies
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.courseOffering.deleteMany();
  await prisma.course.deleteMany();
  await prisma.section.deleteMany();
  await prisma.department.deleteMany();
  await prisma.school.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.student.deleteMany();
  await prisma.instructor.deleteMany();
  await prisma.admin.deleteMany();

  console.log("Database cleared successfully");
}

async function main() {
  try {
    // Clear existing data
    await clearDatabase();

    console.log("Start seeding ...");

    // --- Passwords (In a real app, use a secure hashing library like bcrypt) ---
    const hashedPassword = await hash("password123", 10); // Hash a simple password

    // --- 1. Academic Years ---
    const year1 = await prisma.academicYear.create({
      data: {
        name: "Year 2023/2024",
        start_date: new Date("2023-09-01"),
        end_date: new Date("2024-06-30"),
        is_active: false,
      },
    });
    const year2 = await prisma.academicYear.create({
      data: {
        name: "Year 2024/2025",
        start_date: new Date("2024-09-01"),
        end_date: new Date("2025-06-30"),
        is_active: true,
      },
    });
    console.log(`Created academic years: ${year1.id}, ${year2.id}`);

    // --- 2. Semesters ---
    const semester1 = await prisma.semester.create({
      data: {
        academic_year_id: year2.id,
        name: "First Semister",
        start_date: new Date("2024-09-01"),
        end_date: new Date("2025-01-31"),
        is_active: true,
      },
    });
    const semester2 = await prisma.semester.create({
      data: {
        academic_year_id: year2.id,
        name: "Second Semester",
        start_date: new Date("2025-02-01"),
        end_date: new Date("2025-06-30"),
        is_active: false, // Assuming Fall is active
      },
    });
    const semester3 = await prisma.semester.create({
      data: {
        academic_year_id: year1.id, // Link to the previous year
        name: "First Semester",
        start_date: new Date("2024-02-01"),
        end_date: new Date("2024-06-30"),
        is_active: false,
      },
    });
    console.log(
      `Created semesters: ${semester1.name}, ${semester2.name}, ${semester3.name}`
    );

    // --- 3. Schools ---
    const school1 = await prisma.school.create({
      data: { name: "School of Electrical Engineering" },
    });
    const school2 = await prisma.school.create({
      data: { name: "School of Civil Engineering" },
    });
    console.log(`Created schools: ${school1.name}, ${school2.name}`);

    // --- 4. Departments ---
    const dept1 = await prisma.department.create({
      data: { school_id: school1.id, name: "Computer Science" },
    });
    const dept2 = await prisma.department.create({
      data: { school_id: school1.id, name: "Software Engineering" },
    });
    const dept3 = await prisma.department.create({
      data: { school_id: school2.id, name: "Civil Engineering" },
    });
    console.log(
      `Created departments: ${dept1.name}, ${dept2.name}, ${dept3.name}`
    );

    // --- 5. Sections ---
    // Freshman section (year_level 1, no department)
    const sectionFreshman = await prisma.section.create({
      data: {
        semester_id: semester1.id,
        year_level: 1,
        label: "A",
        // department_id is NULL
      },
    });
    // Year 2 section (linked to a department)
    const sectionSophomoreCS = await prisma.section.create({
      data: {
        semester_id: semester1.id,
        department_id: dept1.id,
        year_level: 2,
        label: "B",
      },
    });
    const sectionSophomoreEE = await prisma.section.create({
      data: {
        semester_id: semester1.id,
        department_id: dept2.id,
        year_level: 2,
        label: "A",
      },
    });
    console.log(
      `Created sections: Year ${sectionFreshman.year_level}-${sectionFreshman.label}, Year ${sectionSophomoreCS.year_level}-${sectionSophomoreCS.label}, Year ${sectionSophomoreEE.year_level}-${sectionSophomoreEE.label}`
    );

    // --- 6. Students (5 students, distributed) ---
    const studentsData = [
      {
        uni_id: "UGR/12345/12",
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith@example.com",
        password: hashedPassword,
      }, // Freshman
      {
        uni_id: "UGR/67890/12",
        first_name: "Bob",
        last_name: "Johnson",
        email: "bob.johnson@example.com",
        password: hashedPassword,
      }, // Freshman
      {
        uni_id: "UGR/11223/13",
        first_name: "Charlie",
        last_name: "Brown",
        email: "charlie.brown@example.com",
        password: hashedPassword,
      }, // Sophomore CS
      {
        uni_id: "UGR/44556/13",
        first_name: "David",
        last_name: "Davis",
        email: "david.davis@example.com",
        password: hashedPassword,
      }, // Sophomore CS
      {
        uni_id: "UGR/77889/13",
        first_name: "Eve",
        last_name: "White",
        email: "eve.white@example.com",
        password: hashedPassword,
      }, // Sophomore EE
    ];
    const students = [];
    for (const student of studentsData) {
      students.push(await prisma.student.create({ data: student }));
    }
    console.log(`Created ${students.length} students.`);

    // --- 7. Instructors ---
    const instructor1 = await prisma.instructor.create({
      data: {
        uni_id: "INS/I001/12",
        first_name: "Professor",
        last_name: "Xavier",
        email: "prof.xavier@example.com",
        password: hashedPassword,
      },
    });
    const instructor2 = await prisma.instructor.create({
      data: {
        uni_id: "INS/I002/12",
        first_name: "Dr.",
        last_name: "Strange",
        email: "dr.strange@example.com",
        password: hashedPassword,
      },
    });
    console.log(
      `Created instructors: ${instructor1.last_name}, ${instructor2.last_name}`
    );

    // --- 8. Admins ---
    const admin1 = await prisma.admin.create({
      data: {
        uni_id: "ADM/A001/12",
        first_name: "Admin",
        last_name: "One",
        email: "admin1@example.com",
        password: hashedPassword,
      },
    });
    const admin2 = await prisma.admin.create({
      data: {
        uni_id: "ADM/A002/12",
        first_name: "Admin",
        last_name: "Two",
        email: "admin2@example.com",
        password: hashedPassword,
      },
    });
    console.log(`Created admins: ${admin1.last_name}, ${admin2.last_name}`);

    // --- 9. Courses (3 courses) ---
    const course1 = await prisma.course.create({
      data: { code: "CS101", title: "Introduction to Programming", credits: 3 },
    });
    const course2 = await prisma.course.create({
      data: { code: "CS201", title: "Data Structures", credits: 4 },
    });
    const course3 = await prisma.course.create({
      data: { code: "EE201", title: "Circuit Analysis I", credits: 4 },
    });
    console.log(
      `Created courses: ${course1.code}, ${course2.code}, ${course3.code}`
    );

    // --- 10. Course Offerings ---
    // Offer CS101 in Freshman Section A, Fall 2024 by Instructor 1
    const offeringCS101Freshman = await prisma.courseOffering.create({
      data: {
        course_id: course1.id,
        semester_id: semester1.id,
        section_id: sectionFreshman.id,
        instructor_id: instructor1.id,
      },
    });
    // Offer CS201 in Sophomore CS Section B, Fall 2024 by Instructor 1
    const offeringCS201SophomoreCS = await prisma.courseOffering.create({
      data: {
        course_id: course2.id,
        semester_id: semester1.id,
        section_id: sectionSophomoreCS.id,
        instructor_id: instructor1.id,
      },
    });
    // Offer EE201 in Sophomore EE Section A, Fall 2024 by Instructor 2
    const offeringEE201SophomoreEE = await prisma.courseOffering.create({
      data: {
        course_id: course3.id,
        semester_id: semester1.id,
        section_id: sectionSophomoreEE.id,
        instructor_id: instructor2.id,
      },
    });
    console.log(`Created course offerings.`);

    // --- 11. Student–Section Enrollment (Distribute students) ---
    // Enroll students 1 and 2 in Freshman Section A for Fall 2024
    await prisma.enrollment.createMany({
      data: [
        {
          student_id: students[0].id,
          semester_id: semester1.id,
          section_id: sectionFreshman.id,
          is_active: true,
        },
        {
          student_id: students[1].id,
          semester_id: semester1.id,
          section_id: sectionFreshman.id,
          is_active: true,
        },
      ],
      skipDuplicates: true, // Skip if enrollment already exists
    });
    // Enroll students 3 and 4 in Sophomore CS Section B for Fall 2024
    await prisma.enrollment.createMany({
      data: [
        {
          student_id: students[2].id,
          semester_id: semester1.id,
          section_id: sectionSophomoreCS.id,
          is_active: true,
        },
        {
          student_id: students[3].id,
          semester_id: semester1.id,
          section_id: sectionSophomoreCS.id,
          is_active: true,
        },
      ],
      skipDuplicates: true,
    });
    // Enroll student 5 in Sophomore EE Section A for Fall 2024
    await prisma.enrollment.createMany({
      data: [
        {
          student_id: students[4].id,
          semester_id: semester1.id,
          section_id: sectionSophomoreEE.id,
          is_active: true,
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Enrolled students in sections.`);

    // --- 12. Attendance Sessions ---
    // Sessions for CS101 in Freshman Section A (offeringCS101Freshman)
    const session1_cs101 = await prisma.attendanceSession.create({
      data: {
        course_offering_id: offeringCS101Freshman.id,
        session_date: new Date("2024-09-10"),
        start_time: new Date("2024-09-10T10:00:00Z"), // Use ISO 8601 format for time
        end_time: new Date("2024-09-10T11:00:00Z"),
      },
    });
    const session2_cs101 = await prisma.attendanceSession.create({
      data: {
        course_offering_id: offeringCS101Freshman.id,
        session_date: new Date("2024-09-12"),
        start_time: new Date("2024-09-12T10:00:00Z"),
        end_time: new Date("2024-09-12T11:00:00Z"),
      },
    });
    // Sessions for CS201 in Sophomore CS Section B (offeringCS201SophomoreCS)
    const session1_cs201 = await prisma.attendanceSession.create({
      data: {
        course_offering_id: offeringCS201SophomoreCS.id,
        session_date: new Date("2024-09-10"),
        start_time: new Date("2024-09-10T14:00:00Z"),
        end_time: new Date("2024-09-10T15:30:00Z"),
      },
    });
    console.log(`Created attendance sessions.`);

    // --- 13. Attendance Records ---
    // Records for students 1 and 2 in CS101 sessions
    await prisma.attendanceRecord.createMany({
      data: [
        {
          session_id: session1_cs101.id,
          student_id: students[0].id,
          status: AttendanceStatus.PRESENT,
        }, // Alice present session 1
        {
          session_id: session1_cs101.id,
          student_id: students[1].id,
          status: AttendanceStatus.PRESENT,
        }, // Bob present session 1
        {
          session_id: session2_cs101.id,
          student_id: students[0].id,
          status: AttendanceStatus.PRESENT,
        }, // Alice present session 2
        {
          session_id: session2_cs101.id,
          student_id: students[1].id,
          status: AttendanceStatus.ABSENT,
        }, // Bob absent session 2
      ],
      skipDuplicates: true,
    });
    // Records for students 3 and 4 in CS201 sessions
    await prisma.attendanceRecord.createMany({
      data: [
        {
          session_id: session1_cs201.id,
          student_id: students[2].id,
          status: AttendanceStatus.PRESENT,
        }, // Charlie present session 1
        {
          session_id: session1_cs201.id,
          student_id: students[3].id,
          status: AttendanceStatus.LATE,
        }, // David late session 1
      ],
      skipDuplicates: true,
    });
    console.log(`Created attendance records.`);

    console.log("Seeding finished.");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
