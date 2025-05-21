import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const semesterId = searchParams.get("semesterId");

  // Build the where clause based on available filters
  const whereClause: any = {
    instructor_id: session.user.id,
  };

  if (semesterId) {
    whereClause.semester_id = parseInt(semesterId);
  }

  const courseOfferings = await prisma.courseOffering.findMany({
    where: whereClause,
    include: {
      course: true,
      semester: {
        include: {
          academicYear: true,
        },
      },
      section: true,
    },
  });

  const offeringsWithStats = await Promise.all(
    courseOfferings.map(async (offering) => {
      const totalStudents = await prisma.enrollment.count({
        where: {
          section_id: offering.section_id,
          semester_id: offering.semester_id,
        },
      });

      return {
        id: offering.id,
        course: {
          code: offering.course.code,
          title: offering.course.title,
          credits: offering.course.credits,
        },
        semester: {
          id: offering.semester.id,
          name: offering.semester.name,
          academic_year: offering.semester.academicYear.name,
          start_date: offering.semester.start_date,
          end_date: offering.semester.end_date,
        },
        section: {
          id: offering.section.id,
          label: offering.section.label,
          year_level: offering.section.year_level,
        },
        total_students: totalStudents,
      };
    })
  );

  return NextResponse.json(offeringsWithStats);
}
