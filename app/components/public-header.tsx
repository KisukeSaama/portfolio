"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
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
  // Compare without the locale prefix, so localized routes highlight the same link.
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

export function PublicHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
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
          <Image
            className="wordmark-logo"
            src="/images/jonathan-blanchard-logo.webp"
            width={512}
            height={512}
            sizes="32px"
            alt=""
            aria-hidden="true"
            priority
          />
          {profile.name}
        </Link>
        <nav className="desktop-nav" aria-label={t.nav.primary}>
          <div className="nav-links">
            <NavLinks locale={locale} t={t} />
            {profile.cvAvailable && (
              <a
                href={profile.cvUrl}
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
                hrefLang={profile.cvLanguage}
              >
                {t.nav.resume}
              </a>
            )}
          </div>
          <div className="header-actions">
            <LanguageSwitcher locale={locale} t={t} />
            <ThemeToggle t={t} />
          </div>
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
                rel="noopener noreferrer"
              >
                {t.nav.viewResume}
              </a>
            )}
            <div className="mobile-actions">
              <span className="muted">{t.nav.language}</span>
              <LanguageSwitcher
                locale={locale}
                t={t}
                onSelect={closeMobileMenu}
              />
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
