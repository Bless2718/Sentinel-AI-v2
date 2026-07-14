"use client";

import Link from "next/link";
import Logo from "./logo";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}