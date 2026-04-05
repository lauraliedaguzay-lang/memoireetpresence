# Mémoire & Présence — site vitrine

Site statique (HTML / CSS / JS) — pages hommage, plaques QR, devis, légal.

**Pour Laura (sans action technique) :** transmettre **`POUR-VOTRE-PRESTATAIRE-HEBERGEMENT.md`** à la personne qui gère l’hébergement. Mise en ligne par **ZIP ou FTP** sur le domaine. **Aperçu client** (éviter le 404) : **Netlify** — voir **`ACTIVER-LIEN-DEMO-CLIENTS.md`** et **`LIEN-PERMANENT.md`**.

## Voir le site en direct pendant les modifications (local)

Pour un **aperçu local** qui se met à jour dès que vous **enregistrez** un fichier (HTML, CSS, JS) :

1. Installer **[Node.js](https://nodejs.org/)** (version LTS) si ce n’est pas déjà fait.
2. Double-cliquer **`voir-site-en-direct.cmd`** dans le dossier du site (ou dans un terminal : `npm install` une fois, puis `npm run dev`).
3. Le navigateur s’ouvre sur **http://127.0.0.1:5500** ; gardez la fenêtre noire ouverte. Chaque **Ctrl+S** dans l’éditeur recharge la page automatiquement.

## Lien à partager (indéfiniment)

Ouvrir **`LIEN-PERMANENT.md`** : une seule URL officielle à copier-coller partout (cartes, QR, signature, réseaux). Elle ne change pas tant que le domaine `memoire-et-presence.fr` reste le vôtre et est renouvelé.

## Liens

- **Site production** : `https://www.memoire-et-presence.fr/` — actif une fois le domaine, les fichiers uploadés et le HTTPS configurés chez l’hébergeur.
- **Dépôt GitHub (code)** : [https://github.com/lauraliedaguzay-lang/memoireetpresence](https://github.com/lauraliedaguzay-lang/memoireetpresence) — voir **`CONNECTER-GITHUB.md`** pour un futur `push` ou un autre PC.
- **Aperçu démo (Netlify)** : URL du type `https://….netlify.app/` après déploiement — **`ACTIVER-LIEN-DEMO-CLIENTS.md`**.

---

## Mise en ligne (hébergeur classique)

1. Compresser le dossier du site en **ZIP** (contenu à la racine du ZIP), ou copier les fichiers par **FTP / gestionnaire de fichiers**.
2. Placer tout à la **racine web** du domaine (là où se trouve `index.html`).
3. Vérifier **HTTPS** dans les paramètres de l’hébergeur.

Détail des étapes pour un tiers : **`POUR-VOTRE-PRESTATAIRE-HEBERGEMENT.md`**.

---

## Git local (optionnel, pour sauvegarde / historique)

Un dépôt Git peut exister sur le PC pour l’historique des versions ; **ce n’est pas nécessaire** pour publier le site. La publication se fait uniquement par **fichiers sur le serveur**.

Si vous utilisez Git en local après une modification :

**Envoi vers GitHub** (dans ce dossier) :

1. **`deploy-github.cmd`** — double-clic dans l’Explorateur : lance le `.ps1` avec **contournement** de la politique d’exécution (`Bypass`). En invite : `deploy-github.cmd -Message "Ma description"`
2. **`deploy-github.ps1`** dans PowerShell (si les scripts sont autorisés) : `.\deploy-github.ps1` ou avec `-Message "…"`
3. Sinon : bloc **« À la main »** ci-dessous (copier-coller dans PowerShell).

**À la main** (équivalent) :

```powershell
cd "C:\Users\laura\Downloads\memoire-presence-site"
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Description des changements"
& "C:\Program Files\Git\bin\git.exe" push origin main
```

Pour mettre à jour le **domaine** officiel : **ZIP ou FTP** comme ci-dessus (le script ne remplace pas l’hébergeur).

---

## Lier ce projet à GitHub

Étapes détaillées (création du dépôt, `remote`, premier `push`) : **`CONNECTER-GITHUB.md`**.

Rappel : **GitHub ≠ site visible par le public** pour ce projet ; le lien à partager aux clients reste **`LIEN-PERMANENT.md`**.
