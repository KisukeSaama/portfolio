"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "~/content/profile";
import type { Dictionary } from "~/i18n";
import { localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

/** The width at which the menu button gives way to the full navigation. Mirrors the media query. */
const DESKTOP_NAV_QUERY = "(min-width: 901px)";

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
        {/* The active marker is a rule under the word, so it needs a box the width of the word.
            A full-width row in the mobile panel would otherwise underline the empty space too. */}
        <span className="nav-link-label">{label}</span>
      </Link>
    );
  });
}

export function PublicHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => {
    mobileMenu.current?.removeAttribute("open");
    setMenuOpen(false);
  }, []);

  /**
   * A `<details>` menu only closes from its own summary, so every tap that means "never mind" used
   * to leave the panel standing over the page. Three of them close it here: a press anywhere
   * outside, Escape, and the viewport growing past the point where the panel stops existing.
   */
  useEffect(() => {
    const details = mobileMenu.current;
    if (!details) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!details.open) return;
      const target = event.target;
      // The language dialog renders in the top layer but stays a descendant of the panel, so
      // choosing a language is never read as a press outside.
      if (target instanceof Node && details.contains(target)) return;
      closeMobileMenu();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !details.open) return;
      // Escape inside the language dialog belongs to the dialog: it closes that, not the menu.
      if (details.querySelector("dialog[open]")) return;
      closeMobileMenu();
      details.querySelector("summary")?.focus();
    };

    const desktop = window.matchMedia(DESKTOP_NAV_QUERY);
    const handleWidthChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMobileMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleWidthChange);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleWidthChange);
    };
  }, [closeMobileMenu]);

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
                <span className="nav-link-label">{t.nav.resume}</span>
              </a>
            )}
          </div>
          <div className="header-actions">
            <LanguageSwitcher locale={locale} t={t} />
            <ThemeToggle t={t} />
          </div>
        </nav>
        <details
          className="mobile-nav"
          ref={mobileMenu}
          open={menuOpen}
          onToggle={(event) => setMenuOpen(event.currentTarget.open)}
        >
          <summary aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}>
            {menuOpen ? (
              <X aria-hidden size={22} />
            ) : (
              <Menu aria-hidden size={22} />
            )}
          </summary>
          <nav className="mobile-panel" aria-label={t.nav.mobile}>
            <div className="mobile-links">
              <NavLinks locale={locale} t={t} onNavigate={closeMobileMenu} />
              {profile.cvAvailable && (
                <a
                  href={profile.cvUrl}
                  className="nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  hrefLang={profile.cvLanguage}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-link-label">{t.nav.viewResume}</span>
                </a>
              )}
            </div>
            <div className="mobile-actions">
              <LanguageSwitcher
                locale={locale}
                t={t}
                variant="row"
                onSelect={closeMobileMenu}
              />
              <ThemeToggle t={t} variant="row" />
            </div>
          </nav>
        </details>
      </div>
      {/* Dims what the panel covers and catches the press that dismisses it. Rendered outside the
          shell so it reaches both edges of the viewport. */}
      {menuOpen && <div className="mobile-scrim" aria-hidden="true" />}
    </header>
  );
}
