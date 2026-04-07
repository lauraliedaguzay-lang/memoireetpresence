## Déploiement n8n (VPS Hostinger)

Ce dossier contient une configuration **prête à déployer sur un VPS Hostinger** pour exécuter n8n en production (Docker), avec Postgres + reverse proxy + HTTPS.

### Ce que ça installe
- **n8n** (orchestrateur)
- **Postgres** (base n8n)
- **Traefik** (reverse proxy + certificats Let's Encrypt)

### Pré-requis
- Un VPS Ubuntu (Hostinger)
- Un nom de domaine avec un sous-domaine dédié, ex. `n8n.memoire-et-presence.fr`
- Ports ouverts vers le VPS : **80** et **443**

### Variante sans domaine (temporaire)
Si vous n'avez pas encore de domaine, vous pouvez démarrer n8n en HTTP sur l'IP du VPS (moins sécurisé) :
- Compose : `docker-compose.ip.yml`
- Accès : `http://IP_DU_VPS:5678`

Commandes :

```bash
cp .env.example .env
# éditer .env et définir au minimum POSTGRES_PASSWORD et N8N_ENCRYPTION_KEY
docker compose -f docker-compose.ip.yml up -d
docker compose -f docker-compose.ip.yml ps
```

Quand le domaine est prêt, repasser sur `docker-compose.yml` (Traefik + HTTPS).

### 1) Copier les fichiers sur le VPS
Copier ce dossier `infra/hostinger/` sur le VPS (par ex. dans `/opt/mp/`).

### 2) Configurer les variables d'environnement
Dupliquer le fichier `.env.example` en `.env` et renseigner :
- `N8N_HOST` (ex: `n8n.memoire-et-presence.fr`)
- `N8N_ENCRYPTION_KEY` (obligatoire, long et aléatoire)
- `POSTGRES_PASSWORD` (mot de passe DB)
- `LETSENCRYPT_EMAIL` (email pour Let's Encrypt)
- `TELEGRAM_BOT_TOKEN` (bot Telegram)
- `TELEGRAM_CHAT_ID` (groupe ou DM de Micha)
- `ANTHROPIC_API_KEY` (Claude)

### 3) Démarrer
Depuis ce dossier :

```bash
docker compose pull
docker compose up -d
docker compose ps
```

### 4) Accès
Après propagation DNS + certificat, ouvrir :
- `https://$N8N_HOST/`

### Sauvegardes (minimum)
Les données importantes sont dans les volumes Docker :
- Postgres : `pgdata`
- n8n : `n8n_data`

À minima, mettre en place une sauvegarde quotidienne de `pgdata` (dump) vers un stockage externe.

### Import du workflow “Coach Micha”
Le workflow JSON fourni dans `infra/hostinger/n8n/` s’importe dans n8n via **Workflows → Import from File**.

