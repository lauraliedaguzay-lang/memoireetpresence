/**
 * Mémoire & Présence — Assistant Claude pour Gmail
 * Google Apps Script — coller dans script.google.com
 *
 * Flux : Netlify envoie un email → script détecte → Claude analyse
 *        → brouillon de réponse créé dans Gmail de Lauralie
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG = {
  CLAUDE_API_KEY  : 'sk-ant-XXXXXXXX',          // ← Remplacer par ta clé Anthropic
  CLAUDE_MODEL    : 'claude-3-5-haiku-20241022', // rapide + économique
  NETLIFY_SENDER  : 'team@netlify.com',
  MON_EMAIL       : 'memoirepresence@gmail.com',
  MAX_TOKENS      : 700,
};

// ─── PROMPT SYSTÈME ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es l'assistante de Lauralie, cofondatrice de Mémoire & Présence.
Mémoire & Présence crée des hommages numériques pour des familles en deuil :
pages souvenir privées (photos, texte, galerie, livre d'or), plaques QR gravées (ardoise,
pierre, métal), vidéos hommage montées par Michaël (vidéaste professionnel).

TON ET VALEURS :
- Chaleureux, sobre, humain — jamais commercial ni générique
- Tu t'adresses à des personnes en deuil ou anticipant un hommage
- Discrétion absolue, soin du détail, rythme humain
- Pas de tarif dans la première réponse (uniquement sur devis)
- Délai habituel : 2 à 5 semaines selon complexité

TYPES DE DEMANDES À RECONNAÎTRE :
1. CONTACT SIMPLE → réponse courte, chaleureuse, proposer un appel ou échange
2. DEVIS → accuser réception, demander ce qui manque, annoncer délai de réponse (24h)
3. ACCOMPAGNEMENT → montrer qu'on a lu le formulaire détaillé, citer des éléments spécifiques
4. VIDÉO → préciser que c'est Michaël qui monte en interne, demander les éléments disponibles

FORMAT DE TA RÉPONSE :
- Commence par "Madame, Monsieur," ou le prénom si connu
- Corps : 150–250 mots maximum
- Signe : "Lauralie\nMémoire & Présence\nmemoirepresence@gmail.com — 07 86 17 37 15"
- Ton sobre et sincère, jamais de "formidable" ou "super"
- Si des infos manquent, pose 1 à 2 questions précises (pas plus)
- Si urgence mentionnée, l'adresser directement`;

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
      Logger.log(`Erreur sur thread : ${e.message}`);
    }
  });
}

// ─── TRAITEMENT D'UN THREAD ───────────────────────────────────────────────────

function processThread(thread) {
  const messages = thread.getMessages();
  const msg = messages[messages.length - 1];

  if (!msg.isUnread()) return;

  const rawBody  = msg.getPlainBody() || stripHtml(msg.getBody());
  const formData = parseNetlifyBody(rawBody);
  const formType = detectFormType(msg.getSubject(), formData);

  Logger.log(`Traitement : ${formType} — ${JSON.stringify(formData)}`);

  const reply    = callClaude(formData, formType, rawBody);
  const clientEmail = extractClientEmail(formData);

  createGmailDraft(clientEmail, msg.getSubject(), reply, formData, formType);
  msg.markRead();
}

// ─── PARSING EMAIL NETLIFY ────────────────────────────────────────────────────

function parseNetlifyBody(body) {
  const data = {};
  const clean = body.replace(/\r/g, '').trim();
  const lines = clean.split('\n');

  lines.forEach(line => {
    // Format Netlify : "Clé: valeur" ou "Clé : valeur"
    const match = line.match(/^([^:]{2,40}):\s*(.+)$/);
    if (match && match[2].trim().length > 0) {
      data[match[1].trim()] = match[2].trim();
    }
  });

  return data;
}

function detectFormType(subject, formData) {
  const s = subject.toLowerCase();
  if (s.includes('accompagnement') || formData['honor_name'] || formData['Prénom et nom']) {
    return 'ACCOMPAGNEMENT';
  }
  if (s.includes('devis') || formData['budget'] || formData['type_projet']) {
    return 'DEVIS';
  }
  if (s.includes('video') || s.includes('vidéo') || formData['video']) {
    return 'VIDEO';
  }
  return 'CONTACT';
}

function extractClientEmail(formData) {
  const keys = ['email', 'Email', 'E-mail', 'mail', 'Mail', 'votre_email', 'votre-email'];
  for (const k of keys) {
    if (formData[k] && formData[k].includes('@')) return formData[k];
  }
  return null;
}

// ─── APPEL API CLAUDE ─────────────────────────────────────────────────────────

function callClaude(formData, formType, rawBody) {
  const url = 'https://api.anthropic.com/v1/messages';

  const userContent = buildUserMessage(formData, formType, rawBody);

  const payload = {
    model   : CONFIG.CLAUDE_MODEL,
    max_tokens: CONFIG.MAX_TOKENS,
    system  : SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }]
  };

  const options = {
    method : 'post',
    headers: {
      'x-api-key'         : CONFIG.CLAUDE_API_KEY,
      'anthropic-version' : '2023-06-01',
      'content-type'      : 'application/json'
    },
    payload           : JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result   = JSON.parse(response.getContentText());

  if (result.error) {
    Logger.log(`Erreur Claude : ${result.error.message}`);
    return `[Erreur Claude — répondre manuellement]\n${result.error.message}`;
  }

  return result.content?.[0]?.text || '[Réponse vide — vérifier la clé API]';
}

function buildUserMessage(formData, formType, rawBody) {
  const formJson = Object.entries(formData)
    .map(([k, v]) => `• ${k} : ${v}`)
    .join('\n');

  return `TYPE DE FORMULAIRE DÉTECTÉ : ${formType}

DONNÉES REÇUES :
${formJson}

CORPS BRUT (si champs non parsés) :
${rawBody.substring(0, 1500)}

Rédige une réponse de premier contact adaptée à cette demande.`;
}

// ─── CRÉATION DU BROUILLON GMAIL ──────────────────────────────────────────────

function createGmailDraft(clientEmail, originalSubject, claudeReply, formData, formType) {
  const subject = originalSubject.startsWith('Re:')
    ? originalSubject
    : `Re: ${originalSubject}`;

  const separator = '─'.repeat(50);

  const draftBody =
`${claudeReply}

${separator}
💡 BROUILLON SUGGÉRÉ PAR CLAUDE — RELIRE AVANT ENVOI
Type détecté : ${formType}
${separator}
DONNÉES DU FORMULAIRE :
${Object.entries(formData).map(([k,v]) => `${k}: ${v}`).join('\n')}
${separator}`;

  if (clientEmail) {
    GmailApp.createDraft(clientEmail, subject, draftBody);
    Logger.log(`✅ Brouillon créé → ${clientEmail}`);
  } else {
    // Pas d'email client trouvé → brouillon interne pour traitement manuel
    GmailApp.createDraft(
      CONFIG.MON_EMAIL,
      `⚠️ [EMAIL CLIENT MANQUANT] ${subject}`,
      `Email client non trouvé dans le formulaire.\n\n${draftBody}`
    );
    Logger.log('⚠️ Email client absent — brouillon interne créé');
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
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── INSTALLATION ─────────────────────────────────────────────────────────────

/**
 * Appeler UNE SEULE FOIS depuis l'éditeur Apps Script pour activer la vérification
 * automatique toutes les 5 minutes.
 */
function installTrigger() {
  // Supprimer les anciens déclencheurs pour éviter les doublons
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('checkNewNetlifyForms')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('✅ Déclencheur installé — vérification toutes les 5 minutes.');
  Logger.log('   Brouillons apparaîtront dans Brouillons de Gmail.');
}

/**
 * Test manuel — appeler depuis l'éditeur pour tester sans attendre un vrai email.
 */
function testAvecDonnesFictives() {
  const fakeFormData = {
    'Prénom et nom'  : 'Sophie Fontaine',
    'Email'          : 'sophie.fontaine@example.com',
    'Téléphone'      : '06 12 34 56 78',
    'honor_name'     : 'Élise Fontaine',
    'honor_birth'    : '12/03/1948',
    'relation'       : 'Ma mère',
    'page_souvenir'  : 'oui',
    'Message'        : 'Bonjour, ma mère est décédée en janvier. Je souhaite créer un hommage avec une plaque et une page en ligne avec ses photos. Pouvez-vous me contacter ?'
  };

  const reply = callClaude(fakeFormData, 'ACCOMPAGNEMENT', JSON.stringify(fakeFormData));
  Logger.log('\n=== RÉPONSE CLAUDE ===\n' + reply);

  createGmailDraft(
    CONFIG.MON_EMAIL,
    '[TEST] New submission from accompagnement',
    reply,
    fakeFormData,
    'ACCOMPAGNEMENT'
  );

  Logger.log('✅ Brouillon de test créé dans Gmail.');
}
