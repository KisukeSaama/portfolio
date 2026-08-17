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
import { apiMutation, resetCsrf } from "~/lib/api";
import { ThemeToggle } from "./theme-toggle";

const items = [
  ["/admin", "Tableau de bord", LayoutDashboard],
  ["/admin/projects", "Projets", FolderKanban],
  ["/admin/audit", "Journal", FileClock],
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
      Déconnexion
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
      <nav aria-label="Navigation administration">
        <Links />
      </nav>
      <div className="admin-sidebar-foot">
        <ThemeToggle />
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
        <summary aria-label="Ouvrir le menu d’administration">
          <Menu aria-hidden />
        </summary>
        <nav
          className="mobile-panel"
          aria-label="Navigation administration mobile"
        >
          <Links onNavigate={closeMobileMenu} />
          <div className="mobile-actions">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </nav>
      </details>
    </header>
  );
}
