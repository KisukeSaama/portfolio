"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { profile } from "~/content/profile";
import type { Dictionary } from "~/i18n";
import { localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

function navLinks(t: Dictionary) {
  return [
    ["/", t.nav.home],
    ["/about", t.nav.about],
    ["/journey", t.nav.journey],
    ["/projects", t.nav.projects],
    ["/contact", t.nav.contact],
  ] as const;
}

function NavLinks({
  locale,
  t,
  onNavigate,
}: {
  locale: Locale;
  t: Dictionary;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  // Compare without the locale prefix, so /fr/about highlights the same link as /en/about.
  const path = pathname.replace(`/${locale}`, "") || "/";
  return navLinks(t).map(([href, label]) => {
    const active = href === "/" ? path === href : path.startsWith(href);
    return (
      <Link
        key={href}
        href={localePath(locale, href)}
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

export function PublicHeader({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenu.current?.removeAttribute("open");
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          href={localePath(locale, "/")}
          className="wordmark"
          aria-label={t.nav.homeAriaLabel}
        >
          <span className="wordmark-mark" aria-hidden />
          {profile.name}
        </Link>
        <nav className="desktop-nav" aria-label={t.nav.primary}>
          <NavLinks locale={locale} t={t} />
          {profile.cvAvailable && (
            <a
              href={profile.cvUrl}
              className="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              {t.nav.resume}
            </a>
          )}
          <LanguageSwitcher locale={locale} label={t.nav.language} />
          <ThemeToggle t={t} />
        </nav>
        <details className="mobile-nav" ref={mobileMenu}>
          <summary aria-label={t.nav.openMenu}>
            <Menu aria-hidden size={22} />
          </summary>
          <nav className="mobile-panel" aria-label={t.nav.mobile}>
            <NavLinks locale={locale} t={t} onNavigate={closeMobileMenu} />
            {profile.cvAvailable && (
              <a
                href={profile.cvUrl}
                className="nav-link"
                target="_blank"
                rel="noreferrer"
              >
                {t.nav.viewResume}
              </a>
            )}
            <div className="mobile-actions">
              <span className="muted">{t.nav.language}</span>
              <LanguageSwitcher locale={locale} label={t.nav.language} />
            </div>
            <div className="mobile-actions">
              <span className="muted">{t.nav.theme}</span>
              <ThemeToggle t={t} />
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
