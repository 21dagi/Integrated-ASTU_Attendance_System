import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { formatTime } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    // Get student's enrollments with detailed course information
    const enrollments = await prisma.enrollment.findMany({
      where: {
        student_id: session.user.id,
        semester_id: currentSemester.id,
      },
      include: {
        section: {
          include: {
            courseOfferings: {
              include: {
                course: true,
                instructor: {
                  select: {
                    first_name: true,
                    last_name: true,
                    uni_id: true,
                    image: true,
                  },
                },
                attendanceSessions: {
                  orderBy: {
                    session_date: "desc",
                  },
                  include: {
                    attendanceRecords: {
                      where: {
                        student_id: session.user.id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        section: {
          label: "asc",
        },
      },
    });

    // Transform the data into a more structured format
    const formattedEnrollments = enrollments.map((enrollment) => {
      const courseOfferings = enrollment.section.courseOfferings.map(
        (offering) => {
          const totalSessions = offering.attendanceSessions.length;
          const attendanceRecords = offering.attendanceSessions.flatMap(
            (session) => session.attendanceRecords
          );
          const presentCount = attendanceRecords.filter(
            (record) => record.status === "PRESENT" || record.status === "LATE"
          ).length;

          return {
            offering_id: offering.id,
            course: {
              code: offering.course.code,
              title: offering.course.title,
              credits: offering.course.credits,
            },
            instructor: offering.instructor
              ? {
                  name: `${offering.instructor.first_name} ${offering.instructor.last_name}`,
                  uni_id: offering.instructor.uni_id,
                  image: offering.instructor.image,
                }
              : null,
            attendance: {
              total_sessions: totalSessions,
              present_count: presentCount,
              attendance_rate:
                totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0,
              last_session: offering.attendanceSessions[0]
                ? {
                    date: offering.attendanceSessions[0].session_date,
                    start_time: formatTime(
                      offering.attendanceSessions[0].start_time
                    ),
                    end_time: formatTime(
                      offering.attendanceSessions[0].end_time
                    ),
                    status:
                      offering.attendanceSessions[0].attendanceRecords[0]
                        ?.status || "No Record",
                  }
                : null,
            },
          };
        }
      );

      return {
        enrollment_id: enrollment.student_id,
        section: {
          id: enrollment.section.id,
          label: enrollment.section.label,
          year_level: enrollment.section.year_level,
        },
        is_active: enrollment.is_active,
        courses: courseOfferings,
      };
    });

    const response = {
      current_semester: {
        name: currentSemester.name,
        academic_year: currentSemester.academicYear.name,
        start_date: currentSemester.start_date,
        end_date: currentSemester.end_date,
      },
      enrollments: formattedEnrollments,
      summary: {
        total_sections: enrollments.length,
        total_courses: enrollments.reduce(
          (acc, enrollment) => acc + enrollment.section.courseOfferings.length,
          0
        ),
        active_enrollments: enrollments.filter(
          (enrollment) => enrollment.is_active
        ).length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching student enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollment data" },
      { status: 500 }
    );
  }
}
