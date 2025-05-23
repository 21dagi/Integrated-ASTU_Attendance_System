import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
import { InstructorDashboardResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Get current active semester
    const currentSemester = await prisma.semester.findFirst({
      where: { is_active: true },
      include: {
        academicYear: true,
      },
    });

    if (!currentSemester) {
      return NextResponse.json(
        { error: "No active semester found" },
        { status: 404 }
      );
    }

    // Get instructor's course offerings for current semester
    const courseOfferings = await prisma.courseOffering.findMany({
      where: {
        instructor_id: session.user.id,
        semester_id: currentSemester.id,
      },
      include: {
        course: true,
        section: {
          include: {
            enrollments: true,
          },
        },
        attendanceSessions: {
          include: {
            attendanceRecords: true,
          },
        },
        instructor: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Calculate statistics for each course
    const courseStats = courseOfferings.map((offering) => {
      const totalSessions = offering.attendanceSessions.length;
      const totalStudents = offering.section.enrollments?.length || 0;

      const attendanceStats = offering.attendanceSessions.reduce(
        (acc, session) => {
          const present = session.attendanceRecords.filter(
            (record) => record.status === "PRESENT"
          ).length;
          const late = session.attendanceRecords.filter(
            (record) => record.status === "LATE"
          ).length;
          const absent = session.attendanceRecords.filter(
            (record) => record.status === "ABSENT"
          ).length;

          return {
            present: acc.present + present,
            late: acc.late + late,
            absent: acc.absent + absent,
          };
        },
        { present: 0, late: 0, absent: 0 }
      );

      const averageAttendance =
        totalSessions > 0
          ? ((attendanceStats.present + attendanceStats.late) /
              (totalSessions * totalStudents)) *
            100
          : 0;

      return {
        id: offering.id,
        course: {
          code: offering.course.code,
          title: offering.course.title,
        },
        section: offering.section.label,
        total_students: totalStudents,
        total_sessions: totalSessions,
        attendance_stats: {
          present: attendanceStats.present,
          late: attendanceStats.late,
          absent: attendanceStats.absent,
        },
        average_attendance: averageAttendance,
      };
    });

    // Get upcoming sessions (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const upcomingSessions = await prisma.attendanceSession.findMany({
      where: {
        course_offering_id: {
          in: courseOfferings.map((offering) => offering.id),
        },
        session_date: {
          gte: today,
          lte: nextWeek,
        },
      },
      include: {
        courseOffering: {
          include: {
            course: true,
            section: true,
            instructor: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        session_date: "asc",
      },
    });

    // Get recent attendance activity
    const recentActivity = await prisma.attendanceRecord.findMany({
      where: {
        session: {
          course_offering_id: {
            in: courseOfferings.map((offering) => offering.id),
          },
        },
      },
      include: {
        session: {
          include: {
            courseOffering: {
              include: {
                course: true,
              },
            },
          },
        },
        student: {
          select: {
            first_name: true,
            last_name: true,
            image: true,
            uni_id: true,
          },
        },
      },
      orderBy: {
        recorded_at: "desc",
      },
      take: 10,
    });

    const response = {
      overview: {
        current_semester: currentSemester.name,
        academic_year: currentSemester.academicYear.name,
        total_courses: courseOfferings.length,
        total_students: courseStats.reduce(
          (acc, course) => acc + course.total_students,
          0
        ),
        overall_attendance_rate:
          courseStats.length > 0
            ? courseStats.reduce(
                (acc, course) => acc + course.average_attendance,
                0
              ) / courseStats.length
            : 0,
      },
      courses: courseStats,
      upcoming_sessions: upcomingSessions.map((session) => ({
        course_code: session.courseOffering.course.code,
        course_title: session.courseOffering.course.title,
        session_date: session.session_date,
        start_time: session.start_time,
        instructor: session.courseOffering.instructor
          ? `${session.courseOffering.instructor.first_name} ${session.courseOffering.instructor.last_name}`
          : "Not Assigned",
      })),
      recent_activity: recentActivity.map((activity) => ({
        student: {
          name: `${activity.student.first_name} ${activity.student.last_name}`,
          uni_id: activity.student.uni_id,
          image: activity.student.image,
        },
        course: activity.session.courseOffering.course.title,
        status: activity.status,
        date: activity.session.session_date,
        recorded_at: activity.recorded_at,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching instructor overview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor overview data" },
      { status: 500 }
    );
  }
}
