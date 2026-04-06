/**
 * Vérification serveur du code d’accès — maquette « Famille Martin » (démo).
 * Variable Netlify : HOMMAGE_DEMO_CODE_FAMILLE_MARTIN (sinon défaut "presence").
 * Ne remplace pas une base de données : pour la production réelle, prévoir auth serveur + stockage par projet.
 */
function normalizeCode(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "method_not_allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "invalid_json" }),
    };
  }

  const slug = String(body.slug || "").trim();
  const code = body.code;

  if (slug !== "famille-martin") {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ ok: false, error: "unknown_slug" }),
    };
  }

  const expected =
    process.env.HOMMAGE_DEMO_CODE_FAMILLE_MARTIN || "presence";

  if (normalizeCode(code) === normalizeCode(expected)) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, slug }),
    };
  }

  return {
    statusCode: 401,
    headers,
    body: JSON.stringify({ ok: false, error: "invalid_code" }),
  };
};
