# Design System

## Direction

Reference scene: a digital workbench lit in late afternoon, with an immediately recognizable orange tool resting on graphite and mineral surfaces. The portfolio uses a personal brand register throughout.

Voice words: **frank**, **mechanical**, **attentive**.

## Color strategy

**Orange is the only hue on the page.** Every surface, every rule and every piece of text is a neutral grey at zero chroma, so nothing competes with the accent. The surfaces used to carry a warm tint, which at that chroma could not read as the graphite the direction asks for: it read as coffee, or as a white that had gone off. Neutral is a decision, not an absence of one.

The committed palette uses orange for actions, reading landmarks and key surfaces without taking over the interface. Every color is expressed in OKLCH, and the dark theme is composed separately.

```css
:root {
  --background: oklch(0.965 0 0);
  --surface: oklch(0.995 0 0);
  --surface-2: oklch(0.925 0 0);
  --ink: oklch(0.215 0 0);
  --muted: oklch(0.44 0 0);
  --border: oklch(0.85 0 0);
  --border-strong: oklch(0.62 0 0);
  --orange: oklch(0.615 0.142 58);
  --orange-action: oklch(0.56 0.13 58);
  --orange-soft: oklch(0.8 0.12 62);
  --orange-deep: oklch(0.5 0.12 58);
  --orange-light: oklch(0.93 0.045 62);
}
[data-theme="dark"] {
  --background: oklch(0.275 0 0);
  --surface: oklch(0.32 0 0);
  --surface-2: oklch(0.365 0 0);
  --elevated: oklch(0.41 0 0);
  --ink: oklch(0.965 0 0);
  --muted: oklch(0.8 0 0);
  --border: oklch(0.465 0 0);
  --border-strong: oklch(0.63 0 0);
  --orange: oklch(0.8 0.13 58);
  --orange-action: oklch(0.82 0.12 60);
  --orange-soft: oklch(0.85 0.1 60);
  --orange-deep: oklch(0.83 0.115 60);
  --orange-light: oklch(0.9 0.065 62);
}
```

**The accent sits at hue 58, and that is load-bearing.** The ramp used to sit between hue 30 and 48, which is terracotta: it read as salmon, and it is the same corner of the wheel that every current AI product uses for its brand. A portfolio arguing that its author builds things himself cannot wear that colour. Hue 58 is the orange of a hand tool, which is what the direction asked for in the first place. Nothing on a workbench is pink.

`--border` draws section rules, which are decoration and stay quiet. `--border-strong` draws anything whose outline is what makes it readable, such as a diagram box, and clears 3:1 against both the page and the surface it sits on.

**The dark theme is dark grey, not black.** It used to start at `oklch(0.195)`, which renders near-black: the page read as a void with text floating on it, and the surfaces above it had to crowd into what was left below mid-grey. Starting at `0.275` buys four distinct planes, and the orange ramp moved up with them. Every pair the site actually renders was re-checked against its WCAG bar and against the sRGB gamut, in both themes.

## Typography

One self-hosted family: Manrope Variable, and it took a while to actually be one. A `body, button, input, textarea, select { font: inherit }` rule sat below the `body` font declaration and silently reset it, so the site shipped in the browser's system stack with Manrope downloaded and never drawn. `body` is out of that selector now; the reset is for form controls, which is all it was ever for.

Public headings use a `clamp()` scale capped at 2.75 rem for section headings and 4.35 rem for the hero. The previous scale ran to 5.8 rem against a 1 rem body, which left the page with a display register and a caption register and nothing in between. Paragraphs stay under 68 characters.

**Vertical rhythm follows one rule: the gap between a heading and its own paragraph is smaller than the gap between two sections.** Sections used to hold 16 rem of empty band around blocks of tightly set small text, which read as disconnected islands rather than as one document.

## Shape, layout and components

- Radii from 8 to 14 px; pills only for statuses.
- A surface uses either a border or a short shadow, never both as decoration.
- Asymmetric text/portrait hero. Secondary projects are compact rows.
- **A listing entry summarizes; the case study explains.** On the home and projects pages a primary project is a compact bordered card: title, status pill, one line of lede, the stack, and a link. The mechanism diagram and the line about how I work live on the case study page, under a `How it works` section that drops the heading column and takes the whole measure. Putting all of that on the listing made two projects fill four screens of a page whose job was to summarize.
- **Diagrams are laid out in HTML and CSS, never authored as SVG.** An SVG wide enough to read on a desktop puts its labels at four or five pixels on a phone, and the usual answers are a sideways scrollbar or a second drawing to maintain. Boxes and rules reflow to a column instead, and their labels stay real text at real size, translatable and selectable. Janus draws its credential boundary as a bordered region, because the claim is spatial. Episort draws six numbered stages, folding six to three to one, and the fold at three splits the pipeline where it means something. Only projects with a bespoke drawing get one.
- Compact public navigation, including the EN/FR language switch and a mobile menu.
- Solid orange primary button, outlined secondary, fields with persistent labels, explicit states.
- Abstract, clearly temporary placeholders, never fake screenshots. Their captions are rendered from the dictionary and never baked into the SVG, because a bilingual site cannot ship a hardcoded language inside an image.
- **The 404 is a page of the site, not an interstitial.** Header, footer, the page type scale, left-aligned in the shell, and three ways out rather than one. There is a not-found boundary inside the locale segment so it renders in the site's chrome, and the root one brings its own header and footer for paths that never reached a locale.
- One bordered `availability-card` carries the apprenticeship terms as a two-column definition list, directly under the hero and again on the contact page. Labels in small caps orange, values in the ink weight. It is the only surface allowed to repeat itself across pages, because a recruiter must not have to look for it.
- `note-card` is a left orange rule and nothing else. Reserved for a statement that answers a question the reader already has, never for emphasis.
- `fact-rows` is the quiet definition list: a label column, a value column, hairline rules. Used for contact details, languages and interests, and it collapses to stacked rows on small screens.

## Motion

Transitions from 160 to 220 ms with a frank exit, only to explain a state change. No content is hidden waiting for an animation. `prefers-reduced-motion` makes everything instant.

## Responsive

The structure genuinely changes with the available space: the portrait moves into the mobile narrative and projects collapse to one column. No critical feature is hidden.
