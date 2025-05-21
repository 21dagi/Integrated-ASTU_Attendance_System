import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { z } from "zod";

const paramsSchema = z.object({
  offeringId: z.string().transform(Number),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { offeringId: string } }
) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Validate and parse the offering ID
    const { offeringId } = paramsSchema.parse(params);

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

    // Verify student is enrolled in this course offering
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        student_id: session.user.id,
        semester_id: currentSemester.id,
        section: {
          courseOfferings: {
            some: {
              id: offeringId,
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Get course offering details with attendance records
    const courseOffering = await prisma.courseOffering.findUnique({
      where: {
        id: offeringId,
      },
      include: {
        course: true,
        section: true,
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
    });

    if (!courseOffering) {
      return NextResponse.json(
        { error: "Course offering not found" },
        { status: 404 }
      );
    }

    // Calculate attendance statistics
    const totalSessions = courseOffering.attendanceSessions.length;
    const attendanceRecords = courseOffering.attendanceSessions.flatMap(
      (session) => session.attendanceRecords
    );
    const presentCount = attendanceRecords.filter(
      (record) => record.status === "PRESENT" || record.status === "LATE"
    ).length;
    const absentCount = attendanceRecords.filter(
      (record) => record.status === "ABSENT"
    ).length;
    const lateCount = attendanceRecords.filter(
      (record) => record.status === "LATE"
    ).length;

    const response = {
      course_details: {
        course_code: courseOffering.course.code,
        course_title: courseOffering.course.title,
        section: courseOffering.section.label,
        instructor: courseOffering.instructor
          ? `${courseOffering.instructor.first_name} ${courseOffering.instructor.last_name}`
          : "Not Assigned",
      },
      attendance_summary: {
        total_sessions: totalSessions,
        present_count: presentCount,
        absent_count: absentCount,
        late_count: lateCount,
        attendance_rate:
          totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0,
      },
      attendance_records: courseOffering.attendanceSessions.map((session) => ({
        session_id: session.id,
        date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
        status: session.attendanceRecords[0]?.status || "N/A",
        recorded_at: session.attendanceRecords[0]?.recorded_at || null,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid course offering ID" },
        { status: 400 }
      );
    }

    console.error("Error fetching student attendance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}
