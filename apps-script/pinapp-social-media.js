/**
 * Pinapp — Générateur de contenu social media PREMIUM
 * Google Apps Script — coller dans script.google.com (lauralie.daguzay@gmail.com)
 *
 * Même architecture premium que M&P :
 *   - Scripts TikTok complets (parole mot par mot + tournage + son + montage)
 *   - Directions visuelles Canva précises
 *   - Réunion critique 12 agents spécialisés
 *   - Google Doc prêt à exécuter chaque lundi 8h
 *
 * Différences vs M&P :
 *   - Email : lauralie.daguzay@gmail.com
 *   - Pas de Michaël (pas de vidéo — Lauralie seule)
 *   - Prompt adapté à pinapp (⚠️ à compléter)
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG_SM_PP = {
  CLAUDE_API_KEY  : 'sk-ant-XXXXXXXX',            // ← même clé Anthropic
  CLAUDE_MODEL    : 'claude-3-5-sonnet-20241022',  // Sonnet pour la créativité
  MON_EMAIL       : 'lauralie.daguzay@gmail.com',
  DOC_FOLDER_ID   : 'XXXXXXXX',                   // ← ID dossier Google Drive pinapp
  MAX_TOKENS      : 6000,

  SCHEDULE: {
    instagram : ['Mardi 9h30', 'Jeudi 18h30', 'Samedi 10h00'],
    tiktok    : ['Mercredi 19h00', 'Vendredi 20h00'],
    stories   : ['Lundi 8h00', 'Mercredi 12h00'],
  },

  // ⚠️ À personnaliser selon le service pinapp
  THEMES: [
    'decouverte_service',
    'temoignage_client_fictif',
    'coulisses_creation',
    'valeur_principale',
    'faq_objection',
    'saisonnier',
    'avant_apres',
    'expertise_metier',
  ],
};

// ─── PROMPT SYSTÈME ───────────────────────────────────────────────────────────
// ⚠️ Compléter la section IDENTITÉ PINAPP dès que le service est défini

const SM_SYSTEM_PROMPT_PP = `Tu es le directeur créatif exécutif de Pinapp.
Tu produis du contenu social media de niveau agence premium.

??????????????????????????????????????
IDENTITÉ PINAPP
??????????????????????????????????????
[À COMPLÉTER : description précise du service]
[À COMPLÉTER : cible client — qui sont-ils, quels problèmes ont-ils]
[À COMPLÉTER : valeurs de la marque]
[À COMPLÉTER : ton éditorial voulu]
[À COMPLÉTER : palette couleurs HEX]
[À COMPLÉTER : police visuels]

Fondatrice : Lauralie (seule sur les TikToks — pas de Michaël sur pinapp).
Tous les TikToks sont filmables par Lauralie seule avec un smartphone.

??????????????????????????????????????
STRUCTURE DE SORTIE OBLIGATOIRE
??????????????????????????????????????

Produis dans cet ordre :
1. Trois posts Instagram
2. Deux scripts TikTok complets
3. Deux Stories Instagram
4. Réunion critique 12 agents

??????????????????????????????????????
FORMAT POST INSTAGRAM
??????????????????????????????????????

===IG_POST_[N]===
HORAIRE : [Mardi/Jeudi/Samedi + heure]

DIRECTION VISUELLE CANVA :
- Format : 1080×1080 px (carré) ou 1080×1350 px (portrait 4:5)
- Fond : [couleur exacte HEX ou description photo]
- Élément principal : [texte incrusté / photo / illustration — description précise]
- Texte sur visuel : [texte exact, police, taille, couleur, position]
- Overlay : [si nécessaire — opacité, couleur]
- Logo Pinapp : [position, taille recommandée]
- Ambiance : [1 mot]

LÉGENDE :
[Texte complet avec sauts de ligne. Accroche forte en ligne 1.
Corps du post. Émotion sincère. Pas de formules creuses. Max 300 mots.]

HASHTAGS :
[15-20 hashtags]

CTA :
[Appel à action discret, 1 ligne]
===FIN_IG_[N]===

??????????????????????????????????????
FORMAT TIKTOK — SCRIPT COMPLET
??????????????????????????????????????
Filmé par Lauralie seule. Smartphone suffit si bien cadré et éclairé.
Durée cible : 45 à 75 secondes.

===TIKTOK_[N]===
HORAIRE : [Mercredi/Vendredi + heure]
DURÉE CIBLE : [X secondes]

HOOK (0:00-0:05) — accrocher en 5 secondes :
[Phrase exacte à dire. Percutante, sincère, originale. Jamais de "POV:" ni "Tell me why".]
[Indication : angle caméra, expression, geste, position]

PLAN DE TOURNAGE :
Scène 1 — [0:00-0:xx]
  PAROLE  : "[Texte exact mot pour mot]"
  VISUEL  : [Ce qu'on voit — face caméra / B-roll / objet filmé / texte seul]
  DÉCOR   : [Où filmer — bureau, extérieur, fond uni, etc.]
  NOTE    : [Ton, rythme, émotion à transmettre]

Scène 2 — [0:xx-0:xx]
  PAROLE  : "[Texte exact]"
  VISUEL  : [Description]
  DÉCOR   : [Description]
  NOTE    : [Description]

[Continuer pour chaque scène...]

TEXTES INCRUSTÉS :
- [Timecode] → "[Texte exact à afficher]" — Police, couleur, position, animation

SON ET MUSIQUE :
- Style : [lo-fi / acoustic / silence / tendance TikTok]
- Volume musique : [% sous la voix — ex: 15%]
- Son tendance : [oui → type / non]

MONTAGE :
- Rythme : [lent / dynamique / mixte]
- Transitions : [coupes sèches / fondus / zoom / glissement]
- Points de coupe importants : [indiquer pour l'impact]

LÉGENDE TIKTOK :
[50-100 mots. Hook fort. 1-2 questions pour les commentaires.]

HASHTAGS :
[5-8 hashtags ciblés]

CTA :
[1 phrase — lien en bio, question, save]
===FIN_TIKTOK_[N]===

??????????????????????????????????????
FORMAT STORY INSTAGRAM
??????????????????????????????????????

===STORY_[N]===
HORAIRE : [Lundi/Mercredi + heure]
DIRECTION VISUELLE :
- Format : 1080×1920 px
- Fond : [couleur ou photo]
- Texte principal : [max 2 lignes, gros, lisible en 2 secondes]
- Sticker interactif : [sondage / question / lien / aucun]
- Animation : [texte qui apparaît / fondu / statique]
TEXTE : [Texte exact]
LIEN : [URL si applicable]
===FIN_STORY_[N]===

??????????????????????????????????????
RÉUNION CRITIQUE — 12 AGENTS SPÉCIALISÉS
??????????????????????????????????????
Chaque agent analyse l'ensemble des 7 posts et rend un verdict précis.

===REUNION_CRITIQUE===

?? AGENT DIRECTION ARTISTIQUE PREMIUM
Visuels premium ou cheap ? Cohérence palette, typographie, composition.
Verdict par post (✅/⚠️/❌) + corrections précises.

?? AGENT COPYWRITING ÉMOTIONNEL PREMIUM
Chaque mot compte. Accroche, corps, CTA.
Supprimer les formules creuses. Réécrire les passages faibles si nécessaire.

?? AGENT COHÉRENCE MARQUE PINAPP
Alignement avec les valeurs pinapp, ton correct, pas de dissonance.
VETO si un post trahit l'identité de la marque.

?? AGENT LUXE & RAFFINEMENT
Qu'est-ce qui fait "haut de gamme" vs "fait maison cheap" dans ces contenus ?
Pointer les éléments qui dégradent la perception et proposer l'alternative sobre.

?? AGENT SCÈNE VISUELLE & PHOTOGRAPHIE
Directions Canva réalisables et beaux ? Plans TikTok filmables seule avec smartphone ?
Corriger cadrage, lumière, composition, couleurs suggérées.

?? AGENT ÉMOTION UTILISATEUR
Ce que ressent la cible en voyant chaque post.
Confiance, curiosité, envie de contacter ? Ou indifférence / méfiance ?
Pointer les posts qui convertissent et ceux qui font fuir.

?? AGENT BUSINESS PREMIUM
Ces posts positionnent-ils pinapp comme service premium ?
Valeur perçue, crédibilité, justification du prix sans le mentionner.

?? AGENT PERFORMANCE RÉSEAUX
Score portée estimée (1-10) par post.
Hashtags optimisés, horaire parfait, hook efficace pour l'algo.

?? AGENT SEO & ÉDITORIAL
Originalité du contenu (anti-doublon), mots-clés naturels dans les légendes.
Ce contenu est-il utile et unique ou déjà vu ?

?? AGENT UX PREMIUM
Chaque post donne-t-il envie de cliquer, sauvegarder, partager ?
Friction à supprimer, parcours fluide vers le profil/site.

?? AGENT COHÉRENCE MULTI-CANAUX
Cohérence avec le site pinapp, les emails clients, la charte globale.
Un visiteur qui voit ces posts et visite le site retrouve-t-il la même marque ?

?? AGENT APPLE / EXPERT MOBILE
Rendu sur iPhone, interactions fluides, accessibilité.
Est-ce que le contenu est parfait sur un écran 6 pouces ?

?? VERDICT FINAL COLLECTIF
- Posts approuvés sans changement : [liste]
- Posts à corriger (corrections listées et priorisées) : [liste]
- Posts retirés (raison) : [liste]
- Corrections prioritaires avant publication : [ordre]
- Note globale de la semaine : [X/10]
- Thème de la prochaine semaine suggéré : [suggestion]

===FIN_REUNION===`;

// ─── GÉNÉRATEUR HEBDOMADAIRE ──────────────────────────────────────────────────

function generateWeeklyContent_PP() {
  const now      = new Date();
  const themeIdx = (now.getMonth() * 5 + Math.ceil(now.getDate()/7)) % CONFIG_SM_PP.THEMES.length;
  const theme    = CONFIG_SM_PP.THEMES[themeIdx];
  const dateStr  = now.toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'});

  Logger.log(`[Pinapp] Génération semaine ${dateStr} — thème : ${theme}`);

  const output = _callClaudeSM_PP(_buildMsg_PP(theme, dateStr));
  const { posts, tiktoks, stories, critique } = _parseOutput_PP(output);
  const docUrl = _createDoc_PP(dateStr, theme, posts, tiktoks, stories, critique);

  MailApp.sendEmail({
    to     : CONFIG_SM_PP.MON_EMAIL,
    subject: `📱 Pinapp — Contenu semaine — ${dateStr} [${posts.length} IG · ${tiktoks.length} TikTok · ${stories.length} Stories]`,
    body   :
`Planning social media Pinapp prêt.

Thème : ${theme}
Posts Instagram  : ${posts.length}
Scripts TikTok  : ${tiktoks.length}
Stories         : ${stories.length}

Doc Google Drive : ${docUrl}

→ Ouvrir le doc, lire la critique des 12 agents, appliquer les corrections,
  créer les visuels Canva, filmer les TikToks selon les scripts,
  programmer dans Buffer/Later.`
  });

  Logger.log(`✅ [Pinapp] Doc semaine créé : ${docUrl}`);
}

function _buildMsg_PP(theme, dateStr) {
  return `Semaine du ${dateStr}. Thème : ${theme}.

Produis dans l'ordre :
1. 3 posts Instagram avec direction visuelle Canva détaillée
2. 2 scripts TikTok complets (parole mot pour mot + plan de tournage + incrustés + son + montage)
   Note : filmés par Lauralie seule avec smartphone — aucun matériel pro requis.
3. 2 Stories Instagram
4. Réunion critique des 12 agents spécialisés

Les visuels doivent être créables dans Canva en 15 min.
Les TikToks doivent être tournables en 30 min dans un appartement ou à l'extérieur.`;
}

// ─── APPEL CLAUDE ─────────────────────────────────────────────────────────────

function _callClaudeSM_PP(userContent) {
  if (CONFIG_SM_PP.CLAUDE_API_KEY === 'sk-ant-XXXXXXXX')
    throw new Error('⚠️ Remplace sk-ant-XXXXXXXX par ta clé API (ligne 14)');

  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method            : 'post',
    headers           : {
      'x-api-key'        : CONFIG_SM_PP.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type'     : 'application/json',
    },
    payload           : JSON.stringify({
      model     : CONFIG_SM_PP.CLAUDE_MODEL,
      max_tokens: CONFIG_SM_PP.MAX_TOKENS,
      system    : SM_SYSTEM_PROMPT_PP,
      messages  : [{ role: 'user', content: userContent }],
    }),
    muteHttpExceptions: true,
  });

  const r = JSON.parse(res.getContentText());
  if (r.error) throw new Error(`Claude Pinapp SM : ${r.error.message}`);
  return r.content?.[0]?.text || '';
}

// ─── PARSING ──────────────────────────────────────────────────────────────────

function _parseOutput_PP(text) {
  const ig  = [...text.matchAll(/===IG_POST_\d+===([\s\S]*?)===FIN_IG_\d+===/g)].map(m => m[1].trim());
  const tt  = [...text.matchAll(/===TIKTOK_\d+===([\s\S]*?)===FIN_TIKTOK_\d+===/g)].map(m => m[1].trim());
  const st  = [...text.matchAll(/===STORY_\d+===([\s\S]*?)===FIN_STORY_\d+===/g)].map(m => m[1].trim());
  const cr  = text.match(/===REUNION_CRITIQUE===([\s\S]*?)===FIN_REUNION===/);
  return { posts: ig, tiktoks: tt, stories: st, critique: cr ? cr[1].trim() : '[Critique non générée]' };
}

// ─── GOOGLE DOC ───────────────────────────────────────────────────────────────

function _createDoc_PP(dateStr, theme, posts, tiktoks, stories, critique) {
  const doc  = DocumentApp.create(`Pinapp — Social ${dateStr} — ${theme}`);
  const body = doc.getBody();
  const H1   = DocumentApp.ParagraphHeading.HEADING1;
  const H3   = DocumentApp.ParagraphHeading.HEADING3;

  body.appendParagraph(`📱 PINAPP — PLANNING SOCIAL — ${dateStr}`).setHeading(H1);
  body.appendParagraph(`Thème : ${theme} · IG : ${CONFIG_SM_PP.SCHEDULE.instagram.join(' · ')} · TikTok : ${CONFIG_SM_PP.SCHEDULE.tiktok.join(' · ')} · Stories : ${CONFIG_SM_PP.SCHEDULE.stories.join(' · ')}`).setItalic(true);
  body.appendHorizontalRule();

  body.appendParagraph('POSTS INSTAGRAM').setHeading(H1);
  posts.forEach((p, i) => { body.appendParagraph(`Post Instagram ${i+1}`).setHeading(H3); body.appendParagraph(p); body.appendParagraph(' '); });
  body.appendHorizontalRule();

  body.appendParagraph('SCRIPTS TIKTOK').setHeading(H1);
  tiktoks.forEach((t, i) => { body.appendParagraph(`Script TikTok ${i+1}`).setHeading(H3); body.appendParagraph(t); body.appendParagraph(' '); });
  body.appendHorizontalRule();

  body.appendParagraph('STORIES INSTAGRAM').setHeading(H1);
  stories.forEach((s, i) => { body.appendParagraph(`Story ${i+1}`).setHeading(H3); body.appendParagraph(s); body.appendParagraph(' '); });
  body.appendHorizontalRule();

  body.appendParagraph('RÉUNION CRITIQUE — 12 AGENTS').setHeading(H1);
  body.appendParagraph(critique);
  body.appendHorizontalRule();

  body.appendParagraph('CHECKLIST AVANT PUBLICATION').setHeading(H1);
  [
    'Corrections 12 agents appliquées',
    'Visuels Canva créés (3 IG + covers TikTok + 2 Stories)',
    'Scripts TikTok lus et mémorisés avant tournage',
    'Tournage TikTok (lumière naturelle, fond propre, Lauralie seule)',
    'Montage TikTok (transitions, incrustés, son selon les notes)',
    'Relecture ton — aligné avec la marque pinapp',
    'Programmé dans Buffer/Later aux bons horaires',
  ].forEach(i => body.appendParagraph(`☐  ${i}`));

  doc.saveAndClose();

  if (CONFIG_SM_PP.DOC_FOLDER_ID !== 'XXXXXXXX') {
    const f = DriveApp.getFileById(doc.getId());
    DriveApp.getFolderById(CONFIG_SM_PP.DOC_FOLDER_ID).addFile(f);
    DriveApp.getRootFolder().removeFile(f);
  }

  return doc.getUrl();
}

// ─── INSTALLATION ─────────────────────────────────────────────────────────────

function installSMTrigger_PP() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'generateWeeklyContent_PP')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('generateWeeklyContent_PP')
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  Logger.log('✅ [Pinapp] Trigger SM installé — chaque lundi 8h.');
  Logger.log('   ⚠️ Compléter SM_SYSTEM_PROMPT_PP avec la description du service pinapp avant de lancer.');
}

function testSMGeneration_PP() {
  Logger.log('[Pinapp] Test génération...');
  generateWeeklyContent_PP();
}
