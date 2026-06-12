// src/components/projects/CollaboratorList.tsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";

type Collaborator = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type Props = {
  collaborations: Collaborator[];
  owner: { id: string; name: string; email: string };
  projectId: string;
  isOwner: boolean;
};

export default function CollaboratorList({
  collaborations: initial,
  owner,
  projectId,
  isOwner,
}: Props) {
  const [collabs, setCollabs] = useState(initial);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}/collaborators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to invite collaborator");
    } else {
      toast.success("Collaborator added!");
      setCollabs([...collabs, data]);
      setEmail("");
      setShowForm(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this collaborator?")) return;

    const res = await fetch(`/api/projects/${projectId}/collaborators`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      toast.success("Collaborator removed");
      setCollabs(collabs.filter((c) => c.user.id !== userId));
    } else {
      toast.error("Failed to remove collaborator");
    }
  };

  return (
    <div className="card p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Team ({collabs.length + 1})
        </h3>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showForm ? "Cancel" : "+ Invite"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleInvite} className="mb-4">
          <input
            type="email"
            className="input text-sm mb-2"
            placeholder="colleague@university.ac.ke"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs w-full"
          >
            {loading ? "Inviting..." : "Send Invite"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {/* Owner */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {owner.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {owner.name}
            </p>
            <p className="text-xs text-gray-400">Owner</p>
          </div>
        </div>

        {/* Collaborators */}
        {collabs.map((c) => (
          <div
            key={c.user.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
          >
            <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {c.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                {c.user.name}
              </p>
              <p className="text-xs text-gray-400">Collaborator</p>
            </div>
            {isOwner && (
              <button
                onClick={() => handleRemove(c.user.id)}
                className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
