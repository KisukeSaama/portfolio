import Link from "next/link";
import { profile } from "~/content/profile";
import type { Dictionary } from "~/i18n";
import { localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

export function PublicFooter({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{t.footer.tagline}</span>
        <Link href={localePath(locale, "/legal")}>{t.footer.legal}</Link>
      </div>
    </footer>
  );
}
