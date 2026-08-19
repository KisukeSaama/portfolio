import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "~/i18n";
import { localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

/**
 * The mechanism of each flagship project, drawn once.
 *
 * These are laid out in HTML rather than authored as SVG on purpose. An SVG diagram wide enough to
 * read on a desktop puts its labels at four or five pixels on a phone, and the usual answers are a
 * sideways scrollbar or a second drawing to maintain. Boxes and rules in CSS reflow to a column
 * instead, keep their labels as real text at real size, and stay translatable and selectable.
 *
 * Only the two flagship projects below have one; the others render without a generic diagram.
 */

function Arrow({ label }: { label: string }) {
  return (
    <p className="flow-arrow">
      <ArrowRight className="flow-arrow-glyph" size={20} aria-hidden />
      <span>{label}</span>
    </p>
  );
}

/**
 * The credential boundary. The whole point is spatial: the key is readable on one side of a line
 * and nowhere else, so the boundary is a real bordered region and not a caption claiming one.
 */
function JanusDiagram({ t }: { t: Dictionary }) {
  const d = t.showcase.janus;
  return (
    <div className="flow flow-janus" role="group" aria-label={d.diagramTitle}>
      <div className="flow-node">
        <h4>{d.app}</h4>
        <p>{d.appNote}</p>
      </div>

      <Arrow label={d.toJanus} />

      <div className="flow-boundary">
        <p className="flow-boundary-label">
          <KeyRound size={15} aria-hidden />
          {d.boundary}
        </p>
        <div className="flow-node flow-node-strong">
          <h4>{d.janus}</h4>
          <p>{d.janusNote}</p>
        </div>
        <Arrow label={d.toVault} />
        <div className="flow-node">
          <h4>{d.vault}</h4>
          <p>{d.vaultNote}</p>
        </div>
      </div>

      <Arrow label={d.toApi} />

      <div className="flow-node">
        <h4>{d.api}</h4>
        <p>{d.apiNote}</p>
      </div>

      {/* The return leg is the claim worth making, so it gets its own rule across the whole width. */}
      <p className="flow-return">
        <ArrowLeft size={18} aria-hidden />
        <span>{d.back}</span>
      </p>
    </div>
  );
}

/**
 * The pipeline. Five stages read, two of them stop and ask, and the last one is the only one
 * allowed to touch the disk, which is why it is the only one carrying the accent.
 */
function EpisortDiagram({ t, locale }: { t: Dictionary; locale: Locale }) {
  const d = t.showcase.episort;
  return (
    <ol className="flow flow-episort" aria-label={d.diagramTitle}>
      {d.steps.map((step, index) => {
        const isGate = index === 3 || index === 4;
        const isWrite = index === 5;
        return (
          <li
            className={`flow-step${isGate ? " flow-step-gate" : ""}${isWrite ? " flow-step-write" : ""}`}
            key={step.name}
          >
            <h4>{step.name}</h4>
            <p>
              {step.note}
              {/* The dependency between the two projects is the diagram's own cross-reference. */}
              {index === 2 && (
                <>
                  {" "}
                  <Link href={localePath(locale, "/janus")}>Janus</Link>
                </>
              )}
            </p>
            {isGate && (
              <p className="flow-tag">
                <ShieldCheck size={14} aria-hidden />
                {d.gate}
              </p>
            )}
            {isWrite && <p className="flow-tag flow-tag-write">{d.writes}</p>}
          </li>
        );
      })}
    </ol>
  );
}

export function ProjectDiagram({
  slug,
  t,
  locale,
}: {
  slug: string;
  t: Dictionary;
  locale: Locale;
}) {
  const diagram =
    slug === "janus" ? (
      <JanusDiagram t={t} />
    ) : slug === "episort" ? (
      <EpisortDiagram t={t} locale={locale} />
    ) : null;
  if (!diagram) return null;

  const caption =
    slug === "janus" ? t.showcase.janus.caption : t.showcase.episort.caption;
  return (
    <figure className="diagram">
      {diagram}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function hasDiagram(slug: string) {
  return slug === "janus" || slug === "episort";
}
