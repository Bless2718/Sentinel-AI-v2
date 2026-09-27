import {
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import DashboardLayout from "@/features/dashboard/components/dashboard-layout";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <section>
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            User Profile
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white">
            Profile
          </h1>

          <p className="mt-2 text-sm text-white/40">
            View and manage your Sentinel profile information.
          </p>

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#090711]/80 p-7">
            <div className="flex items-center gap-5 border-b border-white/[0.07] pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/[0.08]">
                <User className="h-7 w-7 text-violet-300" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Sentinel User
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Intelligence Analyst
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProfileInfo
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value="user@sentinel.ai"
              />

              <ProfileInfo
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Role"
                value="Analyst"
              />
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-violet-300">
        {icon}

        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm text-white/75">
        {value}
      </p>
    </div>
  );
}