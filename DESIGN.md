# Design System

## Direction

Reference scene: a digital workbench lit in late afternoon, with an immediately recognizable orange tool resting on graphite and mineral surfaces. The portfolio uses a personal brand register; the administration area reuses the same materials at the density of a production tool.

Voice words: **frank**, **mechanical**, **attentive**.

## Color strategy

**Orange is the only hue on the page.** Every surface, every rule and every piece of text is a neutral grey at zero chroma, so nothing competes with the accent. The surfaces used to carry a warm tint, which at that chroma could not read as the graphite the direction asks for: it read as coffee, or as a white that had gone off. Neutral is a decision, not an absence of one.

`Committed` palette on the public side: orange carries actions, reading landmarks and key surfaces without taking over the interface. `Restrained` palette in the administration area: orange is reserved for actions, selections and focus. Every color is expressed in OKLCH, and the dark theme is composed separately.

```css
:root {
  --background: oklch(0.965 0 0);
  --surface: oklch(0.995 0 0);
  --surface-2: oklch(0.925 0 0);
  --ink: oklch(0.215 0 0);
  --muted: oklch(0.44 0 0);
  --border: oklch(0.85 0 0);
  --border-strong: oklch(0.62 0 0);
  --orange: oklch(0.65 0.155 58);
  --orange-action: oklch(0.56 0.13 58);
  --orange-soft: oklch(0.8 0.12 62);
  --orange-deep: oklch(0.5 0.12 58);
  --orange-light: oklch(0.93 0.045 62);
}
[data-theme="dark"] {
  --background: oklch(0.195 0 0);
  --surface: oklch(0.245 0 0);
  --surface-2: oklch(0.29 0 0);
  --ink: oklch(0.945 0 0);
  --muted: oklch(0.755 0 0);
  --border: oklch(0.385 0 0);
  --border-strong: oklch(0.55 0 0);
  --orange: oklch(0.78 0.14 58);
  --orange-action: oklch(0.82 0.12 60);
  --orange-soft: oklch(0.84 0.1 60);
  --orange-deep: oklch(0.82 0.12 60);
  --orange-light: oklch(0.88 0.08 62);
}
```

**The accent sits at hue 58, and that is load-bearing.** The ramp used to sit between hue 30 and 48, which is terracotta: it read as salmon, and it is the same corner of the wheel that every current AI product uses for its brand. A portfolio arguing that its author builds things himself cannot wear that colour. Hue 58 is the orange of a hand tool, which is what the direction asked for in the first place. Nothing on a workbench is pink.

`--border` draws section rules, which are decoration and stay quiet. `--border-strong` draws anything whose outline is what makes it readable, such as a diagram box, and clears 3:1 against both the page and the surface it sits on.

## Typography

One self-hosted family: Manrope Variable. Public headings use a `clamp()` scale capped at 5.8 rem, never centered by reflex. The administration area keeps a fixed, compact scale. Paragraphs stay under 68 characters.

## Shape, layout and components

- Radii from 8 to 14 px; pills only for statuses.
- A surface uses either a border or a short shadow, never both as decoration.
- Asymmetric text/portrait hero. Secondary projects are compact rows.
- A primary project is a full-width band, not a two-column card: title and status pill, one line of lede, the mechanism drawn across the whole measure, then stack and role beside one `note-card` line about how I work, then the actions. The old chapter gave half its width to a placeholder, so half the weight of the strongest thing on the page carried nothing.
- **Diagrams are laid out in HTML and CSS, never authored as SVG.** An SVG wide enough to read on a desktop puts its labels at four or five pixels on a phone, and the usual answers are a sideways scrollbar or a second drawing to maintain. Boxes and rules reflow to a column instead, and their labels stay real text at real size, translatable and selectable. Janus draws its credential boundary as a bordered region, because the claim is spatial. Episort draws six numbered stages, folding six to three to one, and the fold at three splits the pipeline where it means something. Only projects with a drawing get one; anything else published from the administration area renders without it.
- Compact public navigation, including the EN/FR language switch; a simple sidebar in the admin area, replaced by a mobile bar.
- Solid orange primary button, outlined secondary, fields with persistent labels, explicit states.
- Abstract, clearly temporary placeholders, never fake screenshots.
- One bordered `availability-card` carries the apprenticeship terms as a two-column definition list, directly under the hero and again on the contact page. Labels in small caps orange, values in the ink weight. It is the only surface allowed to repeat itself across pages, because a recruiter must not have to look for it.
- `note-card` is a left orange rule and nothing else. Reserved for a statement that answers a question the reader already has, never for emphasis.
- `fact-rows` is the quiet definition list: a label column, a value column, hairline rules. Used for contact details, languages and interests, and it collapses to stacked rows on small screens.

## Motion

Transitions from 160 to 220 ms with a frank exit, only to explain a state change. No content is hidden waiting for an animation. `prefers-reduced-motion` makes everything instant.

## Responsive

The structure genuinely changes with the available space: the portrait moves into the mobile narrative, projects collapse to one column, the sidebar transforms, and admin tables become labeled rows. No critical feature is hidden.
