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
  const courses = await prisma.course.findMany({
    //couunt offerings
    include: {
      _count: {
        select: {
          courseOfferings: true,
        },
      },
    },
  });
  const response = courses.map((course) => {
    const { _count, ...rest } = course;
    return {
      ...rest,
      courses: _count.courseOfferings,
    };
  });
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const createCourseSchema = z.object({
    code: z.string().min(3),
    title: z.string().min(4),
    credits: z.number().min(1),
  });
  try {
    const body = await request.json();
    const { code, title, credits } = createCourseSchema.parse(body);
    const course = await prisma.course.create({
      data: {
        code,
        title,
        credits,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
