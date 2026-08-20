import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "~/content/profile";
import type { Dictionary } from "~/i18n";
import { localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

export function ContactPanel({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="shell contact-panel">
        <div className="contact-panel-copy">
          <h2 id="contact-title">{t.contactPanel.title}</h2>
          <p>{t.contactPanel.body}</p>
        </div>
        <div className="contact-panel-brand" aria-hidden="true">
          <Image
            src="/images/jonathan-blanchard-logo.webp"
            alt=""
            width={512}
            height={512}
            sizes="(max-width: 680px) 80px, 160px"
          />
        </div>
        <div className="contact-panel-actions">
          <a className="button button-primary" href={`mailto:${profile.email}`}>
            {t.contactPanel.write} <ArrowUpRight size={18} aria-hidden />
          </a>
          <Link
            className="button button-secondary"
            href={localePath(locale, "/contact")}
          >
            {t.contactPanel.seeContact} <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
