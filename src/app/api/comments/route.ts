// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const commentSchema = z.object({
  message: z.string().min(1, "Comment cannot be empty").max(1000),
  projectId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  // Check user has access to the project
  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    include: { collaborations: { where: { userId: session.user.id } } },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const hasAccess =
    project.ownerId === session.user.id || project.collaborations.length > 0;

  if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const comment = await prisma.comment.create({
    data: {
      message: parsed.data.message,
      userId: session.user.id,
      projectId: parsed.data.projectId,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
