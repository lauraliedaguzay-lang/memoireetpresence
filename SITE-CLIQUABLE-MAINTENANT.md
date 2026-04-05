# Site cliquable **dès maintenant** (≈ 1 minute)

Sur beaucoup de PC / navigateurs, Netlify **n’accepte pas** le glisser-déposer d’un **dossier** : c’est normal. Utilisez un **fichier ZIP** : ça marche partout.

---

## Méthode fiable — ZIP (Windows)

1. Ouvrir l’Explorateur et aller **dans** le dossier
  `C:\Users\laura\Downloads\memoire-presence-site`  
   (vous devez **voir** `index.html`, `style.css`, `contact.html`, etc. dans la fenêtre).
2. **Sélectionner tout** : `Ctrl` + `A`.
3. Créer le ZIP :
  - **Windows 11** : clic droit sur la sélection → **Compresser au format ZIP** (ou « Envoyer vers » → dossier compressé).  
  - **Windows 10** : clic droit → **Envoyer vers** → **Dossier compressé**.
4. Ouvrir dans le navigateur : **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
  Se connecter si demandé.
5. **Glisser-déposer le fichier `.zip`** (pas le dossier) sur la zone Netlify.
6. Attendre la fin : Netlify affiche `**https://…… .netlify.app**` — c’est votre **lien cliquable**.

**Piège à éviter :** ne pas zipper le dossier **depuis l’extérieur** (une seule entrée `memoire-presence-site` dans le ZIP). Il faut zipper **ce qu’il y a dedans**, pour que le ZIP contienne `**index.html` à la racine** du ZIP.

**ZIP prêt** (hors `.git`, `node_modules`, `.github` et autres dossiers d’outillage ; le script `creer-zip-netlify.cmd` prépare une archive adaptée) : si vous avez un export `memoire-presence-NETLIFY.zip` dans *Téléchargements*, déposez ce fichier sur Netlify Drop.

---

## Si le dossier est accepté chez vous

Certaines versions de Netlify / navigateurs acceptent encore le dossier : vous pouvez essayer, mais en cas de refus, repassez au **ZIP** ci-dessus.

---

## Ensuite

- Noter l’URL dans `**LIEN-PERMANENT.md`** (section prévisualisation).
- Détail des erreurs type « Page not found » : `**ACTIVER-LIEN-DEMO-CLIENTS.md**`.
- Site officiel plus tard : `**https://www.memoire-et-presence.fr/**` (hébergeur).