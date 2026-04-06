# Setup — Assistant Claude pour Gmail
## Mémoire & Présence · 15 minutes, zéro abonnement

---

## Étape 1 — Obtenir une clé API Anthropic (Claude)

1. Aller sur **console.anthropic.com**
2. Créer un compte (ou se connecter)
3. Menu **API Keys** → **Create Key**
4. Copier la clé (commence par `sk-ant-...`)
5. Recharger quelques crédits (environ **5€** suffisent pour des centaines de réponses)
   - Modèle utilisé : `claude-3-5-haiku` ≈ **0,001€ par réponse**

---

## Étape 2 — Créer le script Google Apps Script

1. Aller sur **script.google.com** (connecté avec `memoirepresence@gmail.com`)
2. Cliquer **Nouveau projet**
3. Nommer le projet : `Mémoire & Présence — Assistant Claude`
4. **Supprimer** le code vide dans l'éditeur
5. **Copier-coller** tout le contenu de `claude-gmail-assistant.js`
6. Ligne 12 : remplacer `sk-ant-XXXXXXXX` par ta vraie clé API

---

## Étape 3 — Autoriser les permissions

1. Dans l'éditeur, sélectionner la fonction `installTrigger` dans le menu déroulant
2. Cliquer **Exécuter** ▶️
3. Google demandera des autorisations → **Autoriser**
   - Accès à Gmail : pour lire les emails Netlify et créer des brouillons
   - Accès réseau : pour appeler l'API Claude
4. Valider avec ton compte Google

---

## Étape 4 — Tester

1. Sélectionner la fonction `testAvecDonnesFictives`
2. Cliquer **Exécuter** ▶️
3. Aller dans **Gmail → Brouillons**
4. Un brouillon doit apparaître avec la réponse de Claude

---

## Étape 5 — Activer le déclencheur automatique

1. Sélectionner la fonction `installTrigger`
2. Cliquer **Exécuter** ▶️
3. C'est tout — le script vérifie maintenant Gmail **toutes les 5 minutes**

---

## Fonctionnement au quotidien

```
Client remplit le formulaire (contact / devis / accompagnement)
         ↓
Netlify envoie un email à memoirepresence@gmail.com
         ↓
Apps Script détecte l'email (toutes les 5 min)
         ↓
Claude analyse la demande + détecte le type (contact / devis / accompagnement / vidéo)
         ↓
Un BROUILLON de réponse apparaît dans Gmail
         ↓
Lauralie lit, retouche si besoin, et envoie
```

---

## Ce que Claude fait automatiquement

| Type de formulaire | Ce que Claude génère |
|-------------------|---------------------|
| **Contact simple** | Réponse chaleureuse courte, proposition d'appel |
| **Demande de devis** | Accusé réception, questions précises si infos manquantes |
| **Formulaire accompagnement** | Réponse personnalisée citant le nom de la personne honorée |
| **Vidéo hommage** | Mention de Michaël, demande des éléments disponibles |

---

## Coût estimé

| Volume | Coût Claude |
|--------|------------|
| 10 demandes/mois | ~0,01€ |
| 50 demandes/mois | ~0,05€ |
| 200 demandes/mois | ~0,20€ |

Le modèle `claude-3-5-haiku` est conçu pour ce type de tâche : rapide, précis, très économique.

---

## Dépannage

**Aucun brouillon créé ?**
- Vérifier que la clé API est correcte (ligne 12 du script)
- Vérifier que `installTrigger` a bien été exécuté
- Aller dans **Exécutions** (menu gauche) pour voir les logs

**Erreur "Authorization required" ?**
- Réexécuter `installTrigger` et autoriser les permissions Gmail

**Claude répond en anglais ?**
- Normal si le test est mal formé — en production avec un vrai formulaire français, il répond en français
