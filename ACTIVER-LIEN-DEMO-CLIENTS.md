# Aperçu du site pour les clients — **Netlify** (plus de GitHub Pages)

Les clients reçoivent un **lien normal** : ils cliquent, le site s’affiche. **Pas de compte** pour eux.

GitHub Pages n’est **plus** utilisé pour cette démo (souvent 404 si non configuré). **Netlify** suffit avec un compte gratuit.

---

## Activer la démo client — **3 minutes** (à faire une fois)

*(Personne d’autre ne peut le faire sans accès à **votre** navigateur / compte Netlify.)*

1. Ouvrir **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Se connecter (e-mail ou GitHub).
3. Déposer **le fichier** `**memoire-presence-NETLIFY.zip`** dans *Téléchargements* sur votre PC **ou** glisser le dossier `**memoire-presence-site*`* si le navigateur l’accepte.
4. Copier l’URL affichée (`**https://….netlify.app**`).
5. La coller dans `**LIEN-PERMANENT.md**` à la place de `https://VOTRE-SITE.netlify.app/` — c’est le **lien démo** à envoyer aux clients.

**Phrase pour les clients :** *« Voici un aperçu du site : [votre lien]. L’adresse définitive sera [www.memoire-et-presence.fr](http://www.memoire-et-presence.fr). »*

---

## Méthode rapide — glisser-déposer (sans Git)

1. Aller sur **[app.netlify.com/drop](https://app.netlify.com/drop)** (créer un compte Netlify si besoin : e-mail ou GitHub).
2. **Glisser-déposer** le dossier `**memoire-presence-site`** dans la zone (recommandé).
  **ZIP :** ne pas zipper le dossier « de l’extérieur ». Ouvrir `**memoire-presence-site`**, **sélectionner tout** (`Ctrl+A`) les fichiers et dossiers **à l’intérieur**, puis « Envoyer vers dossier compressé ». Ainsi `**index.html`** est bien à la **racine** du ZIP. *(Si le ZIP contient une seule entrée `memoire-presence-site/` puis les fichiers, Netlify met le site dans un sous-chemin → **Page not found** à l’accueil.)*

**Photos / logo :** le dossier `**images`** (avec `logo-memoire-presence.png`, `plaque-exemple.png`, `bg-sable.png`, etc.) **doit** être inclus dans le ZIP ou dans le dossier glissé sur Netlify. Sinon le site s’affiche **sans aucune image**. Sur le PC : double-clic `**restaurer-les-images.cmd`** pour recopier les PNG depuis Téléchargements ; puis double-clic `**creer-zip-netlify.cmd**` pour régénérer `**memoire-presence-NETLIFY.zip**` à la racine de *Téléchargements*.
3. Attendre la fin du déploiement : Netlify affiche une adresse du type `**https://quelque-chose.netlify.app*`*.
4. **Option** : *Site configuration* → *Site details* → *Change site name* pour un nom plus lisible (ex. `memoire-presence-demo` → `https://memoire-presence-demo.netlify.app` si disponible).
5. **Noter cette URL** et la recopier dans `**LIEN-PERMANENT.md`** (section prévisualisation) pour vos mails et QR codes de démo.

À chaque mise à jour du site : refaire un **glisser-déposer** du dossier (ou reconnecter le dépôt Git, voir ci-dessous).

---

## Méthode reliée à GitHub (mises à jour automatiques)

1. Sur **[app.netlify.com](https://app.netlify.com)** : **Add new site** → **Import an existing project**.
2. Choisir **GitHub**, autoriser Netlify, sélectionner le dépôt `**memoireetpresence`**.
3. Laisser les champs proposés : le fichier `**netlify.toml**` du projet indique déjà **publish = "."**.
4. **Deploy**. L’URL `*.netlify.app` apparaît après le premier build.

Chaque `**push`** sur la branche reliée redéploie le site (après `deploy-github.cmd` ou équivalent).

Vérifiez que la branche est `**main**` et que le dépôt contient bien `**index.html**` à la racine (comme sur GitHub : pas seulement un sous-dossier vide).

---

## « Page not found » après déploiement — que faire ?

1. **Vérifier les fichiers déployés**
  Netlify → votre site → **Deploys** → dernier déploiement → **Browse published files** (ou équivalent).  
   Il doit y avoir `**index.html` tout en haut** de la liste.  
  - S’il est dans `**memoire-presence-site/index.html`** : le site est publié un cran trop bas.  
    - **Avec Git :** *Site configuration* → *Build & deploy* → *Build settings* → **Publish directory** : mettre `**memoire-presence-site`** (si c’est ainsi que le dépôt est structuré) **ou** remettre `**.`** si `index.html` est déjà à la racine du repo.  
    - **Avec ZIP :** refaire un ZIP comme ci-dessus (fichiers **à l’intérieur** du dossier, pas le dossier parent).
2. **Tester l’URL exacte**
  Ouvrir `**https://VOTRE-SITE.netlify.app/index.html`**.  
  - Si **ça marche** mais pas sans `/index.html`, signaler à Netlify / vider cache ; en général `/` suffit une fois la racine corrigée.  
  - Si **ça ne marche pas**, le déploiement n’a pas les bons fichiers (revoir l’étape 1).
3. **Relancer un déploiement**
  *Deploys* → **Trigger deploy** → **Clear cache and deploy site**.
4. **Connexion GitHub**
  Si l’import Git a échoué une fois, les réglages *Publish directory* / *Base directory* peuvent être faux : les remettre à `**/`** ou vide pour la base, `**.**` pour publish (racine du repo = site).

---

## Phrase type pour les clients

*« Voici un aperçu du site : [votre lien netlify.app]. L’adresse définitive sera [https://www.memoire-et-presence.fr/](https://www.memoire-et-presence.fr/) une fois en ligne. »*

---

## Rappel

- **Netlify** = démo / brouillon public pratique.  
- **[www.memoire-et-presence.fr](http://www.memoire-et-presence.fr)** = site officiel (hébergeur + FTP/ZIP comme dans `**POUR-VOTRE-PRESTATAIRE-HEBERGEMENT.md*`*).

