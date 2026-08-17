# Design System

## Direction

Scène de référence : un établi numérique éclairé en fin d’après-midi, avec un outil orange immédiatement identifiable posé sur des surfaces graphite et minérales. Le portfolio utilise un registre de marque personnel ; l’administration reprend les mêmes matériaux avec une densité d’outil de production.

Mots de voix : **franc**, **mécanique**, **attentionné**.

## Color strategy

Palette `Committed` côté public : l’orange porte les actions, repères de lecture et surfaces clés sans envahir l’interface. Palette `Restrained` côté administration : l’orange est réservé aux actions, sélections et focus. Toutes les couleurs sont exprimées en OKLCH et le thème sombre est composé séparément.

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

Une famille auto-hébergée : Manrope Variable. Les titres publics emploient une échelle `clamp()` au maximum de 5,8 rem, jamais centrée par réflexe. L’administration conserve une échelle fixe et compacte. Les paragraphes restent sous 68 caractères.

## Shape, layout and components

- Rayons de 8 à 14 px ; pilules uniquement pour les statuts.
- Une surface utilise une bordure ou une ombre courte, jamais les deux comme décoration.
- Hero asymétrique texte/portrait. Les projets principaux sont de grands chapitres ; les secondaires, des lignes compactes.
- Navigation publique compacte ; sidebar simple côté admin, remplacée par une barre mobile.
- Bouton primaire orange plein, secondaire bordé, champs à labels persistants, états explicites.
- Placeholders abstraits et clairement temporaires, jamais de fausses captures.

## Motion

Transitions de 160 à 220 ms avec sortie franche, uniquement pour expliquer un changement d’état. Aucun contenu n’est masqué en attente d’une animation. `prefers-reduced-motion` rend tout instantané.

## Responsive

La structure change réellement selon l’espace : portrait replacé dans le récit mobile, projets en une colonne, sidebar transformée, tableaux administratifs en lignes étiquetées. Aucune fonctionnalité critique n’est cachée.
