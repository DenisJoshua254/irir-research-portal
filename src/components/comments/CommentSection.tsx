// src/components/comments/CommentSection.tsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import type { CommentWithUser } from "@/types";

type Props = {
  comments: CommentWithUser[];
  projectId: string;
  currentUserId: string;
};

export default function CommentSection({ comments: initial, projectId, currentUserId }: Props) {
  const [comments, setComments] = useState(initial);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim(), projectId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to post comment");
    } else {
      setComments([data, ...comments]);
      setMessage("");
    }
  };

  const handleDelete = async (commentId: string) => {
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } else {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Discussion ({comments.length})
      </h2>

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Add a comment or note about this project..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">{message.length}/1000</span>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="btn-primary text-sm"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm">No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                {comment.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {comment.userId === currentUserId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                  {comment.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
