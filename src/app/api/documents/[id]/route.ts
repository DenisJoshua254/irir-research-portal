// src/app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: { project: { select: { ownerId: true } } },
  });

  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (document.project.ownerId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.document.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Document deleted" });
}
