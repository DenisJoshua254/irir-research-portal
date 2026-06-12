// src/app/api/projects/[id]/collaborators/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.id === session.user.id)
    return NextResponse.json({ error: "Cannot invite yourself" }, { status: 400 });

  const existing = await prisma.collaboration.findUnique({
    where: { userId_projectId: { userId: user.id, projectId: id } },
  });

  if (existing)
    return NextResponse.json({ error: "User is already a collaborator" }, { status: 400 });

  const collab = await prisma.collaboration.create({
    data: { userId: user.id, projectId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(collab, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json();

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.collaboration.deleteMany({
    where: { userId, projectId: id },
  });

  return NextResponse.json({ message: "Collaborator removed" });
}