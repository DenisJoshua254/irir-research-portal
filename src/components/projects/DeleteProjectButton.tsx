// src/components/projects/DeleteProjectButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });

    if (res.ok) {
      toast.success("Project deleted");
      router.push("/dashboard/projects");
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to delete project");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn-danger text-sm"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
