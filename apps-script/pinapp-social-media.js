/**
 * Pinapp — Générateur de contenu social media
 * Google Apps Script — coller dans script.google.com (compte lauralie.daguzay@gmail.com)
 *
 * Même architecture que M&P mais adapté à pinapp :
 *   - Email : lauralie.daguzay@gmail.com
 *   - Pas de Michaël (pas de vidéo)
 *   - Prompt et thèmes à compléter selon la charte pinapp
 *
 * Flux : Lundi 8h → 7 posts générés → critique 5 agents → Google Doc → notif push
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG_SM_PP = {
  CLAUDE_API_KEY  : 'sk-ant-XXXXXXXX',            // ← même clé Anthropic
  CLAUDE_MODEL    : 'claude-3-5-sonnet-20241022',  // Sonnet pour la créativité
  MON_EMAIL       : 'lauralie.daguzay@gmail.com',
  DOC_FOLDER_ID   : 'XXXXXXXX',                   // ← ID dossier Google Drive pinapp
  MAX_TOKENS      : 4000,

  SCHEDULE: {
    instagram : ['Mardi 9h30', 'Jeudi 18h30', 'Samedi 10h00'],
    tiktok    : ['Mercredi 19h00', 'Vendredi 20h00'],
    stories   : ['Lundi 8h00', 'Mercredi 12h00'],
  },

  // Thèmes rotatifs pinapp — à personnaliser selon le service
  // ⚠️ À COMPLÉTER quand la description de pinapp est définie
  THEMES: [
    'decouverte_service',     // ← À renommer selon l'offre pinapp
    'temoignage_client',
    'coulisses_creation',
    'valeur_principale',
    'faq_objection',
    'saisonnier',
    'avant_apres',
    'expertise_metier',
  ],

  // ⚠️ Palette à compléter selon la charte pinapp
  PALETTE: {
    fond    : '#F7F4EF',      // ← À remplacer par la couleur pinapp
    accent  : '#6E8870',      // ← À remplacer
    texte   : '#2C3E41',      // ← À remplacer
  },
};

// ─── PROMPT SYSTÈME ───────────────────────────────────────────────────────────
// ⚠️ COMPLÉTER la section PINAPP CONTEXTE dès que le service est défini

const SM_SYSTEM_PROMPT_PP = `Tu es le directeur créatif de Pinapp pour les réseaux sociaux.

??????????????????????
PINAPP CONTEXTE
??????????????????????
[À COMPLÉTER : description du service pinapp]
[À COMPLÉTER : cible client]
[À COMPLÉTER : valeurs de la marque]
[À COMPLÉTER : ton éditorial — ex: moderne, jeune, professionnel, etc.]

CHARTE ÉDITORIALE RÉSEAUX SOCIAUX :
- Ton : [À COMPLÉTER selon la marque pinapp]
- Jamais de tarifs sur les posts publics
- Jamais de formules génériques
- Max 3 emojis par post
- Palette : [À COMPLÉTER avec les couleurs pinapp]
- Police pour les visuels : [À COMPLÉTER]

???????????????????????????????
STRUCTURE OBLIGATOIRE PAR POST
???????????????????????????????

---POST [N]---
PLATEFORME : Instagram / TikTok / Story Instagram
HORAIRE SUGGÉRÉ : [jour et heure]
THÈME : [thème de la semaine]
VISUEL : [description précise Canva — couleurs, texte, disposition]
LÉGENDE : [texte complet, sauts de ligne inclus]
HASHTAGS : [max 20 IG / 5 TikTok]
HOOK TIKTOK : [si TikTok : première phrase percutante à dire]
CTA : [appel à action discret]
---FIN POST [N]---

???????????????????????????????
RÉUNION CRITIQUE 5 AGENTS
???????????????????????????????

Après les posts, simuler la réunion critique :


FORMAT TIKTOK — SCRIPT COMPLET
Durée cible : 45-75 secondes. Filmable avec smartphone.

===TIKTOK_[N]===
HORAIRE : [Mercredi/Vendredi + heure]
DURÉE : [X secondes]

HOOK (0:00-0:05) :
[Phrase exacte percutante. Pas de "POV:" ni clichés.]
[Indication caméra : angle, expression, geste]

PLAN DE TOURNAGE :
Scène 1 — [0:00-0:xx]
  PAROLE  : "[Texte exact]"
  VISUEL  : [Ce qu'on voit — plan, B-roll, objet]
  DÉCOR   : [Où filmer]
  NOTE    : [Ton, émotion]
[Répéter pour chaque scène]

INCRUSTÉS : [Timecode] → "[Texte]" — police, couleur
SON : [Style musical, volume, son tendance ou non]
MONTAGE : [Rythme, transitions, points de coupe]

LÉGENDE : [50-100 mots, hook fort]
HASHTAGS : [5-8 ciblés]
===FIN_TIKTOK_[N]===

FORMAT STORY
===STORY_[N]===
DIRECTION VISUELLE : [1080×1920, fond, texte, sticker interactif]
TEXTE : [Max 2 lignes]
LIEN : [URL si applicable]
===FIN_STORY_[N]===

RÉUNION CRITIQUE — 12 AGENTS
===REUNION_CRITIQUE===
[Chaque agent analyse TOUS les posts]

Agent Direction Artistique Premium → visuels premium ou cheap ? Verdict + corrections.
Agent Copywriting Émotionnel → légendes sincères ? Réécriture si nécessaire.
Agent Cohérence Marque Pinapp → alignement avec les valeurs pinapp ? Veto si non.
Agent Luxe & Raffinement → qu'est-ce qui est sobre vs qu'est-ce qui fait "template" ?
Agent Scène Visuelle → directions Canva réalisables et beaux plans TikTok ?
Agent Émotion Utilisateur → ce que ressent la cible en voyant chaque post ?
Agent Business Premium → ces posts positionnent-ils pinapp comme service premium ?
Agent Performance Réseaux → score portée 1-10, hashtags, horaire optimal.
Agent SEO Éditorial → mots-clés, originalité, anti-doublon.
Agent UX Premium → chaque post donne-t-il envie de cliquer / sauvegarder ?
Agent Cohérence Multi-Canaux → cohérence avec le site et les emails clients ?
Agent Secteur → rien qui choque ou qui soit hors-sujet pour la cible ?

VERDICT FINAL : posts approuvés / à corriger / retirés · note globale /10
===FIN_REUNION===`;

// ─── GÉNÉRATEUR HEBDOMADAIRE ──────────────────────────────────────────────────

function generateWeeklyContent_PP() {
  const now      = new Date();
  const weekNum  = Math.ceil(now.getDate() / 7);
  const themeIdx = (now.getMonth() * 5 + weekNum) % CONFIG_SM_PP.THEMES.length;
  const theme    = CONFIG_SM_PP.THEMES[themeIdx];
  const dateStr  = now.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });

  Logger.log(`[Pinapp] Génération contenu semaine du ${dateStr} — thème : ${theme}`);

  const userMsg = `Semaine du ${dateStr}. Thème : ${theme}.\n\nGénère le planning complet :\n- 3 posts Instagram\n- 2 posts TikTok\n- 2 Stories\n\nPuis la réunion critique 5 agents.`;

  const output          = _callClaudeSM_PP(userMsg);
  const { posts, critique } = _parseSMOutput_PP(output);
  const docUrl          = _createWeeklyDoc_PP(dateStr, theme, posts, critique);

  MailApp.sendEmail({
    to     : CONFIG_SM_PP.MON_EMAIL,
    subject: `📱 Pinapp — Contenu semaine prêt — ${dateStr}`,
    body   : `Planning social media Pinapp prêt.\n\nThème : ${theme}\nPosts : ${posts.length}\n\nDoc : ${docUrl}\n\n→ Valider, créer les visuels Canva, programmer dans Buffer/Later.`
  });

  Logger.log(`✅ [Pinapp] Doc semaine créé : ${docUrl}`);
}

// ─── APPEL CLAUDE ─────────────────────────────────────────────────────────────

function _callClaudeSM_PP(userContent) {
  if (CONFIG_SM_PP.CLAUDE_API_KEY === 'sk-ant-XXXXXXXX')
    throw new Error('⚠️ Remplace la clé API dans CONFIG_SM_PP ligne 14');

  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method            : 'post',
    headers           : {
      'x-api-key'        : CONFIG_SM_PP.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type'     : 'application/json'
    },
    payload           : JSON.stringify({
      model     : CONFIG_SM_PP.CLAUDE_MODEL,
      max_tokens: CONFIG_SM_PP.MAX_TOKENS,
      system    : SM_SYSTEM_PROMPT_PP,
      messages  : [{ role: 'user', content: userContent }]
    }),
    muteHttpExceptions: true
  });

  const r = JSON.parse(res.getContentText());
  if (r.error) throw new Error(`Claude Pinapp SM : ${r.error.message}`);
  return r.content?.[0]?.text || '';
}

// ─── PARSING + DOC ────────────────────────────────────────────────────────────

function _parseSMOutput_PP(text) {
  const postMatches = [...text.matchAll(/---POST \d+---([\s\S]*?)---FIN POST \d+---/g)];
  const posts       = postMatches.map(m => m[1].trim());
  const critiqueM   = text.match(/
FORMAT TIKTOK — SCRIPT COMPLET
Durée cible : 45-75 secondes. Filmable avec smartphone.

===TIKTOK_[N]===
HORAIRE : [Mercredi/Vendredi + heure]
DURÉE : [X secondes]

HOOK (0:00-0:05) :
[Phrase exacte percutante. Pas de "POV:" ni clichés.]
[Indication caméra : angle, expression, geste]

PLAN DE TOURNAGE :
Scène 1 — [0:00-0:xx]
  PAROLE  : "[Texte exact]"
  VISUEL  : [Ce qu'on voit — plan, B-roll, objet]
  DÉCOR   : [Où filmer]
  NOTE    : [Ton, émotion]
[Répéter pour chaque scène]

INCRUSTÉS : [Timecode] → "[Texte]" — police, couleur
SON : [Style musical, volume, son tendance ou non]
MONTAGE : [Rythme, transitions, points de coupe]

LÉGENDE : [50-100 mots, hook fort]
HASHTAGS : [5-8 ciblés]
===FIN_TIKTOK_[N]===

FORMAT STORY
===STORY_[N]===
DIRECTION VISUELLE : [1080×1920, fond, texte, sticker interactif]
TEXTE : [Max 2 lignes]
LIEN : [URL si applicable]
===FIN_STORY_[N]===

RÉUNION CRITIQUE — 12 AGENTS
===REUNION_CRITIQUE===
[Chaque agent analyse TOUS les posts]

Agent Direction Artistique Premium → visuels premium ou cheap ? Verdict + corrections.
Agent Copywriting Émotionnel → légendes sincères ? Réécriture si nécessaire.
Agent Cohérence Marque Pinapp → alignement avec les valeurs pinapp ? Veto si non.
Agent Luxe & Raffinement → qu'est-ce qui est sobre vs qu'est-ce qui fait "template" ?
Agent Scène Visuelle → directions Canva réalisables et beaux plans TikTok ?
Agent Émotion Utilisateur → ce que ressent la cible en voyant chaque post ?
Agent Business Premium → ces posts positionnent-ils pinapp comme service premium ?
Agent Performance Réseaux → score portée 1-10, hashtags, horaire optimal.
Agent SEO Éditorial → mots-clés, originalité, anti-doublon.
Agent UX Premium → chaque post donne-t-il envie de cliquer / sauvegarder ?
Agent Cohérence Multi-Canaux → cohérence avec le site et les emails clients ?
Agent Secteur → rien qui choque ou qui soit hors-sujet pour la cible ?

VERDICT FINAL : posts approuvés / à corriger / retirés · note globale /10
===FIN_REUNION===/);
  const critique    = critiqueM ? critiqueM[1].trim() : '[Critique non générée]';
  return { posts, critique };
}

function _createWeeklyDoc_PP(dateStr, theme, posts, critique) {
  const title = `Pinapp — Contenu social ${dateStr} — ${theme}`;
  const doc   = DocumentApp.create(title);
  const body  = doc.getBody();

  body.appendParagraph(`📱 PINAPP — PLANNING SOCIAL ${dateStr}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Thème : ${theme}`).setItalic(true);
  body.appendParagraph(' ');

  body.appendParagraph('HORAIRES').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(`Instagram : ${CONFIG_SM_PP.SCHEDULE.instagram.join(' · ')}`);
  body.appendParagraph(`TikTok    : ${CONFIG_SM_PP.SCHEDULE.tiktok.join(' · ')}`);
  body.appendParagraph(`Stories   : ${CONFIG_SM_PP.SCHEDULE.stories.join(' · ')}`);
  body.appendParagraph(' ');

  body.appendParagraph('POSTS').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  posts.forEach((post, i) => {
    body.appendParagraph(`Post ${i + 1}`).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(post);
    body.appendParagraph(' ');
  });

  body.appendParagraph('RÉUNION CRITIQUE').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(critique);
  body.appendParagraph(' ');

  body.appendParagraph('CHECKLIST AVANT PUBLICATION').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  ['Corrections agents appliquées', 'Visuels Canva créés', 'Relecture ton', 'Programmé Buffer/Later'].forEach(i => {
    body.appendParagraph(`☐  ${i}`);
  });

  doc.saveAndClose();

  if (CONFIG_SM_PP.DOC_FOLDER_ID !== 'XXXXXXXX') {
    const file   = DriveApp.getFileById(doc.getId());
    const folder = DriveApp.getFolderById(CONFIG_SM_PP.DOC_FOLDER_ID);
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  }

  return doc.getUrl();
}

// ─── INSTALLATION ─────────────────────────────────────────────────────────────

/** Appeler une seule fois — génération chaque lundi 8h. */
function installSMTrigger_PP() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'generateWeeklyContent_PP')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('generateWeeklyContent_PP')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  Logger.log('✅ [Pinapp] Trigger social media installé — génération chaque lundi 8h.');
  Logger.log('   ⚠️ Compléter SYSTEM_PROMPT_PP avec la description du service pinapp avant de lancer.');
}

/** Test manuel. */
function testSMGeneration_PP() {
  Logger.log('[Pinapp] Test génération contenu social media...');
  generateWeeklyContent_PP();
}
