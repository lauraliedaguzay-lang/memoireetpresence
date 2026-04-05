# À transmettre à votre prestataire informatique (ou support hébergeur)

**Projet :** site statique *Mémoire & Présence*  
**Dossier local :** `memoire-presence-site` (sur l’ordinateur de Laura)  
**Objectif :** mettre le site **en ligne sur le domaine de l’entreprise** (pas de site sur `github.io`).

**Lien permanent pour Laura (à faire fonctionner et à lui confirmer) :**  
`https://www.memoire-et-presence.fr/` — c’est **le seul** lien qu’elle doit utiliser pour tout partager (QR, cartes, mails). Éviter de lui communiquer une URL temporaire d’hébergeur.

---

## Ce que vous devez faire

### Option A — ZIP (souvent le plus simple)

1. Sur le PC de Laura : compresser **tout le contenu** du dossier `memoire-presence-site` en un fichier **ZIP** (les fichiers HTML, `style.css`, `script.js`, dossiers `hommage/`, `images/` s’il y en a, etc. — **à la racine du ZIP**, pas un seul sous-dossier vide).
2. Chez l’hébergeur (Hostinger, OVH, Ionos, etc.) : **Gestionnaire de fichiers** ou **FTP**.
3. Uploader et **décompresser** à la **racine web** du domaine (là où doit se trouver `index.html` pour `https://www.memoire-et-presence.fr/`).
4. Vérifier dans le navigateur : la page d’accueil s’affiche, les liens du menu fonctionnent, le cadenas **HTTPS** est actif.

### Option B — Copie directe (FTP / SFTP)

1. Se connecter au serveur avec les identifiants fournis par l’hébergeur.
2. Aller au dossier **public_html**, **www**, ou équivalent (racine du site).
3. **Uploader tous les fichiers** du dossier `memoire-presence-site` (même structure que en local).
4. Ne pas oublier les sous-dossiers (`hommage/`, etc.).

---

## À communiquer à Laura une fois terminé


| Quoi                          | Valeur                                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lien permanent à partager** | `https://www.memoire-et-presence.fr/` (ou l’URL finale si le domaine diffère — **à écrire dans `LIEN-PERMANENT.md` sur le PC de Laura** si ce n’est pas cette adresse) |
| Certificat SSL / HTTPS        | activé oui / non                                                                                                                                                       |


---

## Mises à jour ultérieures

Quand le site change : refaire un **ZIP** du dossier à jour ou **remplacer** les fichiers modifiés sur le serveur (mêmes noms de fichiers).

---

## Référence projet

- E-mail site : `memoire.presence.contact@gmail.com`  
- Domaine prévu : `https://www.memoire-et-presence.fr/`

