import { Menu } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router";
import { profile } from "~/content/profile";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["/", "Accueil"],
  ["/about", "À propos"],
  ["/journey", "Parcours"],
  ["/projects", "Projets"],
  ["/contact", "Contact"],
] as const;
function NavLinks({ onNavigate }: { onNavigate?: () => void } = {}) {
  const { pathname } = useLocation();
  return links.map(([href, label]) => {
    const active = href === "/" ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        key={href}
        to={href}
        className="nav-link"
        data-active={active}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
      >
        {label}
      </Link>
    );
  });
}
export function PublicHeader() {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenu.current?.removeAttribute("open");
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          to="/"
          className="wordmark"
          aria-label="Jonathan Blanchard — accueil"
        >
          <span className="wordmark-mark" aria-hidden />
          Jonathan Blanchard
        </Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <NavLinks />
          {profile.cvAvailable && (
            <a
              href={profile.cvUrl}
              className="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              CV
            </a>
          )}
          <ThemeToggle />
        </nav>
        <details className="mobile-nav" ref={mobileMenu}>
          <summary aria-label="Ouvrir le menu">
            <Menu aria-hidden size={22} />
          </summary>
          <nav className="mobile-panel" aria-label="Navigation mobile">
            <NavLinks onNavigate={closeMobileMenu} />
            {profile.cvAvailable && (
              <a
                href={profile.cvUrl}
                className="nav-link"
                target="_blank"
                rel="noreferrer"
              >
                Consulter le CV
              </a>
            )}
            <div className="mobile-actions">
              <span className="muted">Thème</span>
              <ThemeToggle />
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
