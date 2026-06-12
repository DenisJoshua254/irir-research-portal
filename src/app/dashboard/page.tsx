// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const userId = session.user.id;
  const isLecturer = session.user.role === "LECTURER";

  // Stats
  const [totalProjects, myProjects, recentDocuments] = await Promise.all([
    prisma.project.count(),
    isLecturer
      ? prisma.project.count({ where: { ownerId: userId } })
      : prisma.collaboration.count({ where: { userId } }),
    prisma.document.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { project: { select: { title: true } } },
    }),
  ]);

  const recentProjects = await prisma.project.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    where: isLecturer
      ? { ownerId: userId }
      : { collaborations: { some: { userId } } },
    include: {
      owner: { select: { name: true } },
      _count: { select: { documents: true, comments: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s an overview of your research portal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Projects",
            value: totalProjects,
            icon: "🗂️",
            color: "bg-blue-50 dark:bg-blue-900/20",
            textColor: "text-blue-600 dark:text-blue-400",
          },
          {
            label: isLecturer ? "My Projects" : "Assigned Projects",
            value: myProjects,
            icon: "📋",
            color: "bg-green-50 dark:bg-green-900/20",
            textColor: "text-green-600 dark:text-green-400",
          },
          {
            label: "Recent Documents",
            value: recentDocuments.length,
            icon: "📄",
            color: "bg-purple-50 dark:bg-purple-900/20",
            textColor: "text-purple-600 dark:text-purple-400",
          },
        ].map((stat) => (
          <div key={stat.label} className={`card p-6 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Projects
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all →
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-sm">No projects yet</p>
              {isLecturer && (
                <Link href="/dashboard/projects/new" className="btn-primary inline-block mt-3 text-sm">
                  Create your first project
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : project.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Documents
          </h2>
          {recentDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📂</p>
              <p className="text-sm">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-2xl">
                    {doc.fileType?.includes("pdf")
                      ? "📄"
                      : doc.fileType?.includes("image")
                      ? "🖼️"
                      : "📝"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doc.project.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
