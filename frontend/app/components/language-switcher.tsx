"use client";

import { Check, Globe, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useId, useRef } from "react";
import type { Dictionary } from "~/i18n";
import { localeCookie, localeNames, locales, type Locale } from "~/i18n/config";

/** Remembers the choice for the next visit that arrives without a locale prefix. */
function rememberLocale(next: Locale) {
  document.cookie = `${localeCookie}=${next};path=/;max-age=31536000;samesite=lax`;
}

/**
 * A globe that opens the list of languages in a modal. `showModal` is what makes the dialog behave:
 * it traps the focus, closes on Escape, holds the page inert behind the backdrop, and hands the
 * focus back to the globe on the way out. The dialog stays mounted so it can animate both ways.
 */
export function LanguageSwitcher({
  locale,
  t,
  onSelect,
}: {
  locale: Locale;
  t: Dictionary;
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const currentOption = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  function open() {
    dialog.current?.showModal();
    // The current language cannot carry `autoFocus`: React honours it on mount, which would pull
    // the focus out of the page while the dialog is still closed. Move it once the dialog is up.
    currentOption.current?.focus();
  }

  function close() {
    dialog.current?.close();
  }

  function switchTo(next: Locale) {
    close();
    onSelect?.();
    if (next === locale) return;
    rememberLocale(next);
    // Swaps the locale segment of the current path, so switching language keeps the visitor on the
    // page they were reading.
    const rest = pathname.split("/").slice(2).join("/");
    router.push(rest ? `/${next}/${rest}` : `/${next}`);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className="icon-button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`${t.language.change} (${localeNames[locale]})`}
        title={t.language.change}
      >
        <Globe size={19} aria-hidden />
      </button>
      <dialog
        ref={dialog}
        className="language-dialog"
        aria-labelledby={titleId}
        // The dialog carries no padding of its own, so a click that lands on the element itself
        // came from the backdrop rather than from the panel.
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="language-dialog-inner">
          <div className="language-dialog-head">
            <h2 id={titleId}>{t.language.title}</h2>
            <button
              type="button"
              className="icon-button"
              onClick={close}
              aria-label={t.language.close}
            >
              <X size={18} aria-hidden />
            </button>
          </div>
          <ul className="language-options">
            {locales.map((option) => {
              const active = option === locale;
              return (
                <li key={option}>
                  <button
                    type="button"
                    ref={active ? currentOption : undefined}
                    className="language-option"
                    data-active={active}
                    aria-current={active ? "true" : undefined}
                    lang={option}
                    onClick={() => switchTo(option)}
                  >
                    <span className="language-code" aria-hidden>
                      {option.toUpperCase()}
                    </span>
                    {localeNames[option]}
                    {active && (
                      <Check size={17} className="language-check" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}
