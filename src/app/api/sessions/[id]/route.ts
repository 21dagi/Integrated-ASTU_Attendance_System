import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { formatDate, formatTime } from "@/lib/utils";

const paramsSchema = z.object({
  id: z.string().transform((val) => parseInt(val)),
});

const updateSessionSchema = z.object({
  session_date: z.string().transform((val) => new Date(val)),
  start_time: z.string().transform((val) => new Date(val)),
  end_time: z.string().transform((val) => new Date(val)),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session ID
    const { id: sessionId } = paramsSchema.parse(params);

    // Get the current session
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { session_date, start_time, end_time } =
      updateSessionSchema.parse(body);

    // Get the attendance session with course offering details
    const attendanceSession = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
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

    if (!attendanceSession) {
      return NextResponse.json(
        { error: "Attendance session not found" },
        { status: 404 }
      );
    }

    // Verify if the instructor is authorized to update sessions
    if (
      session.user.role !== "admin" &&
      (session.user.role !== "instructor" ||
        attendanceSession.courseOffering.instructor_id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate session date is within semester dates
    if (
      session_date < attendanceSession.courseOffering.semester.start_date ||
      session_date > attendanceSession.courseOffering.semester.end_date
    ) {
      return NextResponse.json(
        {
          error: "Session date must be within the semester dates",
          semester_start: formatDate(
            attendanceSession.courseOffering.semester.start_date
          ),
          semester_end: formatDate(
            attendanceSession.courseOffering.semester.end_date
          ),
        },
        { status: 400 }
      );
    }

    // Update the attendance session
    const updatedSession = await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: {
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
      id: updatedSession.id,
      session_date: formatDate(updatedSession.session_date),
      start_time: formatTime(updatedSession.start_time),
      end_time: formatTime(updatedSession.end_time),
      course_info: {
        code: updatedSession.courseOffering.course.code,
        title: updatedSession.courseOffering.course.title,
      },
      section: updatedSession.courseOffering.section.label,
      semester: updatedSession.courseOffering.semester.name,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating attendance session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session ID
    const { id: sessionId } = paramsSchema.parse(params);

    // Get the current session
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the attendance session with course offering details
    const attendanceSession = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        courseOffering: true,
      },
    });

    if (!attendanceSession) {
      return NextResponse.json(
        { error: "Attendance session not found" },
        { status: 404 }
      );
    }

    // Verify if the instructor is authorized to delete sessions
    if (
      session.user.role !== "admin" &&
      (session.user.role !== "instructor" ||
        attendanceSession.courseOffering.instructor_id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the attendance session and its records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete attendance records first (due to foreign key constraint)
      await tx.attendanceRecord.deleteMany({
        where: { session_id: sessionId },
      });

      // Delete the session
      await tx.attendanceSession.delete({
        where: { id: sessionId },
      });
    });

    return NextResponse.json(
      { message: "Attendance session deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    console.error("Error deleting attendance session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
