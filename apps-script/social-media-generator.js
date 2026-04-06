/**
 * Mémoire & Présence — Générateur de contenu social media PREMIUM
 * Google Apps Script — coller dans script.google.com
 *
 * Produit chaque lundi :
 *   - 3 posts Instagram (visuels Canva détaillés + légendes)
 *   - 2 scripts TikTok complets (parole mot par mot + plan de tournage + B-roll + sons)
 *   - 2 Stories Instagram
 *   - Réunion critique de TOUS les agents (12 agents spécialisés)
 *   - Google Doc prêt à exécuter
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG_SM = {
  CLAUDE_API_KEY  : 'sk-ant-XXXXXXXX',
  CLAUDE_MODEL    : 'claude-3-5-sonnet-20241022',
  MON_EMAIL       : 'memoirepresence@gmail.com',
  DOC_FOLDER_ID   : 'XXXXXXXX',
  MAX_TOKENS      : 6000,

  SCHEDULE: {
    instagram : ['Mardi 9h30', 'Jeudi 18h30', 'Samedi 10h00'],
    tiktok    : ['Mercredi 19h00', 'Vendredi 20h00'],
    stories   : ['Lundi 8h00', 'Mercredi 12h00'],
  },

  THEMES: [
    'plaque_qr_decouverte',
    'histoire_famille_fictive',
    'coulisses_creation',
    'valeur_discretion',
    'faq_objection',
    'saisonnier',
    'avant_apres_concept',
    'hommage_metier',
  ],
};

// ─── PROMPT SYSTÈME — DIRECTEUR CRÉATIF ──────────────────────────────────────

const SM_SYSTEM_PROMPT = `Tu es le directeur créatif exécutif de Mémoire & Présence.
Tu produis du contenu social media de niveau agence premium.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDENTITÉ MÉMOIRE & PRÉSENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Studio de 2 personnes : Michaël (vidéaste pro) + Lauralie (créatrice visuelle et accompagnante).
Service : pages hommage privées + plaques QR gravées + vidéos souvenir.
Valeurs : discrétion absolue, soin du détail, durabilité, rythme humain.
Cible : familles en deuil ou anticipant un hommage. France entière, 100% à distance.
Ton : sobre, humain, émouvant — jamais commercial, jamais cheap.
Palette : sable #F7F4EF · vert sauge #6E8870 · vert forêt #3D6B4F · ardoise #2C3E41.
Police visuels : Cormorant Garamond italic (titres) + Source Sans 3 (corps).

━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRUCTURE DE SORTIE OBLIGATOIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Produis dans cet ordre exact :

1. Trois posts Instagram
2. Deux scripts TikTok complets
3. Deux Stories Instagram
4. Réunion critique 12 agents

Utilise les marqueurs exacts ci-dessous.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT POST INSTAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━

===IG_POST_[N]===
HORAIRE : [Mardi/Jeudi/Samedi + heure]

DIRECTION VISUELLE CANVA :
- Format : 1080×1080 px (carré) ou 1080×1350 px (portrait 4:5)
- Fond : [couleur exacte HEX ou description photo]
- Élément principal : [texte incrusté / photo / illustration — description précise]
- Texte sur visuel : [texte exact, police, taille, couleur, position]
- Overlay : [si nécessaire — opacité, couleur]
- Logo M&P : [position — bas gauche / bas droite, taille recommandée]
- Ambiance : [1 mot — Sobre / Chaleureux / Épuré / Élégant]

LÉGENDE :
[Texte complet avec sauts de ligne. Accroche forte en ligne 1.
Corps du post. Émotion sincère. Pas de formules creuses.
Max 300 mots pour IG.]

HASHTAGS :
[Liste 15-20 hashtags, séparés par espace]

CTA :
[Appel à action discret, 1 ligne]
===FIN_IG_[N]===

━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT TIKTOK — SCRIPT COMPLET
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Les TikTok sont filmés par Lauralie ou Michaël en face caméra ou B-roll.
Durée cible : 45 à 75 secondes.

===TIKTOK_[N]===
HORAIRE : [Mercredi/Vendredi + heure]
DURÉE CIBLE : [X secondes]
QUI FILME : Lauralie en face caméra / Michaël B-roll / Les deux

HOOK (0:00-0:05) — accrocher en 5 secondes :
[Phrase exacte à dire. Percutante, sincère, humaine. Jamais de "POV:" ou clichés TikTok.]
[Indications pour la caméra : angle, distance, expression, geste]

PLAN DE TOURNAGE :
Scène 1 — [0:00-0:xx]
  PAROLE : "[Texte exact à dire]"
  VISUEL : [Ce qu'on voit à l'écran — plan serré / large, B-roll, objet filmé]
  DÉCOR  : [Où filmer — atelier, extérieur, bureau, cimetière fictif etc.]
  NOTE   : [Ton, rythme, émotion de ce passage]

Scène 2 — [0:xx-0:xx]
  PAROLE : "[Texte exact]"
  VISUEL : [Description]
  DÉCOR  : [Description]
  NOTE   : [Description]

[Continuer pour chaque scène...]

TEXTES À INCRUSTES (sous-titres créatifs) :
- [Timecode] → "[Texte à afficher à l'écran]" — Police, couleur, animation
[Lister tous les incrustés importants]

SON ET MUSIQUE :
- Musique de fond : [description du style — acoustic, lo-fi, silence etc.]
- Volume : [sous la voix / égal / coupé sur certaines scènes]
- Son tendance TikTok : [oui → description du type de son / non]

MONTAGE :
- Rythme général : [lent et contemplatif / dynamique / mixte]
- Transitions clés : [coupes sèches / fondus / zoom / glissement]
- Points de coupe importants : [indiquer où couper pour l'impact]

LÉGENDE TIKTOK :
[Texte court 50-100 mots. Hook écrit fort. 1-2 questions pour les commentaires.]

HASHTAGS TIKTOK :
[5 à 8 hashtags ciblés, pas génériques]

APPEL À ACTION :
[1 phrase — lien en bio, question aux abonnés, save ce post]
===FIN_TIKTOK_[N]===

━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT STORY INSTAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━

===STORY_[N]===
HORAIRE : [Lundi/Mercredi + heure]

DIRECTION VISUELLE :
- Format : 1080×1920 px (9:16 vertical)
- Fond : [couleur ou photo]
- Texte principal : [max 2 lignes, gros, lisible en 2 secondes]
- Sticker/Élément interactif : [sondage / question / lien / compte à rebours / aucun]
- Animation : [texte qui apparaît / fondu / statique]

TEXTE STORY :
[Texte exact — très court, percutant]

LIEN SWIPE UP (si Story avec lien) :
[URL — page site M&P concernée]
===FIN_STORY_[N]===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÉUNION CRITIQUE — 12 AGENTS SPÉCIALISÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chaque agent analyse l'ensemble des 7 posts et rend un verdict.

===REUNION_CRITIQUE===

🍎 AGENT APPLE / EXPERT UX PREMIUM
Analyse : interactions, fluidité, ressenti produit, cohérence iOS/mobile.
→ Est-ce que chaque contenu donne envie de cliquer, sauvegarder, partager ?
→ Verdict par post + score UX (1-10).

🎨 AGENT DIRECTION ARTISTIQUE PREMIUM
Analyse : composition, hiérarchie visuelle, proportions, refus du générique.
→ Est-ce que chaque visuel est de niveau Apple/premium ou ressemble à un template Canva banal ?
→ Corrections précises si nécessaire.

💎 AGENT LUXE & RAFFINEMENT
Analyse : sobriété, subtilité, détail, ce qui fait "haut de gamme" vs "fait maison".
→ Pointer les éléments qui cheapissent et proposer l'alternative raffinée.

🖋️ AGENT COPYWRITING ÉMOTIONNEL PREMIUM
Analyse : chaque mot compte. Accroche, corps, CTA.
→ Supprimer les formules creuses. Réécrire les passages faibles.
→ Donner une version améliorée de chaque légende si nécessaire.

🕊️ AGENT SECTEUR FUNÉRAIRE / SENSIBILITÉ DEUIL
Analyse : vocabulaire, dignité, bienveillance, absence de banalisation du deuil.
→ VETO ABSOLU si un post pourrait blesser une famille en deuil.
→ Suggestions de remplacement pour les passages sensibles.

📊 AGENT PERFORMANCE & SEO LOCAL
Analyse : hashtags, CTA, horaire, accroche pour l'algorithme.
→ Score de portée estimée (1-10) + suggestions d'optimisation.
→ Mots-clés SEO à intégrer dans les légendes pour la recherche Google.

🎬 AGENT SCÈNE VISUELLE & PHOTOGRAPHIE
Analyse : les directions visuelles Canva et plans de tournage TikTok.
→ Est-ce que les visuels décrits sont réalisables et beaux ?
→ Corriger le cadrage, la lumière, les couleurs, les compositions suggérées.

😊 AGENT ÉMOTION UTILISATEUR
Analyse : ce que ressent une famille en deuil en voyant chaque post.
→ Confiance, réassurance, identification, envie de contacter.
→ Pointer les posts qui font fuir et ceux qui convertissent.

🏆 AGENT BUSINESS PREMIUM
Analyse : positionnement, crédibilité, justification du prix sans le dire.
→ Est-ce que ces posts donnent l'image d'un studio premium ou d'un service générique ?
→ Suggestions pour renforcer la perception de valeur.

🎯 AGENT COHÉRENCE MULTI-PAGES
Analyse : cohérence avec le site web, les emails envoyés aux clients, la charte.
→ Un visiteur qui voit ces posts et visite le site retrouve-t-il la même marque ?
→ Points de dissonance à corriger.

✍️ AGENT ÉDITORIAL & CONTENU SEO
Analyse : plan de contenu, anti-doublon avec les semaines précédentes, lisibilité.
→ Ce contenu est-il original et utile ou déjà vu cent fois ?
→ Proposer 2 angles alternatifs si un post est trop générique.

✅ VERDICT FINAL COLLECTIF
Résumé de la réunion :
- Posts approuvés sans changement : [liste]
- Posts à corriger (corrections listées) : [liste]
- Posts retirés (raison) : [liste]
- Priorité de correction avant publication : [ordre]
- Note globale de la semaine : [X/10]

===FIN_REUNION===`;

// ─── GÉNÉRATEUR ───────────────────────────────────────────────────────────────

function generateWeeklyContent() {
  const now      = new Date();
  const themeIdx = (now.getMonth() * 5 + Math.ceil(now.getDate()/7)) % CONFIG_SM.THEMES.length;
  const theme    = CONFIG_SM.THEMES[themeIdx];
  const dateStr  = now.toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'});

  Logger.log(`Génération semaine ${dateStr} — thème : ${theme}`);

  const output          = _callClaudeSM(_buildWeeklyMessage(theme, dateStr));
  const { posts, tiktoks, stories, critique } = _parseOutput(output);
  const docUrl          = _createDoc(dateStr, theme, posts, tiktoks, stories, critique);

  MailApp.sendEmail({
    to     : CONFIG_SM.MON_EMAIL,
    subject: `📱 Contenu semaine — ${dateStr} [${posts.length} IG · ${tiktoks.length} TikTok · ${stories.length} Stories]`,
    body   :
`Planning social media M&P prêt.

Thème : ${theme}
Posts Instagram : ${posts.length}
Scripts TikTok : ${tiktoks.length}
Stories : ${stories.length}

Doc Google Drive : ${docUrl}

→ Ouvrir le doc, lire la critique des 12 agents, appliquer les corrections, créer les visuels Canva, filmer les TikToks selon les scripts, programmer dans Buffer/Later.`
  });

  Logger.log(`✅ Doc créé : ${docUrl}`);
}

function _buildWeeklyMessage(theme, dateStr) {
  const descriptions = {
    'plaque_qr_decouverte'   : 'Faire découvrir le concept plaque gravée + QR code relié à une page hommage. Comment ça marche concrètement. Ce que ça change pour une famille.',
    'histoire_famille_fictive': 'Raconter une histoire fictive et émouvante. Une famille, un proche disparu, un souvenir précis. Noms inventés, détails authentiques et humains.',
    'coulisses_creation'      : 'Montrer le travail de Michaël (montage vidéo, gravure) et Lauralie (mise en page, accompagnement). Derrière le rideau, le soin apporté.',
    'valeur_discretion'       : 'La discrétion absolue comme valeur fondamentale. Les données ne sortent jamais. Aucune publicité. Aucune revente.',
    'faq_objection'           : 'Répondre à une idée reçue fréquente : trop technologique, ça remplace pas une vraie plaque, compliqué à scanner, etc.',
    'saisonnier'              : `Contenu adapté à la période (${dateStr}). Toussaint, fête des mères, anniversaires, début d'année, etc.`,
    'avant_apres_concept'     : 'Contraste entre une plaque classique (froide, anonyme) et une plaque M&P (histoire, QR, page). Sans juger les plaques classiques.',
    'hommage_metier'          : 'Hommage à une profession ou passion : jardiniers, enseignants, artisans, pêcheurs. "Ceux qui ont donné leur vie à [métier] méritent..."',
  };

  return `Semaine du ${dateStr}.
Thème de la semaine : ${theme}
Description : ${descriptions[theme] || theme}

Produis dans l'ordre :
1. 3 posts Instagram (avec direction visuelle Canva détaillée)
2. 2 scripts TikTok complets (parole mot pour mot + tournage + incrustés + son + montage)
3. 2 Stories Instagram
4. Réunion critique des 12 agents spécialisés

Chaque TikTok doit être filmable par Lauralie seule OU Michaël seul (pas de matériel professionnel requis — smartphone suffit si bien cadré).
Les visuels Instagram doivent être créables dans Canva en 15 min avec les templates M&P.`;
}

// ─── APPEL CLAUDE ─────────────────────────────────────────────────────────────

function _callClaudeSM(userContent) {
  if (CONFIG_SM.CLAUDE_API_KEY === 'sk-ant-XXXXXXXX')
    throw new Error('⚠️ Remplace la clé API dans CONFIG_SM ligne 14');

  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method            : 'post',
    headers           : {
      'x-api-key'        : CONFIG_SM.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type'     : 'application/json',
    },
    payload           : JSON.stringify({
      model     : CONFIG_SM.CLAUDE_MODEL,
      max_tokens: CONFIG_SM.MAX_TOKENS,
      system    : SM_SYSTEM_PROMPT,
      messages  : [{ role: 'user', content: userContent }],
    }),
    muteHttpExceptions: true,
  });
  const r = JSON.parse(res.getContentText());
  if (r.error) throw new Error(`Claude SM : ${r.error.message}`);
  return r.content?.[0]?.text || '';
}

// ─── PARSING ──────────────────────────────────────────────────────────────────

function _parseOutput(text) {
  const ig      = [...text.matchAll(/===IG_POST_\d+===([\s\S]*?)===FIN_IG_\d+===/g)].map(m => m[1].trim());
  const tt      = [...text.matchAll(/===TIKTOK_\d+===([\s\S]*?)===FIN_TIKTOK_\d+===/g)].map(m => m[1].trim());
  const st      = [...text.matchAll(/===STORY_\d+===([\s\S]*?)===FIN_STORY_\d+===/g)].map(m => m[1].trim());
  const critiqueM = text.match(/===REUNION_CRITIQUE===([\s\S]*?)===FIN_REUNION===/);
  return {
    posts   : ig,
    tiktoks : tt,
    stories : st,
    critique: critiqueM ? critiqueM[1].trim() : '[Critique non générée]',
  };
}

// ─── GOOGLE DOC ───────────────────────────────────────────────────────────────

function _createDoc(dateStr, theme, posts, tiktoks, stories, critique) {
  const doc  = DocumentApp.create(`M&P — Social ${dateStr} — ${theme}`);
  const body = doc.getBody();
  const H1   = DocumentApp.ParagraphHeading.HEADING1;
  const H2   = DocumentApp.ParagraphHeading.HEADING2;
  const H3   = DocumentApp.ParagraphHeading.HEADING3;

  body.appendParagraph(`📱 MÉMOIRE & PRÉSENCE — PLANNING SOCIAL — ${dateStr}`).setHeading(H1);
  body.appendParagraph(`Thème : ${theme} · Instagram : ${CONFIG_SM.SCHEDULE.instagram.join(' · ')} · TikTok : ${CONFIG_SM.SCHEDULE.tiktok.join(' · ')} · Stories : ${CONFIG_SM.SCHEDULE.stories.join(' · ')}`).setItalic(true);
  body.appendHorizontalRule();

  // ── Posts Instagram ──
  body.appendParagraph('POSTS INSTAGRAM').setHeading(H1);
  posts.forEach((p, i) => {
    body.appendParagraph(`Post Instagram ${i+1}`).setHeading(H3);
    body.appendParagraph(p);
    body.appendParagraph(' ');
  });

  body.appendHorizontalRule();

  // ── Scripts TikTok ──
  body.appendParagraph('SCRIPTS TIKTOK').setHeading(H1);
  tiktoks.forEach((t, i) => {
    body.appendParagraph(`Script TikTok ${i+1}`).setHeading(H3);
    body.appendParagraph(t);
    body.appendParagraph(' ');
  });

  body.appendHorizontalRule();

  // ── Stories ──
  body.appendParagraph('STORIES INSTAGRAM').setHeading(H1);
  stories.forEach((s, i) => {
    body.appendParagraph(`Story ${i+1}`).setHeading(H3);
    body.appendParagraph(s);
    body.appendParagraph(' ');
  });

  body.appendHorizontalRule();

  // ── Réunion critique ──
  body.appendParagraph('RÉUNION CRITIQUE — 12 AGENTS').setHeading(H1);
  body.appendParagraph(critique);
  body.appendHorizontalRule();

  // ── Checklist ──
  body.appendParagraph('CHECKLIST AVANT PUBLICATION').setHeading(H2);
  [
    'Corrections 12 agents appliquées',
    'Visuels Canva créés (3 IG + 2 covers TikTok + 2 Stories)',
    'Scripts TikTok lus et mémorisés avant tournage',
    'Tournage TikTok réalisé (lumière naturelle, fond propre)',
    'Montage TikTok selon les notes (transitions, incrustés, son)',
    'Relecture ton — rien qui pourrait blesser',
    'Posts programmés dans Buffer/Later aux bons horaires',
    'Stories programmées séparément',
  ].forEach(item => body.appendParagraph(`☐  ${item}`));

  doc.saveAndClose();

  if (CONFIG_SM.DOC_FOLDER_ID !== 'XXXXXXXX') {
    const f = DriveApp.getFileById(doc.getId());
    DriveApp.getFolderById(CONFIG_SM.DOC_FOLDER_ID).addFile(f);
    DriveApp.getRootFolder().removeFile(f);
  }

  return doc.getUrl();
}

// ─── INSTALLATION ─────────────────────────────────────────────────────────────

function installSMTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'generateWeeklyContent')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('generateWeeklyContent')
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  Logger.log('✅ Trigger SM installé — chaque lundi 8h.');
}

function testSMGeneration() {
  Logger.log('Test génération...');
  generateWeeklyContent();
}
