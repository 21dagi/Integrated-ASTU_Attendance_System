import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const users = await prisma.student.findMany({
    omit: {
      password: true,
    },
    include: {
      enrollments: {
        include: {
          section: true,
        },
      },
      attendanceRecords: {
        include: {
          session: true,
        },
      },
    },
  });

  return NextResponse.json(users);
}
