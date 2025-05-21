import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const course = await prisma.course.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  return NextResponse.json(course);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updateCourseSchema = z.object({
    code: z.string().min(3),
    title: z.string().min(4),
    credits: z.number().min(1),
  });
  try {
    const body = await request.json();
    const { code, title, credits } = updateCourseSchema.parse(body);
    const course = await prisma.course.update({
      where: {
        id: parseInt(params.id),
      },
      data: { code, title, credits },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
