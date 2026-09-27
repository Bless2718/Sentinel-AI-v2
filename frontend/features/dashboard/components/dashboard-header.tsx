interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-white">
        {title}
      </h1>

      <p className="mt-2 text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}