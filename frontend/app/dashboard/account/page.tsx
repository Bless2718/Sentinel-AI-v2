import {
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "@/features/dashboard/components/dashboard-layout";

export default function AccountPage() {
  return (
    <DashboardLayout>
      <section>
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Account Management
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-white">
            Account
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Manage your account and security preferences.
          </p>

          <div className="mt-8 space-y-4">
            <AccountCard
              icon={<Mail className="h-5 w-5" />}
              title="Email address"
              description="Update the email connected to your Sentinel account."
            />

            <AccountCard
              icon={<KeyRound className="h-5 w-5" />}
              title="Password"
              description="Change your password and authentication credentials."
            />

            <AccountCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Security"
              description="Manage authentication and account security."
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function AccountCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#090711]/80 p-5 text-left transition hover:border-violet-400/20 hover:bg-violet-400/[0.04]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06] text-violet-300">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-white/35">
          {description}
        </p>
      </div>
    </button>
  );
}