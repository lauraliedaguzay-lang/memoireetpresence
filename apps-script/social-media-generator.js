/**
 * Mémoire & Présence — Générateur de contenu social media
 * Google Apps Script — coller dans script.google.com
 *
 * Flux hebdomadaire :
 *   Lundi 8h → Claude génère 7 posts (3 IG + 2 TikTok + 2 Reels/Stories)
 *             → Réunion critique multi-agents (simul. par Claude)
 *             → Brouillon Google Doc envoyé à Lauralie pour validation
 *             → Notif push téléphone
 *
 * Scheduling optimal M&P :
 *   Instagram : Mardi 9h30, Jeudi 18h30, Samedi 10h
 *   TikTok    : Mercredi 19h, Vendredi 20h
 *   Stories   : Lundi 8h, Mercredi 12h
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG_SM = {
  CLAUDE_API_KEY  : 'sk-ant-XXXXXXXX',           // ← même clé Anthropic
  CLAUDE_MODEL    : 'claude-3-5-sonnet-20241022', // Sonnet pour la créativité
  MON_EMAIL       : 'memoirepresence@gmail.com',
  DOC_FOLDER_ID   : 'XXXXXXXX',                  // ← ID dossier Google Drive pour les docs semaine
  MAX_TOKENS      : 4000,

  // Horaires de publication optimaux (info uniquement — copier-coller dans Buffer/Later)
  SCHEDULE: {
    instagram : ['Mardi 9h30', 'Jeudi 18h30', 'Samedi 10h00'],
    tiktok    : ['Mercredi 19h00', 'Vendredi 20h00'],
    stories   : ['Lundi 8h00', 'Mercredi 12h00'],
  },

  // Thèmes rotatifs (1 par semaine, cycle de 8)
  THEMES: [
    'plaque_qr_decouverte',   // Découverte du produit
    'histoire_famille',        // Témoignage fictif / récit humain
    'coulisses_creation',      // Behind the scenes (Michaël + Lauralie au travail)
    'valeur_discrétion',       // Une de nos 4 valeurs
    'faq_objection',           // Une question fréquente / idée reçue
    'saisonnier',              // Contenu lié à la saison / date du calendrier
    'avant_apres_concept',     // Avant : une plaque froide / Après : QR + page
    'hommage_metier',          // Hommage à un type de métier (jardinier, prof, etc.)
  ],
};

// ─── PROMPT SYSTÈME — CRÉATEUR DE CONTENU ────────────────────────────────────

const SM_SYSTEM_PROMPT = `Tu es le directeur créatif de Mémoire & Présence pour les réseaux sociaux.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÉMOIRE & PRÉSENCE — IDENTITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Studio créant des hommages numériques : pages souvenir privées + plaques QR gravées.
Fondateurs : Michaël (vidéaste) + Lauralie (créatrice visuelle et accompagnante).
Valeurs : discrétion, soin, durabilité, rythme humain.
Cible : familles en deuil ou anticipant un hommage. Toute la France. 100% à distance.

CHARTE ÉDITORIALE RÉSEAUX SOCIAUX :
- Ton : sobre, humain, jamais commercial
- Jamais de tarifs sur les posts publics
- Jamais de "like et abonne-toi" ou de formules TikTok génériques
- Jamais d'emojis en excès (max 3 par post)
- Jamais de photos de défunts réels
- Toujours une promesse de discrétion et de dignité
- Les visuels sont sable + vert sauge + blanc — jamais flashy
- Police : Cormorant Garamond pour les titres sur visuels

━━━━━━━━━━━━━━━━━━━━━━━━━━━
CE QUE TU DOIS PRODUIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pour chaque post, produire le bloc suivant :

---POST [N]---
PLATEFORME : Instagram / TikTok / Story Instagram
HORAIRE SUGGÉRÉ : [jour et heure]
THÈME : [thème de la semaine]
VISUEL : [description précise du visuel à créer dans Canva — couleurs, texte incrusté, disposition, photo de fond suggérée]
LÉGENDE : [texte complet prêt à copier-coller, avec sauts de ligne]
HASHTAGS : [liste des hashtags, séparés par espace, max 20 pour IG, 5 pour TikTok]
HOOK TIKTOK : [si TikTok : première phrase parlée à dire dans la vidéo, percutante et sincère]
CTA : [appel à l'action discret en fin de post]
---FIN POST [N]---

━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÉUNION CRITIQUE MULTI-AGENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Après avoir généré tous les posts, simuler une réunion critique en 5 agents :

===CRITIQUE_AGENTS===

🎨 AGENT DIRECTION ARTISTIQUE (Apple Premium)
Vérifie : cohérence palette, typographie, composition, premium vs cheap.
Donne un verdict pour chaque post : ✅ Approuvé / ⚠️ À corriger / ❌ Refus

🖋️ AGENT COPYWRITING ÉMOTIONNEL
Vérifie : accroche, émotion, sincérité, absence de formules creuses.
Donne un verdict + une reformulation si nécessaire.

🕊️ AGENT SECTEUR FUNÉRAIRE / SENSIBILITÉ
Vérifie : ton digne, rien qui pourrait blesser une famille en deuil, pas de banalisation.
Point de veto absolu : si un post est indigne, il est retiré.

📊 AGENT PERFORMANCE RÉSEAUX
Vérifie : hook efficace, CTA clair, hashtags pertinents, horaire optimal.
Donne un score de portée estimée (1–10) pour chaque post.

✅ VERDICT FINAL
Résumé : X posts approuvés / Y à corriger / Z retirés.
Liste des corrections à faire avant publication.

===FIN_CRITIQUE===`;

// ─── GÉNÉRATEUR HEBDOMADAIRE ──────────────────────────────────────────────────

function generateWeeklyContent() {
  const now        = new Date();
  const weekNum    = Math.ceil(now.getDate() / 7);
  const themeIdx   = (now.getMonth() * 5 + weekNum) % CONFIG_SM.THEMES.length;
  const theme      = CONFIG_SM.THEMES[themeIdx];
  const dateStr    = now.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });

  Logger.log(`Génération contenu semaine du ${dateStr} — thème : ${theme}`);

  const userMessage = _buildSMMessage(theme, dateStr);
  const output      = _callClaudeSM(userMessage);

  const { posts, critique } = _parseSMOutput(output);

  // Créer le Google Doc de la semaine
  const docUrl = _createWeeklyDoc(dateStr, theme, posts, critique);

  // Notif push
  MailApp.sendEmail({
    to     : CONFIG_SM.MON_EMAIL,
    subject: `📱 Contenu semaine prêt — ${dateStr}`,
    body   : `Le planning de contenu social media de la semaine est prêt.\n\nThème : ${theme}\nPosts générés : ${posts.length}\n\nDoc Google : ${docUrl}\n\n→ Ouvrir le doc, valider ou corriger, puis programmer dans Buffer/Later.`
  });

  Logger.log(`✅ Contenu semaine généré — doc : ${docUrl}`);
}

// ─── MESSAGE UTILISATEUR ──────────────────────────────────────────────────────

function _buildSMMessage(theme, dateStr) {
  const themeDescriptions = {
    'plaque_qr_decouverte'  : 'Faire découvrir le concept plaque + QR code : comment ça marche, ce que ça apporte, pourquoi c\'est différent des plaques classiques.',
    'histoire_famille'      : 'Raconter une histoire fictive et émouvante d\'une famille qui a utilisé le service. Noms inventés, détails authentiques.',
    'coulisses_creation'    : 'Montrer le travail de Michaël et Lauralie en coulisses : montage vidéo, gravure d\'une plaque, mise en page d\'une page hommage.',
    'valeur_discrétion'     : 'Mettre en avant la valeur discrétion : les données ne sortent jamais, pas de publicité, pas de revente.',
    'faq_objection'         : 'Répondre à une idée reçue : "c\'est trop technologique pour un hommage", "ça ne remplace pas une vraie plaque", etc.',
    'saisonnier'            : `Contenu adapté à la période actuelle (${dateStr}). Toussaint, fête des mères, début d'année... selon la date.`,
    'avant_apres_concept'   : 'Contraste entre une plaque classique (froide, anonyme) et une plaque M&P (QR + page + histoire). Pas de jugement sur les plaques classiques.',
    'hommage_metier'        : 'Hommage à un type de métier ou de passion : "Ceux qui ont consacré leur vie à l\'enseignement méritent une page aussi riche que leur carrière."',
  };

  return `Semaine du ${dateStr}.
Thème : ${theme}
Description : ${themeDescriptions[theme] || theme}

Génère le planning de contenu complet pour cette semaine :
- 3 posts Instagram (légendes longues, 150-300 mots, hashtags)
- 2 posts TikTok (légendes courtes 50-100 mots + hook parlé + 5 hashtags)
- 2 Stories Instagram (texte court, 1-2 phrases max, visuel fort)

Puis simule la réunion critique multi-agents sur ces posts.`;
}

// ─── APPEL CLAUDE ─────────────────────────────────────────────────────────────

function _callClaudeSM(userContent) {
  if (CONFIG_SM.CLAUDE_API_KEY === 'sk-ant-XXXXXXXX')
    throw new Error('⚠️ Remplace la clé API dans CONFIG_SM');

  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method            : 'post',
    headers           : {
      'x-api-key'        : CONFIG_SM.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type'     : 'application/json'
    },
    payload           : JSON.stringify({
      model     : CONFIG_SM.CLAUDE_MODEL,
      max_tokens: CONFIG_SM.MAX_TOKENS,
      system    : SM_SYSTEM_PROMPT,
      messages  : [{ role: 'user', content: userContent }]
    }),
    muteHttpExceptions: true
  });
  const r = JSON.parse(res.getContentText());
  if (r.error) throw new Error(`Claude SM : ${r.error.message}`);
  return r.content?.[0]?.text || '';
}

// ─── PARSING OUTPUT ───────────────────────────────────────────────────────────

function _parseSMOutput(text) {
  const postMatches = [...text.matchAll(/---POST \d+---([\s\S]*?)---FIN POST \d+---/g)];
  const posts       = postMatches.map(m => m[1].trim());
  const critiqueM   = text.match(/===CRITIQUE_AGENTS===([\s\S]*?)===FIN_CRITIQUE===/);
  const critique    = critiqueM ? critiqueM[1].trim() : '[Critique non générée]';
  return { posts, critique };
}

// ─── CRÉATION DU GOOGLE DOC ───────────────────────────────────────────────────

function _createWeeklyDoc(dateStr, theme, posts, critique) {
  const title   = `M&P — Contenu social ${dateStr} — ${theme}`;
  const doc     = DocumentApp.create(title);
  const body    = doc.getBody();

  body.appendParagraph(`📱 PLANNING SOCIAL MEDIA — ${dateStr}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Thème : ${theme}`).setItalic(true);
  body.appendParagraph(' ');

  body.appendParagraph('HORAIRES DE PUBLICATION SUGGÉRÉS').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(`Instagram : ${CONFIG_SM.SCHEDULE.instagram.join(' · ')}`);
  body.appendParagraph(`TikTok : ${CONFIG_SM.SCHEDULE.tiktok.join(' · ')}`);
  body.appendParagraph(`Stories : ${CONFIG_SM.SCHEDULE.stories.join(' · ')}`);
  body.appendParagraph(' ');

  body.appendParagraph('POSTS GÉNÉRÉS').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  posts.forEach((post, i) => {
    body.appendParagraph(`POST ${i + 1}`).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(post);
    body.appendParagraph(' ');
  });

  body.appendParagraph('RÉUNION CRITIQUE AGENTS').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(critique);

  body.appendParagraph(' ');
  body.appendParagraph('✅ CHECKLIST AVANT PUBLICATION').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  ['Corrections des agents appliquées', 'Visuel Canva créé selon les specs', 'Relecture ton et sensibilité', 'Programmé dans Buffer/Later aux bons horaires', 'Stories programmées séparément'].forEach(item => {
    body.appendParagraph(`☐  ${item}`);
  });

  doc.saveAndClose();

  // Déplacer dans le bon dossier si configuré
  if (CONFIG_SM.DOC_FOLDER_ID !== 'XXXXXXXX') {
    const file   = DriveApp.getFileById(doc.getId());
    const folder = DriveApp.getFolderById(CONFIG_SM.DOC_FOLDER_ID);
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  }

  return doc.getUrl();
}

// ─── INSTALLATION ─────────────────────────────────────────────────────────────

/** Appeler une seule fois — génération automatique chaque lundi à 8h. */
function installSMTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'generateWeeklyContent')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('generateWeeklyContent')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  Logger.log('✅ Trigger social media installé — génération chaque lundi à 8h.');
}

/** Test manuel — génère le contenu maintenant sans attendre lundi. */
function testSMGeneration() {
  Logger.log('Test génération contenu social media...');
  generateWeeklyContent();
}
