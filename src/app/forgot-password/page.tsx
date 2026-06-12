// src/app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send password reset email here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-xl mb-4">
              <span className="text-white font-bold text-xl">IR</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reset Password
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Check your email
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                If an account with {email} exists, we&apos;ve sent password reset
                instructions.
              </p>
              <Link href="/login" className="btn-primary inline-block mt-6">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@university.ac.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
