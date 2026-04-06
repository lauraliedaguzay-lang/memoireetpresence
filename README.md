# Mémoire & Présence

**Hommages numériques & plaques QR personnalisées** — site vitrine statique, pages hommage privées, accompagnement sur mesure pour les familles.

[![Site en ligne](https://img.shields.io/badge/Site-GitHub%20Pages-4e7d50?style=flat-square&logo=github)](https://lauraliedaguzay-lang.github.io/memoireetpresence/)
[![Déploiement](https://img.shields.io/badge/Déploiement-Netlify-00C7B7?style=flat-square&logo=netlify)](https://lucent-taffy-b64b7e.netlify.app/)
[![Licence](https://img.shields.io/badge/Licence-Propriétaire-lightgrey?style=flat-square)]()

---

## Démo

- **Site complet** → [lauraliedaguzay-lang.github.io/memoireetpresence](https://lauraliedaguzay-lang.github.io/memoireetpresence/)
- **Maquettes hommage** → `/acces-hommage-demo.html` — **Claire Fontenay** (`/hommage/exemple-defunt/`, accès libre) · **Famille Martin** (`/hommage/famille-martin/`, accès réservé, code démo `presence`)
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
| Formulaires | Netlify Forms |
| Fonctions | `verify-hommage-demo` — vérification du code hommage Martin (Netlify) |
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
│   └── shared/                 # hommage.css, hommage-gate.js, hommage-swiper-init.js
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

**Cache-bust** : les pages HTML référencent `style.css?v=…` (et les maquettes `hommage.css?v=…`, `hommage-gate.js?v=…`, etc.). Après une modification CSS/JS, incrémenter la même version sur les fichiers concernés pour éviter les caches navigateur.

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

### Code d’accès hommage (démo Martin)

Sur **Netlify**, définir la variable d’environnement `HOMMAGE_DEMO_CODE_FAMILLE_MARTIN` (voir `.env.example` à la racine du dépôt). Valeur par défaut dans la fonction si la variable est absente&nbsp;: `presence`.

La fonction `netlify/functions/verify-hommage-demo.js` répond en `POST` sur `/.netlify/functions/verify-hommage-demo` avec un corps JSON `{ "slug": "famille-martin", "code": "…" }`. L’URL peut être surchargée côté page via l’attribut `data-verify-url` sur `#hommage-gate` (défaut&nbsp;: chemin Netlify ci-dessus).

Sur les pages hommage démo, le `<body>` porte **`data-hommage-access="open"`** (Claire Fontenay — pas de code) ou **`"code"`** (Famille Martin — porte + `hommage-gate.js`). Le même script `hommage-gate.js` est chargé sur les deux&nbsp;: en mode `open`, il garantit l’affichage du contenu et ignore toute porte erronée.

Sur **GitHub Pages** seul, la même démo vérifie le code dans le navigateur ; la session n’est pas mémorisée entre rechargements. Sur **Netlify**, après succès serveur, la session peut l’être pour l’onglet.

**À garder en tête (vitrine / démo)** : une page HTML statique reste lisible par des outils techniques — la porte à code protège surtout l’**expérience** des visiteurs et, sur Netlify, la **validation du mot de passe**. Pour un besoin de confidentialité maximale du contenu, on monte une autre solution avec vous.

---

## Pages légales

- `/mentions-legales.html`
- `/confidentialite.html` — RGPD, Netlify Forms
- `/cgv.html` — Conditions Générales de Vente

> ⚠️ SIRET, raison sociale et adresse à compléter avant mise en production.

---

© Mémoire & Présence — Tous droits réservés. Code source non libre de droits.
