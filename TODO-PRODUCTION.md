# TODO — Mise en production · Mémoire & Présence
> Généré le 06/04/2026 · Site : lauraliedaguzay-lang.github.io/memoireetpresence/

---

## 🔴 BLOQUANT — Ne pas mettre en production sans ça

### 1. Informations légales (toi → moi 5 min)
**Fichiers concernés :** `mentions-legales.html` (6 placeholders) + footer de 18 pages HTML

Ce qu'il faut me fournir :
- [ ] **Raison sociale** (ex. "Mémoire & Présence" ou ton nom si auto-entrepreneur)
- [ ] **Forme juridique** (ex. Entreprise Individuelle, SASU, SAS…)
- [ ] **Adresse du siège** (même une boîte postale ou adresse perso)
- [x] **SIRET** : 52388489800017
- [x] **SIREN** : 523884898
- [x] **Nom du directeur de publication** : Michael Bouilhac

> Je remplis tout en une passe automatique dès réception.

---

### 2. Durée d'hébergement dans les CGV (toi → moi 1 ligne)
**Fichier :** `cgv.html` L93

Placeholder actuel :
```
L'hébergement de la page hommage est inclus pour une durée de [À PRÉCISER : ex. 5 ans renouvelables].
```
Décide d'une durée (ex. **3 ans**, **5 ans**, **durée indéterminée**) et dis-le moi.

---

## 🟠 VIDÉO — À générer avec IA vidéo

### 3. Vidéo démo "parcours famille" (2 emplacements sur le site)

**Pages concernées :**
- `video-hommage.html` section `#exemple`
- `offre.html` section `#demo`

**Format attendu :** vidéo courte (60–90 sec), hébergée sur YouTube non répertorié ou Vimeo privé, lien à intégrer.

#### Script composé — prêt à soumettre à Runway / Kling / Pika / Sora

```
SCÈNE 1 — 0:00–0:12
Plan large, cimetière calme, lumière dorée de fin d'après-midi.
Une main pose délicatement une gerbe de fleurs blanches devant une plaque en ardoise.
On aperçoit le QR code gravé dans l'angle inférieur droit.
Ambiance : silence, douceur, respect.
Couleurs : ocres, verts moussu, lumière naturelle tamisée.

SCÈNE 2 — 0:12–0:28
Gros plan sur la plaque : lettres gravées + QR code.
Un téléphone entre dans le cadre. La caméra filme le téléphone par-derrière.
L'appareil photo s'ouvre, vise le QR code.
Vibration douce. L'écran s'illumine.

SCÈNE 3 — 0:28–0:50
Écran du téléphone : la page hommage s'ouvre.
Une photo de portrait (personne âgée, sourire doux) apparaît en fondu.
Texte en Cormorant Garamond glisse vers le haut.
Des miniatures photos défilent doucement (galerie).
Ambiance chaleureuse, sable et vert sauge.

SCÈNE 4 — 0:50–1:05
Retour sur le cimetière. Plusieurs membres d'une famille autour de la plaque.
Chacun sort son téléphone. Sourires discrets, émotion retenue.
Plan large qui recule doucement.

SCÈNE 5 — 1:05–1:20
Fondu au noir.
Texte en blanc sur fond sombre : "Mémoire & Présence"
Sous-titre : "Hommages numériques et plaques QR personnalisées"
Site web : memoire-et-presence.fr
```

**Paramètres IA vidéo recommandés :**
- Style : cinématique, handheld léger, naturel
- Palette : sable, vert, lumière naturelle
- Ratio : 16:9
- Durée : 75 secondes
- Pas de texte incrusté (sauf scène finale)
- Musique : douce, cordes acoustiques, sans paroles

**Outils à utiliser (par ordre de qualité) :**
1. **Kling 1.6** (meilleur rendu réaliste) — kling.kuaishou.com
2. **Runway Gen-3** — runwayml.com
3. **Pika 2.0** — pika.art
4. **Sora** (si accès) — openai.com/sora

---

## 🟡 PHOTOS — À générer ou à fournir

### 4. Galerie hommage : 5 photos par page (2 pages)

**Pages :** `hommage/exemple-defunt/` et `hommage/famille-martin/`

Les slides Swiper affichent "Photo 1 … Photo 5" sur fond gris vide.

**Option A — Tu fournis tes propres photos de test** (recommandé pour le demo final)
- 5 photos par page hommage : portrait, moments de vie, nature, objet symbolique

**Option B — Je génère des prompts DALL-E / Flux pour chaque slide**

Prompts prêts pour la page "Claire Fontenay" (libraire, Rennes) :
```
1. "Elderly French woman smiling warmly in a garden, soft afternoon light, film grain, intimate portrait"
2. "Stack of well-worn French novels on a wooden table, warm light, bokeh background"
3. "Coastal Brittany landscape, calm sea, soft golden hour, wide shot"
4. "A chipped teacup on a linen tablecloth, cozy interior, window light"
5. "Autumn leaves on a park path near a library, warm tones, soft focus"
```

Prompts prêts pour la page "André Martin" (menuisier, Lot-et-Garonne) :
```
1. "Elderly French man in a garden, gentle smile, natural light, documentary style"
2. "Wooden workshop interior, tools hanging on wall, sawdust, warm light"
3. "French countryside river at sunset, small fishing boat, golden reflections"
4. "Vegetable garden in Lot-et-Garonne, summer morning, rows of tomatoes"
5. "Old wooden fishing rod leaning against a stone wall"
```

---

### 5. Photos de l'équipe (Michaël + Lauralie)

**Page :** `qui-sommes-nous.html`

Actuellement : texte seul, pas de photo de l'équipe.
Un portrait par personne rendrait la page beaucoup plus humaine et crédible.

**Format attendu :** carré ou portrait 3:4, fond neutre ou extérieur, lumière naturelle
**Noms attendus :** `images/portrait-michael.jpg` et `images/portrait-lauralie.jpg`

> Dès que tu m'envoies les photos, je les intègre avec le bon format CSS.

---

## 🟢 TECHNIQUE — Fait automatiquement par moi sans toi

### 6. Domaine personnalisé (memoire-et-presence.fr)
**État actuel :** le site est sur `lauraliedaguzay-lang.github.io/memoireetpresence/`

Quand tu as le domaine :
- [ ] Configurer DNS chez ton registrar (CNAME → `lauraliedaguzay-lang.github.io`)
- [ ] Activer HTTPS dans les paramètres GitHub Pages
- [ ] Ajouter `CNAME` file dans le repo
- [ ] Mettre à jour les `<link rel="canonical">` et `og:url` dans les 18 pages HTML

> Je génère le fichier CNAME et j'update les URLs canonical en une commande.

---

### 7. Google Search Console
Une fois le domaine actif :
- [ ] Ajouter le site sur search.google.com/search-console
- [ ] Soumettre `sitemap.xml` (à créer — je peux le générer)

---

### 8. Sitemap.xml
**État actuel :** absent

> Je génère `sitemap.xml` en 2 minutes dès que le domaine est confirmé.

---

## 📋 RÉCAPITULATIF — Ce qui dépend de toi vs moi

| Tâche | Qui | Urgence |
|-------|-----|---------|
| SIRET + infos légales | **Toi → moi** | 🔴 Bloquant |
| Durée hébergement CGV | **Toi → moi** | 🔴 Bloquant |
| Générer vidéo IA (script fourni) | **Toi** (Kling/Runway) | 🟠 Avant lancement |
| Intégrer URL vidéo | **Moi** (dès que tu as le lien) | 🟠 Avant lancement |
| Photos galerie hommage | **Toi** ou **IA** (prompts fournis) | 🟡 Pour la démo |
| Photos équipe Michaël + Lauralie | **Toi** | 🟡 Pour la crédibilité |
| Domaine personnalisé | **Toi** (achat) + **Moi** (config) | 🟢 Post-lancement |
| Sitemap.xml | **Moi** | 🟢 Post-domaine |
| Google Search Console | **Toi** (compte) + **Moi** (config) | 🟢 Post-domaine |
