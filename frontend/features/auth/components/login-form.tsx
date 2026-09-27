"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  return (
    <form className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Email
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Password
        </label>

        <input
          type="password"
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="#"
          className="text-sm text-cyan-400 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button className="w-full">
        Sign In
      </Button>
    </form>
  );
}