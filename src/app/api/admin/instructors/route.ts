import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { GenderType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import * as bcrypt from "bcrypt";
export async function GET(request: NextRequest) {
  //get sessiion
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const instructors = await prisma.instructor.findMany({
    omit: {
      password: true,
    },
    include: {
      _count: {
        select: {
          courseOfferings: true,
        },
      },
    },
  });
  const formattedInstructors = instructors.map((instructor) => {
    const { _count, ...rest } = instructor;
    return {
      ...rest,
      courses: _count.courseOfferings,
    };
  });

  return NextResponse.json(formattedInstructors);
}
export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //validate using zod
  const instructorScheme = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    gender: z.nativeEnum(GenderType),
    image: z.string().optional(),
  });

  const requestData = await request.json();
  const validatedFields = instructorScheme.safeParse(requestData);
  if (!validatedFields.success) {
    return NextResponse.json({ error: validatedFields.error }, { status: 400 });
  }
  const result = await prisma.instructor.create({
    data: {
      ...validatedFields.data,
      password: await bcrypt.hash("password123", 10),
      uni_id: `INS/${Date.now()}/14`,
    },
  });

  return NextResponse.json(result);
}
