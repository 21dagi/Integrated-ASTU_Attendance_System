import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";
import { getServerSession } from "next-auth";
// Define the filter schema
const filterSchema = z.object({
  departmentId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  academicYearId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
});

export async function GET(request: NextRequest) {
  try {
    // Get and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = filterSchema.parse({
      departmentId: searchParams.get("departmentId"),
      academicYearId: searchParams.get("academicYearId"),
    });

    // Build the where clause
    const whereClause: any = {
      enrollments: {
        some: {
          is_active: true,
        },
      },
    };

    if (filters.departmentId) {
      whereClause.enrollments.some.section = {
        department_id: filters.departmentId,
      };
    }

    if (filters.academicYearId) {
      whereClause.enrollments.some.semester = {
        academic_year_id: filters.academicYearId,
      };
    }

    // Fetch students with their active enrollment
    const students = await prisma.student.findMany({
      where: whereClause,
      omit: {
        password: true,
      },
      include: {
        enrollments: {
          where: {
            is_active: true,
          },
          take: 1, // Only get one active enrollment
          include: {
            section: {
              include: {
                department: true,
              },
            },
          },
        },
      },
    });

    // Transform the response to match the requested structure
    const transformedStudents = students.map((student) => {
      const activeEnrollment = student.enrollments[0] || null;
      const { enrollments, ...studentWithoutEnrollments } = student;

      return {
        ...studentWithoutEnrollments,
        section: activeEnrollment?.section || null,
        department: activeEnrollment?.section?.department || null,
      };
    });

    return NextResponse.json(transformedStudents);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid filter parameters", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
