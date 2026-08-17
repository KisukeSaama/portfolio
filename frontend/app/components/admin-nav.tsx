"use client";

import {
  FileClock,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";
import { apiMutation, resetCsrf } from "~/lib/api";

// The administration area is single-language; it always renders in the source language.
const t = getDictionary(defaultLocale);
import { ThemeToggle } from "./theme-toggle";

const items = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/projects", "Projects", FolderKanban],
  ["/admin/audit", "Log", FileClock],
] as const;
function Links({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();
  return (
    <>
      {items.map(([to, label, Icon]) => (
        <Link
          key={to}
          href={to}
          className={`nav-link${(to === "/admin" ? pathname === to : pathname.startsWith(to)) ? " active" : ""}`}
          onClick={onNavigate}
        >
          <Icon size={17} aria-hidden />
          {label}
        </Link>
      ))}
    </>
  );
}
export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await apiMutation<void>("/auth/logout", { method: "POST" });
    resetCsrf();
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      className="button button-quiet"
      onClick={() => void logout()}
    >
      <LogOut size={17} aria-hidden />
      Sign out
    </button>
  );
}
export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="wordmark">
        <span className="wordmark-mark" aria-hidden />
        Administration
      </Link>
      <nav aria-label="Administration navigation">
        <Links />
      </nav>
      <div className="admin-sidebar-foot">
        <ThemeToggle t={t} />
        <LogoutButton />
      </div>
    </aside>
  );
}
export function AdminMobile() {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenu.current?.removeAttribute("open");
  return (
    <header className="admin-mobile">
      <Link href="/admin" className="wordmark">
        <span className="wordmark-mark" aria-hidden />
        Admin
      </Link>
      <details className="mobile-nav" ref={mobileMenu}>
        <summary aria-label="Open the administration menu">
          <Menu aria-hidden />
        </summary>
        <nav
          className="mobile-panel"
          aria-label="Mobile administration navigation"
        >
          <Links onNavigate={closeMobileMenu} />
          <div className="mobile-actions">
            <ThemeToggle t={t} />
            <LogoutButton />
          </div>
        </nav>
      </details>
    </header>
  );
}
