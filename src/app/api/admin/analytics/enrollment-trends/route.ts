import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { z } from "zod";

// Query schema validation
const enrollmentTrendsSchema = z.object({
  timeframe: z
    .enum(["semester", "academic_year"])
    .optional()
    .default("semester"),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

interface EnrollmentTrendData {
  period: string;
  period_id: number;
  total_enrollments: number;
  active_enrollments: number;
  start_date: string;
  end_date: string;
}

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = enrollmentTrendsSchema.safeParse({
      timeframe: searchParams.get("timeframe"),
      limit: searchParams.get("limit"),
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: queryValidation.error.errors,
        },
        { status: 400 }
      );
    }

    const { timeframe, limit } = queryValidation.data;

    let enrollmentData: EnrollmentTrendData[] = [];

    if (timeframe === "semester") {
      // Get enrollment trends by semester
      const semesterData = await prisma.semester.findMany({
        include: {
          academicYear: true,
          enrollments: {
            select: {
              is_active: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        orderBy: {
          start_date: "desc",
        },
        take: limit,
      });

      enrollmentData = semesterData.map((semester) => ({
        period: `${semester.name} (${semester.academicYear.name})`,
        period_id: semester.id,
        total_enrollments: semester._count.enrollments,
        active_enrollments: semester.enrollments.filter((e) => e.is_active)
          .length,
        start_date: semester.start_date.toISOString().split("T")[0],
        end_date: semester.end_date.toISOString().split("T")[0],
      }));
    } else {
      // Get enrollment trends by academic year
      const academicYearData = await prisma.academicYear.findMany({
        include: {
          semesters: {
            include: {
              enrollments: {
                select: {
                  is_active: true,
                },
              },
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
        },
        orderBy: {
          start_date: "desc",
        },
        take: limit,
      });

      enrollmentData = academicYearData.map((academicYear) => {
        const totalEnrollments = academicYear.semesters.reduce(
          (sum, semester) => sum + semester._count.enrollments,
          0
        );
        const activeEnrollments = academicYear.semesters.reduce(
          (sum, semester) =>
            sum + semester.enrollments.filter((e) => e.is_active).length,
          0
        );

        return {
          period: academicYear.name,
          period_id: academicYear.id,
          total_enrollments: totalEnrollments,
          active_enrollments: activeEnrollments,
          start_date: academicYear.start_date.toISOString().split("T")[0],
          end_date: academicYear.end_date.toISOString().split("T")[0],
        };
      });
    }

    // Calculate additional metrics
    const totalPeriods = enrollmentData.length;
    const avgEnrollments =
      totalPeriods > 0
        ? Math.round(
            enrollmentData.reduce(
              (sum, period) => sum + period.total_enrollments,
              0
            ) / totalPeriods
          )
        : 0;

    // Calculate growth rate (if we have at least 2 periods)
    let growthRate = 0;
    if (enrollmentData.length >= 2) {
      const latest = enrollmentData[0].total_enrollments;
      const previous = enrollmentData[1].total_enrollments;
      growthRate = previous > 0 ? ((latest - previous) / previous) * 100 : 0;
    }

    const response = {
      timeframe,
      data: enrollmentData.reverse(), // Reverse to show chronological order
      summary: {
        total_periods: totalPeriods,
        average_enrollments_per_period: avgEnrollments,
        latest_period_enrollments: enrollmentData[0]?.total_enrollments || 0,
        growth_rate_percentage: Math.round(growthRate * 100) / 100,
      },
      meta: {
        generated_at: new Date().toISOString(),
        limit_applied: limit,
        data_points: enrollmentData.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching enrollment trends:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch enrollment trends",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
