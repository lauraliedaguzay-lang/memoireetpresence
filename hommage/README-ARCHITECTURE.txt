Architecture pages hommage — Mémoire & Présence
================================================

Structure
---------
- Un dossier par hommage : hommage/<slug>/
  Exemple : hommage/famille-martin/
- Fichier principal : index.html dans ce dossier.
- Styles partagés : hommage/shared/hommage.css
- Script porte d’accès (démo) : hommage/shared/hommage-gate.js

Dupliquer un nouvel hommage
---------------------------
1. Copier hommage/famille-martin/ vers hommage/<nouveau-slug>/.
2. Dans index.html :
   - data-hommage-slug="<nouveau-slug>" sur <body>
   - window.HOMMAGE_ACCESS_CODE = "votre-code" (démo uniquement — voir sécurité)
   - Adapter titre, meta description, contenu dans #hommage-content.
3. QR code : pointer vers l’URL absolue
   https://www.memoire-et-presence.fr/hommage/<nouveau-slug>/
4. robots.txt exclut déjà /hommage/ ; garder <meta name="robots" content="noindex, nofollow"> sur chaque page client si souhaité.

Sécurité (important)
--------------------
La vérification par JavaScript + sessionStorage est une démonstration front.
Toute personne peut lire le code dans le navigateur. En production, prévoir :
- authentification côté serveur (Basic Auth, cookie signé, edge function, etc.)
- ou hébergement des pages hommage derrière un service qui impose le mot de passe.

Liens site public
-----------------
Ajouter « Exemple d’hommage » uniquement vers une page de démo (comme famille-martin),
pas vers les pages clients réelles.
