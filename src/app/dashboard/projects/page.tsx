// src/app/dashboard/projects/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, getStatusColor } from "@/lib/utils";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) return null;

  const userId = session.user.id;
  const isLecturer = session.user.role === "LECTURER";

  const projects = await prisma.project.findMany({
    where: isLecturer
      ? { ownerId: userId }
      : { collaborations: { some: { userId } } },
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { name: true, email: true } },
      _count: {
        select: { documents: true, comments: true, collaborations: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isLecturer ? "Manage your research projects" : "Your assigned projects"}
          </p>
        </div>
        {isLecturer && (
          <Link href="/dashboard/projects/new" className="btn-primary">
            + New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-6xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {isLecturer
              ? "Create your first research project to get started."
              : "You haven't been added to any projects yet."}
          </p>
          {isLecturer && (
            <Link href="/dashboard/projects/new" className="btn-primary inline-block">
              Create First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {project.title}
                    </Link>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>👤 {project.owner.name}</span>
                    <span>📄 {project._count.documents} docs</span>
                    <span>💬 {project._count.comments} comments</span>
                    <span>👥 {project._count.collaborations} collaborators</span>
                    <span>📅 {formatDate(project.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="btn-secondary text-sm"
                  >
                    View
                  </Link>
                  {isLecturer && project.ownerId === userId && (
                    <Link
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="btn-secondary text-sm"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
