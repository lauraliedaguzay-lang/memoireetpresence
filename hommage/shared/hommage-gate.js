(function () {
  "use strict";

  var gate = document.getElementById("hommage-gate");
  var content = document.getElementById("hommage-content");
  var form = document.getElementById("hommage-gate-form");
  var input = document.getElementById("hommage-code");
  var err = document.getElementById("hommage-gate-err");

  if (!gate || !content || !form || !input) return;

  var slug = document.body.getAttribute("data-hommage-slug") || "default";
  var storageKey = "mp_hommage_ok_" + slug;
  var expected =
    typeof window.HOMMAGE_ACCESS_CODE === "string"
      ? window.HOMMAGE_ACCESS_CODE
      : "";

  function showError(msg) {
    if (!err) return;
    err.textContent = msg;
    err.hidden = false;
  }

  function clearError() {
    if (!err) return;
    err.textContent = "";
    err.hidden = true;
  }

  function unlock() {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (e) {
      /* ignore */
    }
    gate.setAttribute("hidden", "");
    gate.hidden = true;
    content.removeAttribute("hidden");
    content.hidden = false;
    content.querySelectorAll(".fade-in-section").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (document.body.getAttribute("data-hommage-demo-open") === "true") {
    unlock();
    return;
  }

  if (sessionStorage.getItem(storageKey) === "1") {
    unlock();
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();
    var v = (input.value || "").trim();
    if (!expected) {
      showError("Configuration incomplète : définir HOMMAGE_ACCESS_CODE sur la page.");
      return;
    }
    if (v !== expected) {
      showError("Code incorrect. Vérifiez auprès de la famille ou réessayez.");
      input.value = "";
      input.focus();
      return;
    }
    unlock();
  });
})();
