"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedBadgeProps {
  text: string;
}

export default function AnimatedBadge({
  text,
}: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
    >
      <Sparkles className="h-4 w-4" />
      {text}
    </motion.div>
  );
}