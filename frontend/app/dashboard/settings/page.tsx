"use client";

import { useState } from "react";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <DashboardLayout>
      <section className="max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Sentinel Configuration
        </p>

        <h1 className="mt-2 font-serif text-3xl font-semibold text-white">
          Settings
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Configure your Sentinel preferences.
        </p>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#090711]/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-white">
                Notifications
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Enable or disable analysis notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications((current) => !current)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                notifications
                  ? "bg-violet-500"
                  : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                  notifications ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}