# Relier ce dossier à GitHub (sauvegarde du code)

**Personne d’autre ne peut se connecter à votre compte GitHub à votre place.** Il faut une connexion **sur votre PC** (navigateur ou mot de passe / token une fois).

Le **site public** reste sur votre **domaine** (`LIEN-PERMANENT.md`). GitHub sert ici à **archiver le code** et à collaborer avec un prestataire ou sur un autre poste — ce n’est pas l’hébergement du site pour les visiteurs.

---

## 1. Se connecter à GitHub (vous)

- Aller sur [https://github.com/login](https://github.com/login) et vous identifier.

## 2. Créer un dépôt vide

- [https://github.com/new](https://github.com/new)
- Nom possible : `memoire-presence-site`
- **Ne pas** cocher « Add a README » (le dossier local contient déjà les fichiers).
- Créer le dépôt, puis copier l’URL affichée, par exemple :  
  `https://github.com/VOTRE_COMPTE/memoire-presence-site.git`

## 3. Lier ce dossier et envoyer le code (PowerShell)

Remplacez l’URL par **la vôtre** :

```powershell
cd "C:\Users\laura\Downloads\memoire-presence-site"
& "C:\Program Files\Git\bin\git.exe" remote remove origin 2>$null
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/VOTRE_COMPTE/memoire-presence-site.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

À la première fois, Windows ou Git peut ouvrir le **navigateur** pour vous connecter à GitHub, ou demander un **token** (Paramètres GitHub → Developer settings → Personal access tokens). C’est normal.

Si `remote origin` existe déjà avec une mauvaise URL :

```powershell
& "C:\Program Files\Git\bin\git.exe" remote set-url origin https://github.com/VOTRE_COMPTE/memoire-presence-site.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

## 4. Noter l’URL dans le projet

Dans **`README.md`**, section **Dépôt GitHub**, remplacer le placeholder par la vraie URL de la page du dépôt (ex. `https://github.com/VOTRE_COMPTE/memoire-presence-site`).

## 5. Éditeur et GitHub (optionnel)

Si votre **éditeur de code** propose une intégration GitHub (compte, pull requests, etc.), vous pouvez la connecter dans ses réglages. C’est **indépendant** du `git push` décrit ci-dessus.

---

## Alternative sans ligne de commande : GitHub Desktop

Installer [GitHub Desktop](https://desktop.github.com/), vous connecter, **File → Add local repository** en choisissant le dossier `memoire-presence-site`, puis **Publish repository** sur GitHub.
