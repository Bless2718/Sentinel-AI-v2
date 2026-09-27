"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface GradientButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function GradientButton({
  href,
  children,
}: GradientButtonProps) {
  return (
    <Link
      href={href}
      className="
      inline-flex
      items-center
      gap-2
      rounded-xl
      bg-gradient-to-r
      from-cyan-500
      to-blue-600
      px-6
      py-3
      font-semibold
      text-white
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-lg
      hover:shadow-cyan-500/30
      "
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}