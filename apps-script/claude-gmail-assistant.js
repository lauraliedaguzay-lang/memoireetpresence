/**
 * Mémoire & Présence — Assistant Claude pour Gmail
 * Google Apps Script — coller dans script.google.com
 *
 * Chaque brouillon contient TROIS parties :
 *   1. Brouillon de réponse prêt à envoyer au client (sous validation Lauralie)
 *   2. Analyse confidentielle pour Lauralie (coaching vente, stade client, prochaines étapes)
 *   3. Brief pour Michaël (ce qu'il doit créer, livrer, dans quel délai)
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG = {
  CLAUDE_API_KEY  : 'sk-ant-XXXXXXXX',           // ← Remplacer par ta clé Anthropic
  CLAUDE_MODEL    : 'claude-3-5-haiku-20241022',  // rapide + économique
  NETLIFY_SENDER  : 'team@netlify.com',
  MON_EMAIL       : 'memoirepresence@gmail.com',
  MAX_TOKENS      : 1800,
  EMAIL_MICHAEL   : 'michael@memoire-et-presence.fr', // ← Remplacer par le vrai email de Michaël
  LABEL_SUIVI     : 'MP-Suivi',   // Label Gmail à appliquer sur les threads à suivre
};

// ─── PROMPT SYSTÈME — COACH + RÉDACTEUR ──────────────────────────────────────

const SYSTEM_PROMPT = `Tu es à la fois le coach commercial et l'assistante rédactrice de Lauralie,
cofondatrice de Mémoire & Présence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÉMOIRE & PRÉSENCE — CONTEXTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Studio de 2 personnes :
- Michaël : vidéaste professionnel, monte les vidéos hommage en interne (pas de sous-traitant)
- Lauralie : créatrice visuelle et accompagnante, gère tout le parcours client

Services proposés :
- Page hommage privée (URL sécurisée, photos, texte, galerie, livre d'or, accès par code)
- Plaque QR gravée (ardoise, pierre, métal) livrée partout en France
- Vidéo hommage montée sur-mesure
- Accompagnement complet du début à la livraison

Valeurs : discrétion absolue, soin du détail, rythme humain, jamais de sous-traitance.
Tarifs : uniquement sur devis personnalisé — jamais mentionner de prix en premier contact.
Délais : 2 à 5 semaines selon la complexité et les éléments fournis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
CE QUE TU DOIS PRODUIRE (STRUCTURE OBLIGATOIRE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Produis TOUJOURS une réponse en TROIS blocs séparés par des marqueurs exacts :

===ANALYSE_POUR_LAURALIE===
[Bloc 1 : coaching confidentiel pour Lauralie]
===FIN_ANALYSE===

===BRIEF_MICHAEL===
[Bloc 2 : ce que Lauralie doit commander/demander à Michaël]
===FIN_BRIEF_MICHAEL===

===BROUILLON_CLIENT===
[Bloc 3 : texte de la réponse à envoyer au client]
===FIN_BROUILLON===

━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOC 1 — ANALYSE POUR LAURALIE (confidentiel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Inclure dans cet ordre :

📍 STADE DU CLIENT
Un des cinq stades :
- DÉCOUVERTE : vient de trouver le service, curieux mais pas encore décidé
- INTÉRESSÉ : a compris l'offre, veut en savoir plus ou obtenir un devis
- PRÊT À COMMANDER : a les éléments, attend confirmation pratique
- HÉSITANT : a des freins (prix ? délai ? confiance ?)
- DEUIL RÉCENT : perte très récente — adapter le ton (priorité à l'écoute sur la vente)

💡 CE QUE CE CLIENT CHERCHE VRAIMENT
1 à 2 phrases : quel est le besoin sous-jacent ? (hommage pour lui ? pour la famille ? urgence d'une date ?)

⚡ OPPORTUNITÉ PRINCIPALE
Ce qui peut le convaincre — point fort à mettre en avant dans cette réponse.

⚠️ POINTS D'ATTENTION
Ce qui pourrait bloquer ou nécessite une attention particulière (deuil très récent, budget non précisé, demande urgente, doutes sur le digital...).

🎯 OBJECTIF DE CETTE RÉPONSE
Ex: "Obtenir un appel" / "Décrocher un devis" / "Rassurer sur la confidentialité" / "Confirmer la date limite possible"

📋 PROCHAINES ÉTAPES RECOMMANDÉES
- Étape 1 (cette réponse) : ce que tu fais maintenant
- Étape 2 (suivi J+3 si pas de réponse) : ce que tu peux relancer
- Étape 3 (si devis envoyé) : ce que tu vérifies avant livraison

💬 TON RECOMMANDÉ POUR CETTE RÉPONSE
Ex: "Chaleureux et rassurant — ne pas parler de prix" / "Direct et concret — il a besoin d'un délai précis" / "Très doux — deuil très récent"

━━━━━━━━━━━━━━━━━━━━━━━━━━━


???????????????????????????
BLOC 2 - BRIEF MICHAEL (instructions de montage precises)
???????????????????????????
Ce bloc est transmis directement a Michael (videaste professionnel).
Ton : direct, technique, entre collegues. Pas de formules commerciales.

Si le projet ne necessite PAS Michael, ecrire : "RAS - pas d'intervention Michael a ce stade."

Sinon, produire un brief structure :

TYPE DE MISSION
Ex: "Video hommage complete" / "Diaporama anime" / "Conversion VHS" / "Export cle USB"

MATIERE PREMIERE DISPONIBLE
- Photos : nombre, format (numerique / scan / tirage papier)
- Videos : duree approx, source (telephone, VHS, camescope)
- Musique : fournie par client (titre + artiste) ou a choisir en bibliotheque libre
- Voix off : oui / non / a enregistrer / deja enregistree
- Autres : lettres scannees, dessins, objets a photographier

STRUCTURE NARRATIVE RECOMMANDEE
Decoupage sequentiel adapte au profil du defunt et volume de photos.
Pour chaque sequence preciser : photos concernees, type de transition (fondu/translation/coupe), duree, rythme (1 photo / Xs).
Exemple pour 30 photos, artisan retraite :
  Seq.1 - Ouverture (0:00-0:20) : portrait seul, fondu depuis noir 2s, titre centre "Prenom NOM - AAAA-AAAA", serif fin blanc 85% opacite
  Seq.2 - Enfance (0:20-0:55) : 5 photos chrono, fondu enchaine 1,2s, 1 photo/5s
  Seq.3 - Vie active (0:55-1:40) : 8 photos metier+hobby, Ken Burns 3% max, si video dispo max 20s son a -18dB
  Seq.4 - Famille (1:40-2:15) : 6 photos groupe, fondu 1,5s rythme lent
  Seq.5 - Cloture (2:15-2:40) : retour portrait, fondu noir 3s, sous-titre "Memoire & Presence" fin opacite 40%

DIRECTION COLORIMETRIQUE
- Saturation : -10 a -20% (sobre, pas de filtre)
- Lift ombres : legerement releve pour vieilles photos (pas de noir pur)
- Photos argentiques/scannees : grain leger + desaturation partielle pour homogeneiser
- Tons chauds (campagne, interieur) ou froids (cote, montagne) selon contexte de vie

MUSIQUE
- Tempo recommande selon rythme narratif (ex : "60-70 BPM, calme")
- Instrumentation selon profil defunt (piano solo / cordes acoustiques / guitare classique)
- Bibliotheques libres de droits : Epidemic Sound, Artlist, ccMixter
- Entree : des l'image 1 ou apres 2s de silence selon ambiance
- Fade out : demarre 4s avant la fin, progressif

TEXTES ET TITRES
- Police : serif fin uniquement (Cormorant Garamond, EB Garamond) - coherent charte M&P
- Couleur : blanc ou creme selon fond, opacite 80-85%, fade in/out 0,5s
- Textes a integrer : titre principal "Prenom NOM - AAAA-AAAA", sous-titres de section si pertinent, citation ou date en cloture

EXPORT
- Web (page hommage) : MP4 H.264 1280x720 streaming, AAC 192kbps -14 LUFS
- Principal : MP4 H.264 1920x1080 25fps 8-12 Mbps
- Cle USB (si demande) : idem + MOV ProRes si cle >= 16Go
- Nommage : "MP_[NomDefunt]_[AAAAMMJJ]_v1.mp4"

PLANNING
- Livraison client : [deduire de la demande ou noter A DEFINIR]
- Rendu Michael pour validation Lauralie : J-5
- Correction apres retour Lauralie : 48h max
- Circuit : Lauralie visionne -> retour ecrit -> Michael corrige -> livraison. 1 cycle inclus.

POINTS A CLARIFIER AVANT DE COMMENCER
Lister ce que Lauralie doit encore obtenir du client avant que Michael demarre.

BLOC 3 — BROUILLON POUR LE CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Règles :
- Commence par "Madame," / "Monsieur," / ou le prénom si connu
- 150 à 250 mots maximum
- Jamais de tarif dans un premier contact
- Jamais de formules creuses ("formidable", "super", "avec plaisir")
- Pose 1 à 2 questions précises si des infos manquent — pas plus
- Termine par une proposition d'action claire (appel, réponse mail, envoi de devis)
- Signature : "Lauralie\\nMémoire & Présence\\nmemoirepresence@gmail.com\\n07 86 17 37 15"`;

// ─── POINT D'ENTRÉE PRINCIPAL ─────────────────────────────────────────────────

/** Appelé toutes les 5 min — gère les deux flux en parallèle. */
function checkAll() {
  checkNewNetlifyForms();
  checkClientReplies();
}

/** Flux 1 — Nouveaux formulaires Netlify. */
function checkNewNetlifyForms() {
  const query   = `from:(${CONFIG.NETLIFY_SENDER}) is:unread subject:"New submission"`;
  const threads = GmailApp.search(query, 0, 20);

  if (threads.length === 0) { Logger.log('Netlify : aucune nouvelle soumission.'); return; }

  threads.forEach(thread => {
    try { processThread(thread); }
    catch (e) { Logger.log(`Erreur Netlify thread : ${e.message}`); }
  });
}

/**
 * Flux 2 — Réponses clients sur les threads labellisés "MP-Suivi".
 *
 * Comment ça marche pour Lauralie :
 *   1. Tu envoies une réponse au client (depuis le brouillon généré)
 *   2. Tu appliques le label "MP-Suivi" sur le thread dans Gmail
 *   3. Quand le client répond → un nouveau brouillon de suivi apparaît automatiquement
 */
function checkClientReplies() {
  const query   = `label:${CONFIG.LABEL_SUIVI} is:unread -from:(${CONFIG.NETLIFY_SENDER}) -from:(me)`;
  const threads = GmailApp.search(query, 0, 20);

  if (threads.length === 0) { Logger.log('Suivi : aucune réponse client.'); return; }

  threads.forEach(thread => {
    try { processClientReply(thread); }
    catch (e) { Logger.log(`Erreur suivi thread : ${e.message}`); }
  });
}

/** Traite une réponse client dans un thread MP-Suivi. */
function processClientReply(thread) {
  const messages    = thread.getMessages();
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage.isUnread()) return;

  // Reconstruire l'historique complet du thread (max 10 messages)
  const history = messages.slice(-10).map(m => ({
    from    : m.getFrom(),
    date    : m.getDate().toLocaleDateString('fr-FR'),
    body    : (m.getPlainBody() || stripHtml(m.getBody())).substring(0, 800).trim()
  }));

  const clientEmail   = lastMessage.getFrom().match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null;
  const clientName    = lastMessage.getFrom().replace(/<.*>/, '').trim();
  const subject       = thread.getFirstMessageSubject();

  Logger.log(`Suivi client [${clientName}] : ${subject}`);

  const claudeOutput              = callClaudeForReply(history, clientName, subject);
  const { analyse, briefMichael, brouillon } = parseClaudeOutput(claudeOutput);

  createGmailDraft(clientEmail, subject, analyse, briefMichael, brouillon,
    { 'Client': clientName, 'Email': clientEmail || '', 'Sujet': subject }, 'SUIVI');

  lastMessage.markRead();
}

// ─── TRAITEMENT D'UN THREAD ───────────────────────────────────────────────────

function processThread(thread) {
  const messages  = thread.getMessages();
  const msg       = messages[messages.length - 1];
  if (!msg.isUnread()) return;

  const rawBody   = msg.getPlainBody() || stripHtml(msg.getBody());
  const formData  = parseNetlifyBody(rawBody);
  const formType  = detectFormType(msg.getSubject(), formData);

  Logger.log(`Traitement [${formType}] : ${JSON.stringify(formData)}`);

  const claudeOutput              = callClaude(formData, formType, rawBody);
  const { analyse, briefMichael, brouillon } = parseClaudeOutput(claudeOutput);
  const clientEmail               = extractClientEmail(formData);

  createGmailDraft(clientEmail, msg.getSubject(), analyse, briefMichael, brouillon, formData, formType);
  msg.markRead();
}

// ─── PARSING EMAIL NETLIFY ────────────────────────────────────────────────────

function parseNetlifyBody(body) {
  const data  = {};
  const clean = body.replace(/\r/g, '').trim();
  clean.split('\n').forEach(line => {
    const match = line.match(/^([^:]{2,60}):\s*(.+)$/);
    if (match) data[match[1].trim()] = match[2].trim();
  });
  return data;
}

function detectFormType(subject, formData) {
  const s = (subject || '').toLowerCase();
  if (s.includes('accompagnement') || formData['honor_name'] || formData['Prénom et nom'])
    return 'ACCOMPAGNEMENT';
  if (s.includes('devis') || formData['budget'] || formData['type_projet'])
    return 'DEVIS';
  if (s.includes('video') || s.includes('vidéo'))
    return 'VIDEO';
  return 'CONTACT';
}

function extractClientEmail(formData) {
  for (const k of ['email','Email','E-mail','mail','Mail','votre_email']) {
    if (formData[k] && formData[k].includes('@')) return formData[k];
  }
  return null;
}

// ─── APPEL API CLAUDE ─────────────────────────────────────────────────────────

/** Appel Claude pour une RÉPONSE DE SUIVI (thread existant). */
function callClaudeForReply(history, clientName, subject) {
  const historyText = history.map((m, i) =>
    `[Message ${i + 1} — ${m.from} — ${m.date}]\n${m.body}`
  ).join('\n\n---\n\n');

  const userContent =
`TYPE : SUIVI — Réponse d'un client existant
CLIENT : ${clientName}
SUJET DU THREAD : ${subject}

HISTORIQUE DE LA CONVERSATION (du plus ancien au plus récent) :
${historyText}

Le dernier message est la réponse du client.
Produis l'analyse pour Lauralie, le brief Michaël si pertinent, et le brouillon de réponse
selon la structure habituelle (3 blocs avec marqueurs).`;

  return _callClaudeAPI(userContent);
}

/** Appel Claude pour un NOUVEAU formulaire. */
function callClaude(formData, formType, rawBody) {
  const formLines = Object.entries(formData).map(([k,v]) => `• ${k} : ${v}`).join('\n');

  const userContent =
`TYPE DE FORMULAIRE : ${formType}

DONNÉES REÇUES :
${formLines}

CORPS BRUT (si champs supplémentaires non parsés) :
${rawBody.substring(0, 2000)}

Produis l'analyse pour Lauralie ET le brouillon client selon la structure demandée.`;

  return _callClaudeAPI(userContent);
}

function _callClaudeAPI(userContent) {
  if (CONFIG.CLAUDE_API_KEY === 'sk-ant-XXXXXXXX') {
    throw new Error('⚠️ Remplace sk-ant-XXXXXXXX par ta vraie clé API (ligne 14)');
  }

  const payload = {
    model     : CONFIG.CLAUDE_MODEL,
    max_tokens: CONFIG.MAX_TOKENS,
    system    : SYSTEM_PROMPT,
    messages  : [{ role: 'user', content: userContent }]
  };

  const options = {
    method            : 'post',
    headers           : {
      'x-api-key'        : CONFIG.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type'     : 'application/json'
    },
    payload           : JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
  const result   = JSON.parse(response.getContentText());
  if (result.error) throw new Error(`Claude API : ${result.error.message}`);
  return result.content?.[0]?.text || '';
}

// ─── PARSING SORTIE CLAUDE ────────────────────────────────────────────────────

function parseClaudeOutput(text) {
  const analyseMatch      = text.match(/===ANALYSE_POUR_LAURALIE===([\s\S]*?)===FIN_ANALYSE===/);
  const briefMichaelMatch = text.match(/===BRIEF_MICHAEL===([\s\S]*?)===FIN_BRIEF_MICHAEL===/);
  const brouillonMatch    = text.match(/===BROUILLON_CLIENT===([\s\S]*?)===FIN_BROUILLON===/);

  return {
    analyse      : analyseMatch      ? analyseMatch[1].trim()      : '[Analyse non générée]',
    briefMichael : briefMichaelMatch ? briefMichaelMatch[1].trim() : 'RAS — pas d\'intervention Michaël à ce stade.',
    brouillon    : brouillonMatch    ? brouillonMatch[1].trim()    : text.trim()
  };
}

// ─── CRÉATION DU BROUILLON GMAIL ──────────────────────────────────────────────

function createGmailDraft(clientEmail, originalSubject, analyse, briefMichael, brouillon, formData, formType) {
  const subject    = `Re: ${originalSubject.replace(/^Re:\s*/i, '')}`;
  const bar        = '━'.repeat(52);
  const needsMichael = !briefMichael.startsWith('RAS');

  // ── Brouillon principal (réponse au client) ──────────────
  const draftBody =
`${brouillon}


${bar}
🔒 CONFIDENTIEL — SUPPRIMER AVANT D'ENVOYER
${bar}

📊 ANALYSE POUR LAURALIE
${analyse}

${needsMichael ? `
${bar}
🎬 BRIEF MICHAËL — voir brouillon séparé
${bar}` : `
${bar}
🎬 MICHAËL : RAS sur ce dossier
${bar}`}

📋 FORMULAIRE [${formType}]
${Object.entries(formData).map(([k,v]) => `${k} : ${v}`).join('\n')}
${bar}`;

  if (clientEmail) {
    GmailApp.createDraft(clientEmail, subject, draftBody);
    Logger.log(`✅ Brouillon client créé → ${clientEmail}`);
  } else {
    GmailApp.createDraft(
      CONFIG.MON_EMAIL,
      `⚠️ [EMAIL CLIENT MANQUANT — ${formType}] ${subject}`,
      `⚠️ Email client introuvable.\n\n${draftBody}`
    );
  }

  // ── Notification push mobile ──────────────────────────────────
  _sendMobileNotif(formType, formData, clientEmail, needsMichael);

  // ── Brouillon séparé pour Michaël (seulement si nécessaire) ──
  if (needsMichael) {
    const michaelSubject = `[MISSION] ${formType} — ${formData['Prénom et nom'] || formData['Nom'] || 'Nouveau client'}`;
    const michaelBody =
`Bonjour Michaël,

Nouveau projet à prendre en compte :

${briefMichael}

${bar}
INFOS CLIENT (confidentiel)
Nom : ${formData['Prénom et nom'] || formData['Nom'] || 'Non renseigné'}
Défunt : ${formData['honor_name'] || 'Non renseigné'}
Email client : ${clientEmail || 'Non renseigné'}
${bar}

Reviens vers moi si tu as des questions avant de commencer.

Lauralie`;

    GmailApp.createDraft(CONFIG.EMAIL_MICHAEL, michaelSubject, michaelBody);
    Logger.log(`✅ Brief Michaël créé → ${CONFIG.EMAIL_MICHAEL}`);
  }
}

// ─── NOTIFICATION MOBILE ──────────────────────────────────────────────────────

/**
 * Envoie un email court à Lauralie → déclenche la notif push Gmail sur son téléphone.
 * Corps volontairement court : l'analyse complète est dans le brouillon Gmail.
 */
function _sendMobileNotif(formType, formData, clientEmail, needsMichael) {
  try {
    const nom     = formData['Prénom et nom'] || formData['Nom'] || formData['name'] || 'Client inconnu';
    const defunt  = formData['honor_name'] || '';
    const tel     = formData['Téléphone'] || formData['telephone'] || '';

    const typeLabel = {
      'ACCOMPAGNEMENT' : '📋 Accompagnement',
      'DEVIS'          : '💼 Devis',
      'VIDEO'          : '🎬 Vidéo',
      'CONTACT'        : '✉️ Contact',
      'SUIVI'          : '🔄 Suivi client',
    }[formType] || formType;

    const subject = `🔔 MP — ${typeLabel} · ${nom}`;

    const lines = [
      `Nouveau brouillon prêt dans Gmail.`,
      ``,
      `Client    : ${nom}`,
      clientEmail ? `Email     : ${clientEmail}` : `Email     : ⚠️ non renseigné`,
      tel         ? `Tél       : ${tel}`         : '',
      defunt      ? `Défunt    : ${defunt}`      : '',
      needsMichael ? `Michaël   : brief à envoyer` : '',
      ``,
      `→ Ouvrir Gmail, aller dans Brouillons, relire et envoyer.`,
    ].filter(l => l !== undefined && !(l === '' && lines && lines[lines.length-1] === ''));

    MailApp.sendEmail({
      to     : CONFIG.MON_EMAIL,
      subject: subject,
      body   : lines.join('\n'),
    });

    Logger.log(`📱 Notif mobile envoyée : ${subject}`);
  } catch (e) {
    Logger.log(`⚠️ Notif mobile échouée : ${e.message}`);
  }
}

// ─── UTILITAIRES ──────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── INSTALLATION & TESTS ─────────────────────────────────────────────────────

/** Appeler UNE SEULE FOIS pour activer la vérification automatique. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('checkAll')       // ← gère Netlify + réponses clients
    .timeBased()
    .everyMinutes(5)
    .create();
  Logger.log('✅ Déclencheur installé — vérification toutes les 5 min (formulaires + suivis).');
  Logger.log('   → Pense à créer le label "MP-Suivi" dans Gmail et à l\'appliquer sur les threads actifs.');
}

/**
 * Test suivi client — simule une réponse de Marie-Claire Tessier
 * après que Lauralie lui a envoyé le premier message.
 */
function testSuivi() {
  const fakeHistory = [
    {
      from : 'memoirepresence@gmail.com',
      date : '07/04/2026',
      body : `Madame Tessier,

Merci de nous avoir écrit. Nous pouvons tout à fait vous accompagner.
Avant de vous préparer un devis, j'aurais deux questions :
— Avez-vous une date en tête pour la livraison ?
— Les vidéos sont-elles sur téléphone ou déjà numérisées ?

Lauralie — Mémoire & Présence`
    },
    {
      from : 'Marie-Claire Tessier <mc.tessier@orange.fr>',
      date : '08/04/2026',
      body : `Bonjour Lauralie,

Merci pour votre réponse rapide. Pour la date, je pensais au 4 septembre,
date d'anniversaire de naissance de mon père. Ça nous laisse jusqu'en septembre.

Les vidéos sont sur les téléphones de mes frères et sœurs, en format mp4 je crois.
Il y a aussi une vieille cassette VHS d'un mariage de famille en 1978 que j'aimerais
inclure si c'est possible.

Est-ce que la vidéo hommage est vraiment nécessaire ou la page suffit ?
Et c'est quoi les délais et les tarifs en gros ?

Cordialement,
Marie-Claire`
    }
  ];

  Logger.log('\n══ TEST SUIVI ══');
  const output = callClaudeForReply(fakeHistory, 'Marie-Claire Tessier', 'Re: Hommage Robert Tessier');
  const { analyse, briefMichael, brouillon } = parseClaudeOutput(output);

  Logger.log('\n── ANALYSE ──\n'        + analyse);
  Logger.log('\n── BRIEF MICHAËL ──\n' + briefMichael);
  Logger.log('\n── BROUILLON ──\n'     + brouillon);

  createGmailDraft(
    CONFIG.MON_EMAIL,
    '[TEST SUIVI] Re: Hommage Robert Tessier',
    analyse, briefMichael, brouillon,
    { 'Client': 'Marie-Claire Tessier', 'Email': CONFIG.MON_EMAIL }, 'SUIVI'
  );
  Logger.log('\n✅ Brouillons de suivi créés dans Gmail.');
}

/** Test avec un formulaire d'accompagnement fictif. */
function testAccompagnement() {
  _runTest('ACCOMPAGNEMENT', {
    'Prénom et nom'  : 'Sophie Fontaine',
    'Email'          : CONFIG.MON_EMAIL,
    'Téléphone'      : '06 12 34 56 78',
    'honor_name'     : 'Élise Fontaine',
    'honor_birth'    : '12/03/1948',
    'relation'       : 'Ma mère',
    'page_souvenir'  : 'oui',
    'Message'        : 'Bonjour, ma mère est décédée il y a 3 semaines. Je souhaite créer quelque chose de beau avec ses photos. Elle aimait le jardinage et la lecture. Je voudrais une plaque et une page en ligne. Est-ce que c\'est possible rapidement ?'
  });
}

/** Test avec un devis simple. */
function testDevis() {
  _runTest('DEVIS', {
    'Nom'     : 'Jean-Pierre Moreau',
    'Email'   : CONFIG.MON_EMAIL,
    'Message' : 'Bonjour, j\'ai perdu mon père en décembre. Je voudrais savoir combien coûte une plaque avec QR code et une page souvenir. Merci'
  });
}

/** Test avec un contact hésitant. */
function testHesitant() {
  _runTest('CONTACT', {
    'Nom'     : 'Martine Dubois',
    'Email'   : CONFIG.MON_EMAIL,
    'Message' : 'Bonjour, j\'ai vu votre site. C\'est une belle idée mais je ne suis pas sûre que ma belle-mère apprécierait quelque chose de numérique. Elle était peu technophile. Est-ce que ça vaut vraiment le coup ?'
  });
}

function _runTest(type, fakeData) {
  Logger.log(`\n══ TEST [${type}] ══`);
  const raw    = Object.entries(fakeData).map(([k,v]) => `${k}: ${v}`).join('\n');
  const output = callClaude(fakeData, type, raw);
  const { analyse, briefMichael, brouillon } = parseClaudeOutput(output);

  Logger.log('\n── ANALYSE LAURALIE ──\n'   + analyse);
  Logger.log('\n── BRIEF MICHAËL ──\n'      + briefMichael);
  Logger.log('\n── BROUILLON CLIENT ──\n'   + brouillon);

  createGmailDraft(CONFIG.MON_EMAIL, `[TEST ${type}] New submission`, analyse, briefMichael, brouillon, fakeData, type);
  Logger.log('\n✅ Brouillons de test créés dans Gmail.');
}
