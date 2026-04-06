/**
 * Pinapp — Assistant Claude pour Gmail
 * Google Apps Script — coller dans script.google.com (compte lauralie.daguzay@gmail.com)
 *
 * Flux : formulaire Netlify → AR automatique → Claude analyse
 *        → brouillon réponse + analyse dans Gmail → notif push téléphone
 *
 * Différences vs Mémoire & Présence :
 *   - Pas de brief Michaël (pas de composante vidéo)
 *   - Email : lauralie.daguzay@gmail.com
 *   - Prompt système adapté à pinapp
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG_PINAPP = {
  CLAUDE_API_KEY : 'sk-ant-XXXXXXXX',            // ← Même clé Anthropic ou nouvelle
  CLAUDE_MODEL   : 'claude-3-5-haiku-20241022',
  NETLIFY_SENDER : 'team@netlify.com',
  MON_EMAIL      : 'lauralie.daguzay@gmail.com',  // ← Email pinapp
  MAX_TOKENS     : 1200,
  LABEL_SUIVI    : 'PP-Suivi',                    // Label Gmail pour les threads à suivre
};

// ─── PROMPT SYSTÈME ───────────────────────────────────────────────────────────
// ⚠️ À COMPLÉTER avec la description précise de pinapp dès que disponible

const SYSTEM_PROMPT_PINAPP = `Tu es l'assistante de Lauralie, fondatrice de Pinapp.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
PINAPP — CONTEXTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
[À COMPLÉTER : description du service pinapp]
[À COMPLÉTER : cible client (particuliers / professionnels ?)]
[À COMPLÉTER : offre principale et tarification]
[À COMPLÉTER : valeurs de la marque]

━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRUCTURE DE RÉPONSE OBLIGATOIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Produis TOUJOURS deux blocs :

===ANALYSE_POUR_LAURALIE===
[Coaching confidentiel pour Lauralie]
===FIN_ANALYSE===

===BROUILLON_CLIENT===
[Texte de réponse à envoyer au client]
===FIN_BROUILLON===

━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOC 1 — ANALYSE POUR LAURALIE
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STADE DU CLIENT
- DÉCOUVERTE : curieux, pas encore décidé
- INTÉRESSÉ : veut en savoir plus ou un devis
- PRÊT À COMMANDER : attend confirmation pratique
- HÉSITANT : a des freins (prix ? délai ? confiance ?)

💡 CE QUE CE CLIENT CHERCHE VRAIMENT
1-2 phrases sur le besoin réel.

⚡ OPPORTUNITÉ PRINCIPALE
Point fort à mettre en avant dans cette réponse.

⚠️ POINTS D'ATTENTION
Ce qui pourrait bloquer.

🎯 OBJECTIF DE CETTE RÉPONSE
Ex: "Obtenir un appel" / "Envoyer un devis" / "Rassurer"

📋 PROCHAINES ÉTAPES
- Étape 1 (cette réponse)
- Étape 2 (suivi J+3 si silence)
- Étape 3 (après accord)

💬 TON RECOMMANDÉ

━━━━━━━━━━━━━━━━━━━━━━━━━━━

?? AUDIT SATISFACTION CLIENT 100%

CE QUE LE CLIENT VEUT EXPLICITEMENT :
(Traduire sa demande en besoin concret)

CE QUE LE CLIENT VEUT IMPLICITEMENT :
(Ce qu'il n'a pas dit mais qui est evident selon son profil)

RISQUES DE DECEPTION :
- Delai, ton, promesse non tenable, information manquante ?

SCORE DE SATISFACTION ESTIME :
Si on repond bien : [X]% | Si on repond mal : risque de [Y]%

POUR ATTEINDRE 100% IL FAUT :
Liste precise et ordonnee des actions a faire.

BLOC 2 — BROUILLON CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Commence par "Madame," / "Monsieur," / prénom si connu
- 150 à 250 mots maximum
- Jamais de tarif en premier contact
- Jamais de formules creuses
- 1 à 2 questions précises si infos manquantes
- Action claire en fin (appel, devis, lien)
- Signature : "Lauralie\\nPinapp\\nlauralie.daguzay@gmail.com"`;

// ─── POINT D'ENTRÉE ───────────────────────────────────────────────────────────

function checkAll_Pinapp() {
  checkNetlify_Pinapp();
  checkReplies_Pinapp();
}

function checkNetlify_Pinapp() {
  const threads = GmailApp.search(
    `from:(${CONFIG_PINAPP.NETLIFY_SENDER}) is:unread subject:"New submission"`, 0, 20
  );
  if (!threads.length) { Logger.log('Pinapp Netlify : rien.'); return; }
  threads.forEach(t => { try { processThread_Pinapp(t); } catch(e) { Logger.log(e.message); } });
}

function checkReplies_Pinapp() {
  const threads = GmailApp.search(
    `label:${CONFIG_PINAPP.LABEL_SUIVI} is:unread -from:(${CONFIG_PINAPP.NETLIFY_SENDER}) -from:(me)`, 0, 20
  );
  if (!threads.length) { Logger.log('Pinapp suivis : rien.'); return; }
  threads.forEach(t => { try { processReply_Pinapp(t); } catch(e) { Logger.log(e.message); } });
}

// ─── TRAITEMENT FORMULAIRE ────────────────────────────────────────────────────

function processThread_Pinapp(thread) {
  const msg      = thread.getMessages().slice(-1)[0];
  if (!msg.isUnread()) return;

  const rawBody  = msg.getPlainBody() || stripHtml_PP(msg.getBody());
  const formData = parseBody_PP(rawBody);
  const formType = detectType_PP(msg.getSubject(), formData);
  const email    = extractEmail_PP(formData);

  Logger.log(`[Pinapp ${formType}] ${JSON.stringify(formData)}`);

  _sendAR_PP(email, formData, formType);

  const output   = _callClaude_PP(buildMessage_PP(formData, formType, rawBody));
  const { analyse, brouillon } = _parseOutput_PP(output);

  _createDraft_PP(email, msg.getSubject(), analyse, brouillon, formData, formType);
  _sendNotif_PP(formType, formData, email);
  msg.markRead();
}

// ─── TRAITEMENT RÉPONSE CLIENT ────────────────────────────────────────────────

function processReply_Pinapp(thread) {
  const messages = thread.getMessages();
  const last     = messages.slice(-1)[0];
  if (!last.isUnread()) return;

  const history  = messages.slice(-10).map(m => ({
    from: m.getFrom(),
    date: m.getDate().toLocaleDateString('fr-FR'),
    body: (m.getPlainBody() || stripHtml_PP(m.getBody())).substring(0, 800)
  }));

  const clientEmail = last.getFrom().match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null;
  const clientName  = last.getFrom().replace(/<.*>/, '').trim();
  const subject     = thread.getFirstMessageSubject();

  const historyText = history.map((m,i) =>
    `[Message ${i+1} — ${m.from} — ${m.date}]\n${m.body}`
  ).join('\n\n---\n\n');

  const userContent = `TYPE : SUIVI\nCLIENT : ${clientName}\n\nHISTORIQUE :\n${historyText}\n\nGénère analyse + brouillon selon la structure habituelle.`;

  const output  = _callClaude_PP(userContent);
  const { analyse, brouillon } = _parseOutput_PP(output);

  _createDraft_PP(clientEmail, subject, analyse, brouillon,
    { 'Client': clientName, 'Email': clientEmail || '' }, 'SUIVI');
  _sendNotif_PP('SUIVI', { 'Nom': clientName }, clientEmail);
  last.markRead();
}

// ─── AR AUTOMATIQUE ───────────────────────────────────────────────────────────

function _sendAR_PP(email, formData, formType) {
  if (!email) return;
  const nom  = formData['Nom'] || formData['Prénom et nom'] || formData['name'] || '';
  const salut = nom ? `${nom.split(' ')[0]},` : 'Madame, Monsieur,';

  const body =
`${salut}

Votre message a bien été reçu. Nous vous répondons en principe sous 24 h.

Lauralie
Pinapp
lauralie.daguzay@gmail.com`;

  try {
    GmailApp.sendEmail(email, 'Votre demande — Pinapp', body);
    Logger.log(`✅ AR Pinapp → ${email}`);
  } catch(e) { Logger.log(`⚠️ AR Pinapp échoué : ${e.message}`); }
}

// ─── APPEL CLAUDE ─────────────────────────────────────────────────────────────

function _callClaude_PP(userContent) {
  if (CONFIG_PINAPP.CLAUDE_API_KEY === 'sk-ant-XXXXXXXX')
    throw new Error('⚠️ Remplace la clé API ligne 17');

  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method            : 'post',
    headers           : {
      'x-api-key'        : CONFIG_PINAPP.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type'     : 'application/json'
    },
    payload           : JSON.stringify({
      model     : CONFIG_PINAPP.CLAUDE_MODEL,
      max_tokens: CONFIG_PINAPP.MAX_TOKENS,
      system    : SYSTEM_PROMPT_PINAPP,
      messages  : [{ role: 'user', content: userContent }]
    }),
    muteHttpExceptions: true
  });

  const r = JSON.parse(res.getContentText());
  if (r.error) throw new Error(`Claude : ${r.error.message}`);
  return r.content?.[0]?.text || '';
}

function buildMessage_PP(formData, formType, rawBody) {
  return `TYPE : ${formType}\n\nDONNÉES :\n${Object.entries(formData).map(([k,v])=>`• ${k} : ${v}`).join('\n')}\n\nBRUT :\n${rawBody.substring(0,1500)}`;
}

// ─── PARSING ──────────────────────────────────────────────────────────────────

function _parseOutput_PP(text) {
  const a = text.match(/===ANALYSE_POUR_LAURALIE===([\s\S]*?)===FIN_ANALYSE===/);
  const b = text.match(/===BROUILLON_CLIENT===([\s\S]*?)===FIN_BROUILLON===/);
  return {
    analyse  : a ? a[1].trim() : '[Analyse non générée]',
    brouillon: b ? b[1].trim() : text.trim()
  };
}

function parseBody_PP(body) {
  const data = {};
  body.replace(/\r/g,'').split('\n').forEach(line => {
    const m = line.match(/^([^:]{2,60}):\s*(.+)$/);
    if (m) data[m[1].trim()] = m[2].trim();
  });
  return data;
}

function detectType_PP(subject, formData) {
  const s = (subject||'').toLowerCase();
  if (s.includes('devis') || formData['budget']) return 'DEVIS';
  if (s.includes('contact'))                      return 'CONTACT';
  return 'CONTACT';
}

function extractEmail_PP(formData) {
  for (const k of ['email','Email','E-mail','mail']) {
    if (formData[k]?.includes('@')) return formData[k];
  }
  return null;
}

// ─── BROUILLON + NOTIF ────────────────────────────────────────────────────────

function _createDraft_PP(email, originalSubject, analyse, brouillon, formData, formType) {
  const subject = `Re: ${originalSubject.replace(/^Re:\s*/i,'')}`;
  const bar     = '─'.repeat(48);
  const body    =
`${brouillon}


${bar}
🔒 CONFIDENTIEL — SUPPRIMER AVANT D'ENVOYER [${formType}]
${bar}

${analyse}

${bar}
FORMULAIRE
${Object.entries(formData).map(([k,v])=>`${k} : ${v}`).join('\n')}
${bar}`;

  if (email) {
    GmailApp.createDraft(email, subject, body);
    Logger.log(`✅ Brouillon Pinapp → ${email}`);
  } else {
    GmailApp.createDraft(CONFIG_PINAPP.MON_EMAIL, `⚠️ [EMAIL MANQUANT] ${subject}`, body);
  }
}

function _sendNotif_PP(formType, formData, email) {
  try {
    const nom = formData['Prénom et nom'] || formData['Nom'] || formData['name'] || 'Client inconnu';
    MailApp.sendEmail({
      to     : CONFIG_PINAPP.MON_EMAIL,
      subject: `🔔 PP — ${formType} · ${nom}`,
      body   : `Nouveau brouillon Pinapp prêt dans Gmail.\n\nClient : ${nom}\nEmail  : ${email||'non renseigné'}\n\n→ Ouvrir Gmail → Brouillons.`
    });
  } catch(e) { Logger.log(`⚠️ Notif PP : ${e.message}`); }
}

function stripHtml_PP(html) {
  return html.replace(/<br\s*\/?>/gi,'\n').replace(/<\/p>/gi,'\n').replace(/<[^>]+>/g,'')
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\n{3,}/g,'\n\n').trim();
}

// ─── INSTALLATION ─────────────────────────────────────────────────────────────

function installTrigger_Pinapp() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('checkAll_Pinapp').timeBased().everyMinutes(5).create();
  Logger.log('✅ Trigger Pinapp installé — vérification toutes les 5 min.');
  Logger.log('   → Créer le label "PP-Suivi" dans Gmail (lauralie.daguzay@gmail.com)');
  Logger.log('   → Compléter SYSTEM_PROMPT_PINAPP avec la description du service');
}

function testPinapp() {
  const fake = {
    'Nom'    : 'Thomas Bernard',
    'Email'  : CONFIG_PINAPP.MON_EMAIL,
    'Message': 'Bonjour, j\'ai découvert pinapp et je voudrais en savoir plus sur vos services et les tarifs.'
  };
  const output = _callClaude_PP(buildMessage_PP(fake, 'CONTACT', JSON.stringify(fake)));
  const { analyse, brouillon } = _parseOutput_PP(output);
  Logger.log('\n── ANALYSE ──\n' + analyse);
  Logger.log('\n── BROUILLON ──\n' + brouillon);
  _createDraft_PP(CONFIG_PINAPP.MON_EMAIL, '[TEST] Demande pinapp', analyse, brouillon, fake, 'CONTACT');
  Logger.log('✅ Test Pinapp terminé — vérifier Gmail (lauralie.daguzay@gmail.com)');
}

// ─── HEALTH CHECK HEBDOMADAIRE PINAPP ────────────────────────────────────────

function weeklyHealthCheck_PP() {
  const urls = [
    { url: 'https://lauraliedaguzay-lang.github.io/pinapp-site/', label: 'Pinapp GitHub Pages' },
    // Ajouter les URLs pinapp dès que le domaine est actif
  ];

  const down = [];

  urls.forEach(({ url, label }) => {
    try {
      const res  = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      const code = res.getResponseCode();
      if (code !== 200) down.push(`❌ ${label} → HTTP ${code}`);
      else Logger.log(`✅ ${label} → OK`);
    } catch (e) {
      down.push(`❌ ${label} → ${e.message}`);
    }
  });

  if (down.length > 0) {
    MailApp.sendEmail({
      to     : CONFIG_PINAPP.MON_EMAIL,
      subject: '🚨 Pinapp — Site en panne',
      body   : down.join('\n') + '\n\nIntervenir dès que possible.',
    });
  } else {
    Logger.log('✅ Pinapp health check OK.');
  }
}

function installHealthCheckTrigger_PP() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'weeklyHealthCheck_PP')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('weeklyHealthCheck_PP')
    .timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();
  Logger.log('✅ [Pinapp] Health check installé — chaque lundi 7h.');
}