(function () {
  /** Mémorisé uniquement après réponse 200 de la fonction Netlify — pas après repli client (GH Pages). */
  var STORAGE_SERVER_OK = "hommage_demo_netlify_ok_";
  var DEFAULT_VERIFY_URL = "/.netlify/functions/verify-hommage-demo";

  function norm(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function tryVerifyServer(verifyUrl, slug, rawCode) {
    return fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug, code: rawCode }),
    })
      .then(function (res) {
        if (res.status === 404) {
          return { kind: "fallback" };
        }
        return res.json().then(function (data) {
          if (res.ok && data && data.ok) {
            return { kind: "ok" };
          }
          if (res.status === 401 || res.status === 403) {
            return { kind: "reject" };
          }
          return { kind: "fallback" };
        });
      })
      .catch(function () {
        return { kind: "fallback" };
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var access = (document.body.getAttribute("data-hommage-access") || "")
      .trim()
      .toLowerCase();
    var gate = document.getElementById("hommage-gate");
    var content = document.getElementById("hommage-content");
    var skip = document.querySelector('a.skip-link[href^="#hommage"]');

    /* Maquette sans code : jamais de porte, contenu toujours visible */
    if (access === "open" || access === "public") {
      if (gate) gate.hidden = true;
      if (content) {
        content.removeAttribute("hidden");
        content.hidden = false;
      }
      if (skip) skip.setAttribute("href", "#hommage-content");
      document.dispatchEvent(
        new CustomEvent("hommage:unlocked", { detail: { slug: "open", mode: "public" } })
      );
      return;
    }

    /* Maquette à code : uniquement si explicitement demandé */
    if (access !== "code") return;

    var form = document.getElementById("hommage-gate-form");
    var err = document.getElementById("hommage-gate-error");
    if (!gate || !form || !content) return;

    var slug = document.body.getAttribute("data-hommage-slug") || "hommage";
    var keyServerOk = STORAGE_SERVER_OK + slug;
    var verifyUrl =
      (gate.getAttribute("data-verify-url") || "").trim() || DEFAULT_VERIFY_URL;
    var codesAttr = gate.getAttribute("data-demo-codes") || "presence";
    var codes = codesAttr.split(",").map(norm).filter(Boolean);

    function clearError() {
      if (!err) return;
      err.textContent = "";
      err.setAttribute("hidden", "");
    }

    function showError(msg) {
      if (!err) return;
      err.textContent = msg;
      err.removeAttribute("hidden");
    }

    function unlock(persistOnlyIfServer) {
      gate.hidden = true;
      content.hidden = false;
      if (skip) skip.setAttribute("href", "#hommage-content");
      if (persistOnlyIfServer) {
        try {
          sessionStorage.setItem(keyServerOk, "1");
        } catch (e) {}
      }
      document.dispatchEvent(new CustomEvent("hommage:unlocked", { detail: { slug: slug } }));
    }

    try {
      if (sessionStorage.getItem(keyServerOk) === "1") {
        unlock(false);
        return;
      }
    } catch (e) {}

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('[name="code"], #hommage-gate-code');
      var raw = input ? input.value : "";
      var v = norm(raw);

      tryVerifyServer(verifyUrl, slug, raw).then(function (result) {
        if (result.kind === "ok") {
          clearError();
          unlock(true);
          return;
        }
        if (result.kind === "reject") {
          showError("Code incorrect (vérification serveur).");
          return;
        }
        if (codes.indexOf(v) !== -1) {
          clearError();
          unlock(false);
        } else {
          showError(
            "Code incorrect. Il est indiqué sur la page « Maquettes hommage », sous la carte Famille Martin."
          );
        }
      });
    });
  });
})();
