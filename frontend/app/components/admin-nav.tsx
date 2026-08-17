import {
  FileClock,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import { useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { apiMutation, resetCsrf } from "~/lib/api";
import { ThemeToggle } from "./theme-toggle";

const items = [
  ["/admin", "Tableau de bord", LayoutDashboard],
  ["/admin/projects", "Projets", FolderKanban],
  ["/admin/audit", "Journal", FileClock],
] as const;
function Links({ onNavigate }: { onNavigate?: () => void } = {}) {
  return (
    <>
      {items.map(([to, label, Icon]) => (
        <NavLink
          key={to}
          end={to === "/admin"}
          to={to}
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        onClick={onNavigate}
        >
          <Icon size={17} aria-hidden />
          {label}
        </NavLink>
      ))}
    </>
  );
}
export function LogoutButton() {
  const navigate = useNavigate();
  async function logout() {
    await apiMutation<void>("/auth/logout", { method: "POST" });
    resetCsrf();
    await navigate("/admin/login");
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
      <NavLink to="/admin" className="wordmark">
        <span className="wordmark-mark" aria-hidden />
        Administration
      </NavLink>
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
      <NavLink to="/admin" className="wordmark">
        <span className="wordmark-mark" aria-hidden />
        Admin
      </NavLink>
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
