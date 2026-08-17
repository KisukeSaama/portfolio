import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { profile } from "~/content/profile";
import type { Dictionary } from "~/i18n";
import { localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

export function ContactPanel({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="shell contact-panel">
        <div>
          <h2 id="contact-title">{t.contactPanel.title}</h2>
          <p>{t.contactPanel.body}</p>
        </div>
        <div>
          {profile.email ? (
            <a
              className="button button-secondary"
              href={`mailto:${profile.email}`}
            >
              {t.contactPanel.write} <ArrowUpRight size={18} aria-hidden />
            </a>
          ) : (
            <>
              <Link
                className="button button-secondary"
                href={localePath(locale, "/contact")}
              >
                {t.contactPanel.seeContact}
              </Link>
              <p className="text-sm font-bold">{t.contactPanel.missing}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
