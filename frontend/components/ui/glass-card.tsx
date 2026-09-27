import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10",
        "bg-white/5 backdrop-blur-xl",
        "shadow-[0_0_50px_rgba(0,0,0,0.25)]",
        "transition-all duration-300",
        "hover:border-primary/30",
        "hover:shadow-primary/10",
        className
      )}
    >
      {children}
    </div>
  );
}