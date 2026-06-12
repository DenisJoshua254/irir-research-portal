// src/app/dashboard/projects/[id]/edit/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id },
  });
  if (!project || project.ownerId !== session.user.id) notFound();

  return (
    <div className="max-w-2xl">
      <EditProjectForm project={project} />
    </div>
  );
}
