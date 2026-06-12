// src/app/dashboard/profile/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          ownedProjects: true,
          collaborations: true,
          comments: true,
        },
      },
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your account information
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(user.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.role === "LECTURER" ? "Lecturer / Supervisor" : "Collaborator / Researcher"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Activity Summary
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {user._count.ownedProjects}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Projects Created
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {user._count.collaborations}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Collaborations
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user._count.comments}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
