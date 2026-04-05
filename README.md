# Mémoire & Présence

Site vitrine statique — pages hommage privées, QR code, accompagnement sur mesure.

## Structure

```
site/        → fichiers du site (HTML, CSS, JS, images)
netlify.toml → configuration Netlify (publish = "site")
```

## Développement local

```bash
npm install
npm run dev   # ouvre http://localhost:5500
```

## Déploiement

Chaque push sur `main` déclenche un déploiement automatique sur Netlify.
