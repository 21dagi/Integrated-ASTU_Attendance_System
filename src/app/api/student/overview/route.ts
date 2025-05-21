import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "student") {
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

    // Get student's enrolled courses for current semester
    const enrolledCourses = await prisma.enrollment.findMany({
      where: {
        student_id: session.user.id,
        semester_id: currentSemester.id,
        // is_active: true,
      },
      include: {
        section: {
          include: {
            courseOfferings: {
              include: {
                course: true,
                instructor: {
                  select: {
                    first_name: true,
                    last_name: true,
                    uni_id: true,
                  },
                },
                attendanceSessions: {
                  orderBy: {
                    session_date: "desc",
                  },
                  include: {
                    attendanceRecords: {
                      where: {
                        student_id: session.user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get upcoming sessions (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const upcomingSessions = await prisma.attendanceSession.findMany({
      where: {
        course_offering_id: {
          in: enrolledCourses.flatMap((enrollment) =>
            enrollment.section.courseOfferings.map((offering) => offering.id)
          ),
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
          },
        },
      },
      orderBy: {
        session_date: "asc",
      },
    });

    // Calculate attendance summary for each course
    const courseStats = enrolledCourses.flatMap((enrollment) =>
      enrollment.section.courseOfferings.map((offering) => {
        const totalSessions = offering.attendanceSessions.length;
        const presentCount = offering.attendanceSessions.reduce(
          (acc, session) =>
            acc +
            session.attendanceRecords.filter(
              (record) =>
                record.status === "PRESENT" || record.status === "LATE"
            ).length,
          0
        );

        return {
          course_id: offering.id,
          course_code: offering.course.code,
          course_title: offering.course.title,
          section: enrollment.section.label,
          instructor: offering.instructor
            ? `${offering.instructor.first_name} ${offering.instructor.last_name}`
            : "Not Assigned",
          total_sessions: totalSessions,
          attendance_rate:
            totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0,
          recent_status:
            offering.attendanceSessions[0]?.attendanceRecords[0]?.status ||
            "No Records",
        };
      })
    );

    // Get recent attendance activity
    const recentActivity = await prisma.attendanceRecord.findMany({
      where: {
        student_id: session.user.id,
        session: {
          course_offering_id: {
            in: enrolledCourses.flatMap((enrollment) =>
              enrollment.section.courseOfferings.map((offering) => offering.id)
            ),
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
        total_courses: courseStats.length,
        overall_attendance_rate:
          courseStats.length > 0
            ? courseStats.reduce(
                (acc, course) => acc + course.attendance_rate,
                0
              ) / courseStats.length
            : 0,
      },
      enrolled_courses: courseStats,
      upcoming_sessions: upcomingSessions.map((session) => ({
        id: session.id,
        date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
        course: session.courseOffering.course.title,
        section: session.courseOffering.section.label,
      })),
      recent_activity: recentActivity.map((activity) => ({
        course: activity.session.courseOffering.course.title,
        status: activity.status,
        date: activity.session.session_date,
        recorded_at: activity.recorded_at,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching student overview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch student overview data" },
      { status: 500 }
    );
  }
}
