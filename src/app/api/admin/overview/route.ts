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

  try {
    // Get current active semester
    const currentSemester = await prisma.semester.findFirst({
      where: { is_active: true },
      include: {
        academicYear: true,
      },
    });

    if (!currentSemester) {
      return NextResponse.json(
        { error: "No active semester found" },
        { status: 404 }
      );
    }

    // Get total students
    const totalStudents = await prisma.student.count();

    // Get total instructors
    const totalInstructors = await prisma.instructor.count();

    // Get department distribution by counting students in each department
    const departmentDistribution = await prisma.department.findMany({
      select: {
        name: true,
        sections: {
          select: {
            enrollments: {
              where: {
                semester_id: currentSemester.id,
                is_active: true,
              },
              select: {
                student_id: true,
              },
            },
          },
        },
      },
    });

    // Get monthly enrollments for current semester
    // const monthlyEnrollments = await prisma.enrollment.findMany({
    //   where: {
    //     semester_id: currentSemester.id,
    //   },
    //   select: {
    //     student_id: true,
    //     semester_id: true,
    //     section_id: true,
    //     is_active: true,
    //   },
    // });

    // Get attendance statistics
    const attendanceStats = await prisma.attendanceRecord.groupBy({
      by: ["status"],
      _count: true,
    });

    // Get course offering statistics
    const courseOfferings = await prisma.courseOffering.count({
      where: {
        semester_id: currentSemester.id,
      },
    });

    // Get total sections
    const totalSections = await prisma.section.count({
      where: {
        semester_id: currentSemester.id,
      },
    });

    // Get gender distribution
    const genderDistribution = await prisma.student.groupBy({
      by: ["gender"],
      _count: true,
    });

    const response = {
      overview: {
        total_students: totalStudents,
        total_instructors: totalInstructors,
        active_classes: courseOfferings,
        current_semester: {
          name: currentSemester.name,
          academic_year: currentSemester.academicYear.name,
          total_course_offerings: courseOfferings,
          total_sections: totalSections,
        },
      },
      department_distribution: departmentDistribution.map((dept) => {
        // Count unique students across all sections in this department
        const studentIds = new Set();
        dept.sections.forEach((section) => {
          section.enrollments.forEach((enrollment) => {
            studentIds.add(enrollment.student_id);
          });
        });
        return {
          name: dept.name,
          count: studentIds.size,
        };
      }),
      attendance_statistics: {
        present:
          attendanceStats.find((stat) => stat.status === "PRESENT")?._count ||
          0,
        absent:
          attendanceStats.find((stat) => stat.status === "ABSENT")?._count || 0,
        late:
          attendanceStats.find((stat) => stat.status === "LATE")?._count || 0,
      },
      gender_distribution: genderDistribution.map((gender) => ({
        gender: gender.gender,
        count: gender._count,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}
