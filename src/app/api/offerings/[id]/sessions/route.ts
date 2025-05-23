import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { formatDate, formatTime } from "@/lib/utils";
import { createSessionSchema } from "@/types/forms";

const paramsSchema = z.object({
  id: z.string().transform((val) => parseInt(val)),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate course offering ID
    const { id: offeringId } = paramsSchema.parse(params);

    // Get the current session
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { session_date, start_time, end_time } =
      createSessionSchema.parse(body);

    // Get the course offering with instructor details
    const courseOffering = await prisma.courseOffering.findUnique({
      where: { id: offeringId },
      include: {
        course: true,
        section: true,
        semester: true,
      },
    });

    if (!courseOffering) {
      return NextResponse.json(
        { error: "Course offering not found" },
        { status: 404 }
      );
    }

    // Verify if the instructor is authorized to create sessions
    if (
      session.user.role !== "admin" &&
      (session.user.role !== "instructor" ||
        courseOffering.instructor_id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate session date is within semester dates
    if (
      session_date < courseOffering.semester.start_date ||
      session_date > courseOffering.semester.end_date
    ) {
      return NextResponse.json(
        {
          error: "Session date must be within the semester dates",
          semester_start: formatDate(courseOffering.semester.start_date),
          semester_end: formatDate(courseOffering.semester.end_date),
        },
        { status: 400 }
      );
    }

    // Create the attendance session
    const attendanceSession = await prisma.attendanceSession.create({
      data: {
        course_offering_id: offeringId,
        session_date,
        start_time,
        end_time,
      },
      include: {
        courseOffering: {
          include: {
            course: true,
            section: true,
            semester: true,
          },
        },
      },
    });

    // Format the response
    const response = {
      id: attendanceSession.id,
      session_date: formatDate(attendanceSession.session_date),
      start_time: formatTime(attendanceSession.start_time),
      end_time: formatTime(attendanceSession.end_time),
      course_info: {
        code: attendanceSession.courseOffering.course.code,
        title: attendanceSession.courseOffering.course.title,
      },
      section: attendanceSession.courseOffering.section.label,
      semester: attendanceSession.courseOffering.semester.name,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating attendance session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate course offering ID
    const { id: offeringId } = paramsSchema.parse(params);

    // Get the current session
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the course offering
    const courseOffering = await prisma.courseOffering.findUnique({
      where: { id: offeringId },
      include: {
        course: true,
        section: true,
        semester: true,
      },
    });

    if (!courseOffering) {
      return NextResponse.json(
        { error: "Course offering not found" },
        { status: 404 }
      );
    }

    // Verify if the instructor is authorized to view sessions
    if (
      session.user.role !== "admin" &&
      (session.user.role !== "instructor" ||
        courseOffering.instructor_id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all sessions for this course offering
    const sessions = await prisma.attendanceSession.findMany({
      where: { course_offering_id: offeringId },
      orderBy: { session_date: "desc" },
      include: {
        attendanceRecords: true,
      },
    });

    // Format the response
    const response = {
      course_info: {
        code: courseOffering.course.code,
        title: courseOffering.course.title,
      },
      section: courseOffering.section.label,
      semester: courseOffering.semester.name,
      sessions: sessions.map((session) => ({
        id: session.id,
        session_date: formatDate(session.session_date),
        start_time: formatTime(session.start_time),
        end_time: formatTime(session.end_time),
        attendance_stats: {
          total: session.attendanceRecords.length,
          present: session.attendanceRecords.filter(
            (record) => record.status === "PRESENT"
          ).length,
          absent: session.attendanceRecords.filter(
            (record) => record.status === "ABSENT"
          ).length,
          late: session.attendanceRecords.filter(
            (record) => record.status === "LATE"
          ).length,
        },
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

    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
