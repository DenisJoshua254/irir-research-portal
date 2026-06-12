// src/components/projects/EditProjectForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Project } from "@prisma/client";

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: project.title,
    description: project.description,
    status: project.status,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to update project");
    } else {
      toast.success("Project updated!");
      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          ← Back to Project
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          Edit Project
        </h1>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Project Title *</label>
            <input
              type="text"
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              className="input resize-none"
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link href={`/dashboard/projects/${project.id}`} className="btn-secondary px-8">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
