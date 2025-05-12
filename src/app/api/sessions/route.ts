import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const searchParams = request.nextUrl.searchParams;
  const courseOfferingId = searchParams.get("courseOfferingId");

  // Build the where clause based on available filters
  const whereClause: any = {};
  if (courseOfferingId) {
    whereClause.course_offering_id = parseInt(courseOfferingId);
  }

  const sessions = await prisma.attendanceSession.findMany({
    where: whereClause,
    include: {
      attendanceRecords: true,
      courseOffering: {
        include: {
          course: true,
          section: true,
          semester: true,
        },
      },
    },
    orderBy: {
      session_date: "desc",
    },
  });

  const sessionsWithStats = await Promise.all(
    sessions.map(async (session) => {
      const totalRecords = session.attendanceRecords.length;
      const presentCount = session.attendanceRecords.filter(
        (record) => record.status === "PRESENT"
      ).length;
      const absentCount = session.attendanceRecords.filter(
        (record) => record.status === "ABSENT"
      ).length;
      const lateCount = session.attendanceRecords.filter(
        (record) => record.status === "LATE"
      ).length;

      const attendanceRate =
        totalRecords > 0
          ? ((presentCount + lateCount) / totalRecords) * 100
          : 0;

      return {
        id: session.id,
        session_date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
        attendance_rate: Math.round(attendanceRate * 100) / 100, // Round to 2 decimal places
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        course: {
          code: session.courseOffering.course.code,
          title: session.courseOffering.course.title,
        },
        section: session.courseOffering.section.label,
        semester: session.courseOffering.semester.name,
      };
    })
  );

  return NextResponse.json(sessionsWithStats);
}
