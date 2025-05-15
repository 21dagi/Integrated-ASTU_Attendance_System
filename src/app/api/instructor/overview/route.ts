import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "instructor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get current active semester
    const currentSemester = await prisma.semester.findFirst({
      where: { is_active: true },
    });

    if (!currentSemester) {
      return NextResponse.json(
        { error: "No active semester found" },
        { status: 404 }
      );
    }

    // Get instructor's courses for current semester
    const courses = await prisma.courseOffering.findMany({
      where: {
        instructor_id: session.user.id,
        semester_id: currentSemester.id,
      },
      include: {
        course: true,
        section: true,
        attendanceSessions: {
          orderBy: {
            session_date: "desc",
          },
          take: 5,
          include: {
            attendanceRecords: true,
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
          in: courses.map((course) => course.id),
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

    // Calculate attendance statistics for each course
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const totalSessions = course.attendanceSessions.length;
        const totalAttendance = course.attendanceSessions.reduce(
          (acc, session) => acc + session.attendanceRecords.length,
          0
        );
        const presentCount = course.attendanceSessions.reduce(
          (acc, session) =>
            acc +
            session.attendanceRecords.filter(
              (record) =>
                record.status === "PRESENT" || record.status === "LATE"
            ).length,
          0
        );

        return {
          course_id: course.id,
          course_code: course.course.code,
          course_title: course.course.title,
          section: course.section.label,
          total_sessions: totalSessions,
          total_students: totalAttendance,
          attendance_rate:
            totalSessions > 0 ? (presentCount / totalAttendance) * 100 : 0,
        };
      })
    );

    // Get recent attendance activity
    const recentActivity = await prisma.attendanceRecord.findMany({
      where: {
        session: {
          course_offering_id: {
            in: courses.map((course) => course.id),
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
        total_courses: courses.length,
        total_sessions: courses.reduce(
          (acc, course) => acc + course.attendanceSessions.length,
          0
        ),
        current_semester: currentSemester.name,
      },
      courses: courseStats,
      upcoming_sessions: upcomingSessions.map((session) => ({
        id: session.id,
        date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
        course: session.courseOffering.course.title,
        section: session.courseOffering.section.label,
      })),
      recent_activity: recentActivity.map((activity) => ({
        student_name: `${activity.student.first_name} ${activity.student.last_name}`,
        student_id: activity.student.uni_id,
        course: activity.session.courseOffering.course.title,
        status: activity.status,
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
