# Setup — Assistant Claude pour Gmail
## Mémoire & Présence · 15 minutes · Zéro abonnement

---

## Ce que tu vas avoir dans chaque brouillon

Quand un client remplit un formulaire, tu reçois un brouillon Gmail structuré comme ça :

```
[Texte de réponse prêt à envoyer au client]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 ANALYSE CONFIDENTIELLE — POUR LAURALIE SEULEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STADE DU CLIENT : DEUIL RÉCENT — INTÉRESSÉE
💡 CE QU'ELLE CHERCHE : un hommage pour sa mère décédée il y a 3 semaines,
   avec une urgence implicite (date d'anniversaire ?)
⚡ OPPORTUNITÉ : elle a déjà les photos, veut agir rapidement
⚠️ POINTS D'ATTENTION : deuil très récent — ne pas pousser à commander,
   l'écouter d'abord
🎯 OBJECTIF : décrocher un appel pour comprendre son projet
📋 PROCHAINES ÉTAPES :
   • Étape 1 (cette réponse) : répondre chaleureusement, proposer un appel
   • Étape 2 (J+3 si pas de réponse) : relancer avec "avez-vous eu le temps..."
   • Étape 3 (après appel) : envoyer devis dans les 24h
💬 TON : Très doux, priorité à l'écoute sur la vente
```

Tu lis l'analyse → tu ajustes le brouillon si besoin → tu envoies.

---

## Étape 1 — Clé API Anthropic (Claude)

1. Aller sur **console.anthropic.com**
2. Créer un compte → **API Keys** → **Create Key**
3. Copier la clé (commence par `sk-ant-...`)
4. Recharger **5€** de crédits (suffisant pour des centaines de réponses)
   → Coût réel : ~0,001€ par brouillon généré

---

## Étape 2 — Créer le script

1. Aller sur **script.google.com** (connecté avec `memoirepresence@gmail.com`)
2. **Nouveau projet** → nommer : `MP — Assistant Claude`
3. Supprimer le code vide → coller le contenu de `claude-gmail-assistant.js`
4. **Ligne 12** : remplacer `sk-ant-XXXXXXXX` par ta vraie clé

---

## Étape 3 — Autoriser les accès

1. Menu déroulant → sélectionner `installTrigger` → cliquer ▶️ **Exécuter**
2. Google demande les autorisations → **Autoriser**
   - Gmail : lire les emails Netlify + créer des brouillons
   - Réseau : appeler l'API Claude

---

## Étape 4 — Tester avant le vrai

Lance ces 3 tests depuis l'éditeur pour voir différents scénarios :

| Fonction | Simule |
|----------|--------|
| `testAccompagnement` | Fille endeuillée, mère décédée il y a 3 semaines |
| `testDevis` | Homme qui demande un prix directement |
| `testHesitant` | Personne qui doute que le numérique soit adapté |

→ Les brouillons apparaissent dans **Gmail → Brouillons** adressés à ton email.

---

## Étape 5 — Activer l'automatique

Exécuter `installTrigger` → le script tourne toutes les 5 min en arrière-plan.

---

## Ton workflow au quotidien

```
Client remplit un formulaire sur le site
        ↓
Netlify envoie un email à memoirepresence@gmail.com
        ↓  (délai max 5 min)
Brouillon apparaît dans Gmail
        ↓
Tu ouvres le brouillon :
  1. Tu lis l'analyse Claude (confidentielle)
  2. Tu retouches le texte si besoin (ou pas)
  3. Tu supprimes le bloc "ANALYSE CONFIDENTIELLE"
  4. Tu envoies
```

---

## Les 5 stades client que Claude identifie

| Stade | Ce que tu dois faire |
|-------|---------------------|
| **DÉCOUVERTE** | Présenter doucement, ne pas pousser |
| **INTÉRESSÉ** | Proposer un appel ou un devis |
| **PRÊT À COMMANDER** | Envoyer le devis vite, lever les derniers freins |
| **HÉSITANT** | Rassurer sur le point de blocage précis |
| **DEUIL RÉCENT** | Écouter avant tout, pas de vente, juste de l'humanité |

---

## Coût réel

| Demandes / mois | Coût Claude |
|-----------------|------------|
| 10 | ~0,01 € |
| 50 | ~0,05 € |
| 200 | ~0,20 € |
