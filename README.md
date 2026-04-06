# Mémoire & Présence

**Hommages numériques & plaques QR personnalisées** — site vitrine statique, pages hommage privées, accompagnement sur mesure pour les familles.

[![Site en ligne](https://img.shields.io/badge/Site-GitHub%20Pages-4e7d50?style=flat-square&logo=github)](https://lauraliedaguzay-lang.github.io/memoireetpresence/)
[![Déploiement](https://img.shields.io/badge/Déploiement-Netlify-00C7B7?style=flat-square&logo=netlify)](https://lucent-taffy-b64b7e.netlify.app/)
[![Licence](https://img.shields.io/badge/Licence-Propriétaire-lightgrey?style=flat-square)]()

---

## Démo

- **Site complet** → [lauraliedaguzay-lang.github.io/memoireetpresence](https://lauraliedaguzay-lang.github.io/memoireetpresence/)
- **Page hommage (demo)** → `/hommage/exemple-defunt/` · code : `memoire`
- **Fiche projet exemple** → `/fiche-projet-moreau.html`

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| HTML/CSS/JS | Vanilla — aucun framework build |
| Animations | AOS · GSAP + ScrollTrigger |
| UI interactif | Alpine.js |
| Carousel | Swiper |
| Lightbox | GLightbox |
| Formulaires | Netlify Forms (sans backend) |
| Polices | Cormorant Garamond · Source Sans 3 (Google Fonts) |
| Déploiement | GitHub Pages · Netlify |

---

## Structure

```
site/
├── index.html                  # Accueil
├── offre.html                  # Parcours & délais
├── plaques-qr.html             # Plaques & QR
├── video-hommage.html          # Vidéo hommage
├── accompagnement.html         # Accompagnement
├── qui-sommes-nous.html        # À propos
├── contact.html                # Contact
├── devis.html                  # Devis
├── faq.html                    # FAQ (Alpine.js accordion)
├── fiche-projet-moreau.html    # Exemple de réalisation
├── hommage/
│   ├── famille-martin/         # Page hommage demo #1
│   ├── exemple-defunt/         # Page hommage demo #2
│   └── shared/                 # CSS + JS partagés (gate, hommage.css)
├── images/                     # Logo, plaque, assets
├── style.css                   # Styles globaux
└── script.js                   # JS global (nav, formulaires)
netlify.toml                    # Config Netlify (publish = "site")
```

---

## Développement local

```bash
# Avec Node/npx
npx serve site

# Ou avec Python
python -m http.server 8080 --directory site
```

Ouvrir → `http://localhost:8080`

---

## Déploiement

### GitHub Pages (automatique)

Chaque push sur `main` déclenche via GitHub Actions la mise à jour de `gh-pages`.

### Netlify (manuel ou auto)

```bash
# Construire le ZIP pour Netlify Drop
git archive --format=zip HEAD:site/ -o memoire-presence-NETLIFY.zip
```

Ou connecter le repo GitHub à Netlify (branche `main`, publish dir `site`).

---

## Pages légales

- `/mentions-legales.html`
- `/confidentialite.html` — RGPD, Netlify Forms
- `/cgv.html` — Conditions Générales de Vente

> ⚠️ SIRET, raison sociale et adresse à compléter avant mise en production.

---

© Mémoire & Présence — Tous droits réservés. Code source non libre de droits.
