import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating the offering ID parameter
const paramsSchema = z.object({
  id: z.string().transform((val) => parseInt(val)),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the offering ID
    const { id: offeringId } = paramsSchema.parse(params);

    // Get all sessions for this offering
    const sessions = await prisma.attendanceSession.findMany({
      where: {
        course_offering_id: offeringId,
      },
      orderBy: {
        session_date: "asc",
      },
      select: {
        id: true,
        session_date: true,
        course_offering_id: true,
      },
    });

    // Get all students enrolled in this offering's section
    const offering = await prisma.courseOffering.findUnique({
      where: { id: offeringId },
      select: {
        section_id: true,
        semester_id: true,
      },
    });

    if (!offering) {
      return NextResponse.json(
        { error: "Course offering not found" },
        { status: 404 }
      );
    }

    // Get all enrolled students
    const enrollments = await prisma.enrollment.findMany({
      where: {
        section_id: offering.section_id,
        semester_id: offering.semester_id,
      },
      select: {
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            uni_id: true,
            image: true,
          },
        },
      },
    });

    // Get all attendance records for these sessions
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        session_id: {
          in: sessions.map((session) => session.id),
        },
      },
      select: {
        session_id: true,
        student_id: true,
        status: true,
      },
    });

    // Create a map of attendance records for quick lookup
    const attendanceMap = new Map();
    attendanceRecords.forEach((record) => {
      const key = `${record.session_id}-${record.student_id}`;
      attendanceMap.set(key, record.status);
    });

    // Format the response
    const formattedStudents = enrollments.map((enrollment) => {
      const student = enrollment.student;
      const sessionAttendance: Record<string, string> = {};
      let presentCount = 0;
      let lateCount = 0;
      let totalSessions = sessions.length;

      // Create attendance record for each session
      sessions.forEach((session) => {
        const key = `${session.id}-${student.id}`;
        const status = attendanceMap.get(key) || "ABSENT";
        sessionAttendance[session.id] = status;

        // Count attendance for percentage calculation
        if (status === "PRESENT") presentCount++;
        if (status === "LATE") lateCount++;
      });

      // Calculate attendance percentage
      const attendancePercentage =
        totalSessions > 0
          ? Math.round(((presentCount + lateCount) / totalSessions) * 100)
          : 0;

      return {
        id: student.id,
        uni_id: student.uni_id,
        first_name: student.first_name,
        last_name: student.last_name,
        image: student.image,
        sessions: sessionAttendance,
        attendance_stats: {
          percentage: attendancePercentage,
          present: presentCount,
          late: lateCount,
          absent: totalSessions - (presentCount + lateCount),
          total_sessions: totalSessions,
        },
      };
    });

    // Format sessions data
    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      date: session.session_date,
      offering_id: session.course_offering_id,
    }));

    return NextResponse.json({
      students: formattedStudents,
      sessions: formattedSessions,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid offering ID" },
        { status: 400 }
      );
    }
    console.error("Error fetching attendance data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
