import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const semesters = await prisma.semester.findMany({
    include: {
      academicYear: true,
    },
  });
  return NextResponse.json(semesters);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const createSemesterSchema = z.object({
    name: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    academicYear: z.number(),
  });
  try {
    const body = await request.json();
    const { name, startDate, endDate, academicYear } =
      createSemesterSchema.parse(body);
    const semester = await prisma.semester.create({
      data: {
        name,
        start_date: startDate,
        end_date: endDate,
        academic_year_id: academicYear,
      },
    });
    return NextResponse.json(semester);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
