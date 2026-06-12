// src/app/dashboard/projects/[id]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, getStatusColor } from "@/lib/utils";
import DocumentList from "@/components/documents/DocumentList";
import CommentSection from "@/components/comments/CommentSection";
import CollaboratorList from "@/components/projects/CollaboratorList";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) return null;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      collaborations: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      documents: { orderBy: { createdAt: "desc" } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  if (!project) notFound();

  const userId = session.user.id;
  const isOwner = project.ownerId === userId;
  const isCollaborator = project.collaborations.some((c) => c.userId === userId);
  const hasAccess = isOwner || isCollaborator;

  if (!hasAccess) notFound();

  const isLecturer = session.user.role === "LECTURER";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            ← Back to Projects
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Created by {project.owner.name} · {formatDate(project.createdAt)}
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="btn-secondary text-sm"
            >
              Edit
            </Link>
            <DeleteProjectButton projectId={project.id} />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="card p-6">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {project.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Documents */}
          <DocumentList
            documents={project.documents}
            projectId={project.id}
            canUpload={isOwner}
          />

          {/* Comments */}
          <CommentSection
            comments={project.comments}
            projectId={project.id}
            currentUserId={userId}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Collaborators */}
          <CollaboratorList
            collaborations={project.collaborations}
            owner={project.owner}
            projectId={project.id}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}
