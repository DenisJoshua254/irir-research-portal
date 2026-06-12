// src/app/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-700 font-bold text-lg">IR</span>
            </div>
            <span className="text-white font-bold text-xl">IRIR Research Portal</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Research Collaboration
            <span className="block text-primary-200">Made Simple</span>
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Manage your research projects, collaborate with colleagues, and
            share documents — all in one modern platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
            >
              Start Free Today
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          {[
            {
              icon: "🗂️",
              title: "Project Management",
              desc: "Create and organize research projects with titles, descriptions, and status tracking.",
            },
            {
              icon: "👥",
              title: "Collaboration",
              desc: "Invite collaborators to join your projects and contribute to the research.",
            },
            {
              icon: "📁",
              title: "Document Sharing",
              desc: "Upload PDFs, Word documents, and images securely with cloud storage.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/10 backdrop-blur rounded-xl p-6 text-white"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-primary-100 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
