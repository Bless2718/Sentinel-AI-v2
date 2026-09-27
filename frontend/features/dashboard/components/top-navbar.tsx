"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  LayoutDashboard,
  Settings,
  User,
  UserCircle,
} from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const params = useParams();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const datasetId =
    typeof params.datasetId === "string"
      ? params.datasetId
      : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const getPageName = () => {
    if (pathname.endsWith("/analytics")) {
      return "Analytics";
    }

    if (pathname.endsWith("/predictions")) {
      return "Predictions";
    }

    if (pathname.endsWith("/forecasting")) {
      return "Forecasting";
    }

    if (pathname.endsWith("/hotspots")) {
      return "Crime Hotspots";
    }

    if (pathname === "/dashboard/profile") {
      return "Profile";
    }

    if (pathname === "/dashboard/account") {
      return "Account";
    }

    if (pathname === "/dashboard/settings") {
      return "Settings";
    }

    if (datasetId) {
      return "Overview";
    }

    if (pathname.includes("new-analysis")) {
      return "New Analysis";
    }

    return "Dashboard";
  };

  const pageName = getPageName();

  const overviewHref = datasetId
    ? `/dashboard/analysis/${datasetId}`
    : "/dashboard/new-analysis";

  return (
    <header className="sticky top-0 z-40 h-[76px] shrink-0 border-b border-white/[0.07] bg-[#07070c]">
      <div className="flex h-full items-center justify-between px-7 lg:px-10">
        {/* Breadcrumb */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href={overviewHref}
            className="font-serif text-[18px] tracking-tight text-white transition hover:text-violet-300"
          >
            Sentinel
          </Link>

          <ChevronRight className="h-4 w-4 text-white/20" />

          <span className="text-sm font-medium text-white/60">
            {pageName}
          </span>
        </div>

        {/* Profile menu */}
        <div
          ref={profileMenuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setProfileOpen((current) => !current)
            }
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition hover:bg-white/[0.04]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <UserCircle className="h-4.5 w-4.5 text-white/45 transition group-hover:text-violet-300" />
            </div>

            <span className="hidden text-sm font-medium text-white/65 transition group-hover:text-white sm:block">
              Profile
            </span>

            <ChevronDown
              className={`hidden h-3.5 w-3.5 text-white/30 transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0911] p-2 shadow-2xl shadow-black/60"
            >
              <div className="border-b border-white/[0.06] px-3 py-3">
                <p className="text-sm font-semibold text-white">
                  Sentinel Account
                </p>

                <p className="mt-1 text-[11px] text-white/35">
                  Manage your workspace and preferences
                </p>
              </div>

              <div className="py-2">
                <ProfileMenuItem
                  href={overviewHref}
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  title="Overview"
                  description="Return to intelligence dashboard"
                  onClick={() => setProfileOpen(false)}
                />

                <ProfileMenuItem
                  href="/dashboard/profile"
                  icon={<User className="h-4 w-4" />}
                  title="Profile"
                  description="View your profile information"
                  onClick={() => setProfileOpen(false)}
                />

                <ProfileMenuItem
                  href="/dashboard/account"
                  icon={<CircleUserRound className="h-4 w-4" />}
                  title="Account"
                  description="Manage account preferences"
                  onClick={() => setProfileOpen(false)}
                />

                <ProfileMenuItem
                  href="/dashboard/settings"
                  icon={<Settings className="h-4 w-4" />}
                  title="Settings"
                  description="Configure Sentinel"
                  onClick={() => setProfileOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface ProfileMenuItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ProfileMenuItem({
  href,
  icon,
  title,
  description,
  onClick,
}: ProfileMenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-violet-400/[0.07]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-400/[0.05] text-violet-300 transition group-hover:bg-violet-400/[0.1]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-white/80 transition group-hover:text-white">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-white/30">
          {description}
        </p>
      </div>
    </Link>
  );
}