import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { z } from "zod";

// Schema for validating the session ID parameter
const paramsSchema = z.object({
  id: z.string().transform((val) => parseInt(val)),
});

// Schema for validating the request body
const attendanceRecordSchema = z.object({
  student_id: z.number(),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
});

const requestSchema = z.array(attendanceRecordSchema);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate session ID
    const { id: sessionId } = paramsSchema.parse(params);

    // Get the current session
    const session = await getServerSession(authConfig);
    console.log(session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const attendanceRecords = requestSchema.parse(body);

    // Get the attendance session with course offering details
    const attendanceSession = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        courseOffering: {
          include: {
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

    // Verify if the instructor is authorized to take attendance
    if (
      session.user.role !== "admin" &&
      (session.user.role !== "instructor" ||
        attendanceSession.courseOffering.instructor_id !== session.user.id)
    ) {
      console.log(
        session.user.role,
        attendanceSession.courseOffering.instructor_id,
        session.user.id
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all enrolled students for this section and semester
    const enrolledStudents = await prisma.enrollment.findMany({
      where: {
        section_id: attendanceSession.courseOffering.section_id,
        semester_id: attendanceSession.courseOffering.semester_id,
      },
      select: {
        student_id: true,
      },
    });

    const enrolledStudentIds = new Set(
      enrolledStudents.map((e) => e.student_id)
    );

    // Validate that all students in the request are enrolled
    const invalidStudents = attendanceRecords.filter(
      (record) => !enrolledStudentIds.has(record.student_id)
    );

    if (invalidStudents.length > 0) {
      return NextResponse.json(
        {
          error: "Some students are not enrolled in this class",
          invalidStudents: invalidStudents.map((s) => s.student_id),
        },
        { status: 400 }
      );
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing attendance records for this session
      await tx.attendanceRecord.deleteMany({
        where: { session_id: sessionId },
      });

      // Create new attendance records
      const createdRecords = await tx.attendanceRecord.createMany({
        data: attendanceRecords.map((record) => ({
          session_id: sessionId,
          student_id: record.student_id,
          status: record.status,
        })),
      });

      return createdRecords;
    });

    return NextResponse.json({
      message: "Attendance records updated successfully",
      count: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating attendance records:", error);
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

    // Verify if the instructor is authorized to view attendance
    if (
      session.user.role !== "admin" &&
      (session.user.role !== "instructor" ||
        attendanceSession.courseOffering.instructor_id !== session.user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all enrolled students for this section and semester
    const enrolledStudents = await prisma.enrollment.findMany({
      where: {
        section_id: attendanceSession.courseOffering.section_id,
        semester_id: attendanceSession.courseOffering.semester_id,
      },
      include: {
        student: {
          select: {
            id: true,
            uni_id: true,
            first_name: true,
            last_name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    // Get existing attendance records for this session
    const existingRecords = await prisma.attendanceRecord.findMany({
      where: { session_id: sessionId },
      select: {
        student_id: true,
        status: true,
      },
    });

    // Create a map of existing attendance records
    const attendanceMap = new Map(
      existingRecords.map((record) => [record.student_id, record.status])
    );

    // Format the response
    const response = {
      session_id: attendanceSession.id,
      session_date: attendanceSession.session_date,
      start_time: attendanceSession.start_time,
      end_time: attendanceSession.end_time,
      course_info: {
        code: attendanceSession.courseOffering.course.code,
        title: attendanceSession.courseOffering.course.title,
      },
      section: attendanceSession.courseOffering.section.label,
      semester: attendanceSession.courseOffering.semester.name,
      attendance_records: enrolledStudents.map((enrollment) => ({
        student: enrollment.student,
        status: attendanceMap.get(enrollment.student.id) || null,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
