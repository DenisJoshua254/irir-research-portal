// src/components/layout/TopBar.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

type TopBarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
};

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projects": "Projects",
  "/dashboard/profile": "Profile",
};

export default function TopBar({ user }: TopBarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const title =
    pageTitles[pathname] ||
    (pathname.includes("/projects/") ? "Project Details" : "IRIR Portal");

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">IR</span>
          </div>
        </div>
        <h1 className="font-semibold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile nav */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold"
          >
            {user.name?.charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <nav className="p-2">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/dashboard/projects", label: "Projects" },
                  { href: "/dashboard/profile", label: "Profile" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Desktop user badge */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium">
            {user.role}
          </span>
        </div>
      </div>
    </header>
  );
}
