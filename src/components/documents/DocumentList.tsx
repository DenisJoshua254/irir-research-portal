// src/components/documents/DocumentList.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate, formatFileSize, getFileIcon } from "@/lib/utils";
import type { Document } from "@prisma/client";

type Props = {
  documents: Document[];
  projectId: string;
  canUpload: boolean;
};

export default function DocumentList({ documents, projectId, canUpload }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState(documents);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    const res = await fetch("/api/documents", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      toast.error(data.error || "Upload failed");
    } else {
      toast.success("Document uploaded!");
      setDocs([data, ...docs]);
      router.refresh();
    }

    // Reset input
    e.target.value = "";
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;

    const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });

    if (res.ok) {
      toast.success("Document deleted");
      setDocs(docs.filter((d) => d.id !== docId));
    } else {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Documents ({docs.length})
        </h2>
        {canUpload && (
          <label className="btn-primary text-sm cursor-pointer">
            {uploading ? "Uploading..." : "+ Upload"}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📂</p>
          <p className="text-sm">No documents uploaded yet</p>
          {canUpload && (
            <p className="text-xs mt-1">Upload PDF, DOCX, or image files</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">
                  {getFileIcon(doc.fileType)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {doc.fileSize ? formatFileSize(doc.fileSize) : ""} ·{" "}
                    {formatDate(doc.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline px-2 py-1"
                >
                  ↓ Download
                </a>
                {canUpload && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
