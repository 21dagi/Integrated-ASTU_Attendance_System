import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const offerings = await prisma.courseOffering.findMany({
    select: {
      id: true,
      section: {
        select: {
          id: true,
          year_level: true,
          semester_id: true,
          department: {
            select: {
              name: true, // Fetch department name
            },
          },
        },
      },
      semester: true,
      course: true,
      instructor: {
        omit: {
          password: true,
        },
      },
    },
  });
  //calculate total students enrolled in each offering
  const resp = await Promise.all(
    offerings.map(async (offering) => {
      const totalStudents = await prisma.enrollment.count({
        where: {
          section_id: offering.section.id,
        },
      });
      //also add total sessions and average attendance
      const sessions = await prisma.attendanceSession.findMany({
        where: {
          course_offering_id: offering.id,
        },
      });
      const totalAttendance = await prisma.attendanceRecord.findMany({
        where: {
          session_id: {
            in: sessions.map((session) => session.id),
          },
        },
      });
      const presenceCount = totalAttendance.filter(
        (attendance) =>
          attendance.status === "PRESENT" || attendance.status === "LATE"
      ).length;

      const averageAttendance = (presenceCount / totalAttendance.length) * 100;

      //for session calculate total students present,absent,late group by status
      const sessionsWithStats = await Promise.all(
        sessions.map(async (session) => {
          const sessionAttendance = await prisma.attendanceRecord.groupBy({
            where: {
              session_id: session.id,
            },
            by: ["status"],
            _count: true,
          });
          return {
            ...session,
            present:
              sessionAttendance.find(
                (attendance) => attendance.status === "PRESENT"
              )?._count || 0,
            absent:
              sessionAttendance.find(
                (attendance) => attendance.status === "ABSENT"
              )?._count || 0,
            late:
              sessionAttendance.find(
                (attendance) => attendance.status === "LATE"
              )?._count || 0,
          };
        })
      );

      return {
        ...offering,
        totalStudents,
        sessions: sessionsWithStats,
        averageAttendance,
      };
    })
  );

  return NextResponse.json(resp);
}
