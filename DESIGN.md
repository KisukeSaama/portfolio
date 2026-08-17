# Design System

## Direction

Reference scene: a digital workbench lit in late afternoon, with an immediately recognizable orange tool resting on graphite and mineral surfaces. The portfolio uses a personal brand register; the administration area reuses the same materials at the density of a production tool.

Voice words: **frank**, **mechanical**, **attentive**.

## Color strategy

`Committed` palette on the public side: orange carries actions, reading landmarks and key surfaces without taking over the interface. `Restrained` palette in the administration area: orange is reserved for actions, selections and focus. Every color is expressed in OKLCH, and the dark theme is composed separately.

```css
:root {
  --background: oklch(0.975 0.008 62);
  --surface: oklch(0.995 0.004 62);
  --surface-secondary: oklch(0.94 0.012 62);
  --text-primary: oklch(0.22 0.016 47);
  --text-secondary: oklch(0.43 0.018 47);
  --border: oklch(0.84 0.018 57);
  --orange-primary: oklch(0.63 0.17 32);
  --orange-soft: oklch(0.78 0.11 42);
  --orange-deep: oklch(0.47 0.15 30);
  --orange-light: oklch(0.9 0.065 48);
}
[data-theme="dark"] {
  --background: oklch(0.22 0.006 55);
  --surface: oklch(0.27 0.008 55);
  --surface-secondary: oklch(0.31 0.009 55);
  --text-primary: oklch(0.94 0.01 62);
  --text-secondary: oklch(0.76 0.014 62);
  --border: oklch(0.4 0.012 55);
  --orange-primary: oklch(0.72 0.16 38);
  --orange-soft: oklch(0.8 0.11 44);
  --orange-deep: oklch(0.58 0.16 32);
  --orange-light: oklch(0.86 0.075 48);
}
```

## Typography

One self-hosted family: Manrope Variable. Public headings use a `clamp()` scale capped at 5.8 rem, never centered by reflex. The administration area keeps a fixed, compact scale. Paragraphs stay under 68 characters.

## Shape, layout and components

- Radii from 8 to 14 px; pills only for statuses.
- A surface uses either a border or a short shadow, never both as decoration.
- Asymmetric text/portrait hero. Primary projects are large chapters; secondary ones are compact rows.
- Compact public navigation, including the EN/FR language switch; a simple sidebar in the admin area, replaced by a mobile bar.
- Solid orange primary button, outlined secondary, fields with persistent labels, explicit states.
- Abstract, clearly temporary placeholders, never fake screenshots.

## Motion

Transitions from 160 to 220 ms with a frank exit, only to explain a state change. No content is hidden waiting for an animation. `prefers-reduced-motion` makes everything instant.

## Responsive

The structure genuinely changes with the available space: the portrait moves into the mobile narrative, projects collapse to one column, the sidebar transforms, and admin tables become labeled rows. No critical feature is hidden.
