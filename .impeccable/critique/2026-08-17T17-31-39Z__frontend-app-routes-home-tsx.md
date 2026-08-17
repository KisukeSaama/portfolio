---
target: portfolio public, accueil
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-08-17T17-31-39Z
slug: frontend-app-routes-home-tsx
---
## Design Health Score

| Heuristique | Score | Observation |
| --- | ---: | --- |
| Visibilité de l’état | 3 | Retours de sauvegarde, chargement et cycle éditorial présents. |
| Correspondance au monde réel | 4 | Le récit part de problèmes et emploie un français direct. |
| Contrôle et liberté | 3 | Navigation, annulation implicite et confirmations disponibles. |
| Cohérence et standards | 4 | Tokens, composants, actions et deux registres cohérents. |
| Prévention des erreurs | 4 | Validation, brouillon, confirmation et protection des changements. |
| Reconnaissance plutôt que rappel | 3 | Actions nommées, aide inline et navigation active. |
| Flexibilité et efficacité | 3 | Recherche, filtres, duplication et réordonnancement. |
| Esthétique et minimalisme | 4 | Hiérarchie éditoriale asymétrique sans motifs décoratifs gratuits. |
| Diagnostic et récupération | 3 | Erreurs contextualisées et état préservé dans l’éditeur. |
| Aide et documentation | 3 | Aide inline et README opérationnel, sans centre d’aide superflu. |
| **Total** | **34/40** | **Bon, prêt après polissage effectué.** |

## Anti-patterns verdict

Le rendu ne ressemble pas à une landing SaaS ou à un template IA : pas de grille Bento, gradient, glassmorphism, faux terminal, métrique inventée, halos ou série de logos. La composition alterne chapitres éditoriaux, listes structurées et surfaces produit. Le détecteur Impeccable retourne zéro signal après correction.

## Overall impression

La personnalité précède les preuves techniques. L’orange agit comme fil narratif et non comme remplissage. Le principal enjeu initial était l’accessibilité des paires orange/texte et des micro-libellés ; ces écarts ont été corrigés et vérifiés en navigateur.

## Points forts

- Hero asymétrique, lisible et humain, avec placeholder honnête.
- Études de cas pilotées par les données et hiérarchisées par importance.
- Administration plus dense mais visuellement apparentée, sans dashboard SaaS générique.

## Corrections prioritaires appliquées

- **P1 Contraste** : séparation orange identitaire/orange d’action et paire de texte par thème ; axe WCAG AA passe en clair et sombre.
- **P1 Accessibilité produit** : noms accessibles sur les actions iconiques et état actif porté par le lien admin.
- **P2 Responsive** : fermeture des menus après navigation, viewport safe-area et tests d’absence de débordement.
- **P2 Typographie** : micro-libellés remontés à 14 px minimum et liens icône/texte réalignés.
- **P2 Feedback** : retour succès/erreur et état occupé sur les mutations de liste admin.

## Personas

- **Jordan, recruteur découvrant le profil** : comprend en premier l’identité, l’approche et la recherche d’alternance avant d’atteindre les projets.
- **Casey, visite mobile** : boutons pleine largeur, menu compact, cibles tactiles et aucune dépendance au survol.
- **Sam, navigation clavier/lecteur d’écran** : skip-link, focus visible, landmarks, labels et audits axe sur les parcours représentatifs.
- **Alex, administrateur** : accès rapide aux filtres, à la duplication, au réordonnancement et au cycle de publication.

## Observations mineures

Les contenus de parcours précis et les médias réels restent volontairement signalés comme placeholders. Leur remplacement enrichira le résultat sans changer la structure.

## Questions de conception closes

La direction choisie privilégie une marque personnelle sobre et un outil d’administration spécialisé. Aucun nouvel effet décoratif ni couche CMS généraliste n’est nécessaire.
