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
  CLAUDE_API_KEY : 'sk-ant-XXXXXXXX',           // ← Remplacer par ta clé Anthropic
  CLAUDE_MODEL   : 'claude-3-5-haiku-20241022',  // rapide + économique
  NETLIFY_SENDER : 'team@netlify.com',
  MON_EMAIL      : 'memoirepresence@gmail.com',
  MAX_TOKENS     : 1800,
  EMAIL_MICHAEL  : 'michael@memoire-et-presence.fr', // ← Remplacer par le vrai email de Michaël
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
BLOC 2 — BRIEF POUR MICHAËL
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ce bloc est une note interne que Lauralie va transférer à Michaël.
Il doit être clair, actionnable, sans jargon commercial.

Si le projet ne nécessite PAS l'intervention de Michaël (contact simple, devis sans vidéo,
question générale), écrire simplement : "RAS — pas d'intervention Michaël à ce stade."

Sinon, inclure :

🎬 TYPE DE MISSION
Ex: "Vidéo hommage", "Retouche photo", "Montage diaporama animé", "Export clé USB"

📦 ÉLÉMENTS DISPONIBLES CÔTÉ CLIENT
Ce que le client a mentionné : photos (combien ?), vidéos courtes, musique choisie, voix off souhaitée ou non.

📐 SPÉCIFICATIONS TECHNIQUES ATTENDUES
- Format de rendu : MP4 HD 1080p (standard page hommage) ou 4K si export physique
- Durée estimée : ex. "2-3 min" selon le nombre de photos
- Style : sobre, transitions douces, palette chaude — cohérent avec la charte M&P
- Musique : à choisir en bibliothèque libre de droits ou fournie par le client
- Voix off : oui / non / à préciser avec le client

⏱️ DÉLAI
Basé sur la demande client et le délai standard 2-5 semaines.
Ex: "Livraison souhaitée avant le 15 mai — prévoir rendu Michaël pour le 10 mai."

✅ VALIDATION
"Lauralie valide avant envoi au client — 1 cycle de retouche inclus."

❓ QUESTIONS POUR MICHAËL
Ce que Lauralie doit lui demander avant de lancer (si des infos manquent).

━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

function checkNewNetlifyForms() {
  const query = `from:(${CONFIG.NETLIFY_SENDER}) is:unread subject:"New submission"`;
  const threads = GmailApp.search(query, 0, 20);

  if (threads.length === 0) {
    Logger.log('Aucune nouvelle soumission Netlify.');
    return;
  }

  threads.forEach(thread => {
    try {
      processThread(thread);
    } catch (e) {
      Logger.log(`Erreur sur thread ${thread.getId()} : ${e.message}`);
    }
  });
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

function callClaude(formData, formType, rawBody) {
  const formLines = Object.entries(formData).map(([k,v]) => `• ${k} : ${v}`).join('\n');

  const userContent =
`TYPE DE FORMULAIRE : ${formType}

DONNÉES REÇUES :
${formLines}

CORPS BRUT (si champs supplémentaires non parsés) :
${rawBody.substring(0, 2000)}

Produis l'analyse pour Lauralie ET le brouillon client selon la structure demandée.`;

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

  const response = UrlFetchApp.fetch(CONFIG.CLAUDE_API_KEY !== 'sk-ant-XXXXXXXX'
    ? 'https://api.anthropic.com/v1/messages'
    : (() => { throw new Error('⚠️ Remplace sk-ant-XXXXXXXX par ta vraie clé API (ligne 12)'); })()
  , options);

  const result = JSON.parse(response.getContentText());
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
  ScriptApp.newTrigger('checkNewNetlifyForms')
    .timeBased()
    .everyMinutes(5)
    .create();
  Logger.log('✅ Déclencheur installé — vérification toutes les 5 min.');
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
