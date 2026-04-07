## Workflows n8n — Coach Micha (Telegram + Claude)

Ce dossier contient :

- `workflow-coach-micha.json` : workflow minimal importable
- `prompts/` : prompts Claude prêts (format **ACTION / BOUTONS / ETAT**)

### Hypothèses (MVP)
- Un bot Telegram existe (token dans n8n)
- Un chat_id (DM ou groupe) est connu (Micha)
- Les secrets Anthropic sont configurés dans n8n
- On stocke l'état **dans le workflow** (staticData) pour le MVP.
  - Pour la production, remplacer par un stockage (Postgres/Redis/Google Sheet/Airtable).

### Variables à configurer dans n8n (recommandé via .env du container)
Ce workflow lit les variables d'environnement suivantes :

- `ANTHROPIC_API_KEY` : clé API Anthropic
- `CLAUDE_SYSTEM_PROMPT` : contenu de `prompts/claude-system.txt`
- `CLAUDE_USER_TEMPLATE` : contenu de `prompts/claude-user-template.txt`

Telegram :
- `TELEGRAM_CREDENTIAL_ID` : ID des credentials Telegram dans n8n (champ interne n8n).  
  - Alternative simple : après import, ouvrir le workflow et sélectionner manuellement les credentials Telegram sur les nodes Telegram.

### Ce que fait le workflow
- Reçoit des messages Telegram **et** des clics sur les boutons (callback)
- Déduit le contexte (start / progression / blocage)
- Appelle Claude avec un prompt très contraint
- Répond sur Telegram avec **une seule action** + **boutons**

### Import
Dans n8n : **Workflows → Import from File** puis activer le workflow.

