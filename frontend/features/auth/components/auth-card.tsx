import GlassCard from "@/components/ui/glass-card";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <GlassCard className="w-full max-w-md p-8">
      {children}
    </GlassCard>
  );
}