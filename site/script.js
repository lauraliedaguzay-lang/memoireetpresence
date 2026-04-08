(function () {
  "use strict";

  /* Ancienne barre mobile (#bottom-nav) : retirer le nœud même si un script / cache
     Netlify injecte encore l’ancienne logique. Le CSS masque aussi, mais le DOM
     disparaît ainsi (pas d’espace résiduel, pas de liens fantômes). */
  function stripLegacyBottomNav() {
    var dock = document.getElementById("bottom-nav");
    if (dock) {
      dock.remove();
    }
    document.body.classList.remove("has-bottom-nav");
  }
  stripLegacyBottomNav();
  if (typeof MutationObserver !== "undefined" && document.body) {
    var bottomNavMo = new MutationObserver(function (mutations) {
      for (var m = 0; m < mutations.length; m++) {
        var nodes = mutations[m].addedNodes;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if (node.nodeType !== 1) continue;
          if (node.id === "bottom-nav") {
            node.remove();
            document.body.classList.remove("has-bottom-nav");
            return;
          }
        }
      }
    });
    bottomNavMo.observe(document.body, { childList: true, subtree: true });
  }

  const CONTACT_EMAIL = "memoirepresence@gmail.com";

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Footer legal: inject SIREN/SIRET everywhere (from INSEE).
  (function injectLegalIds() {
    var el = document.querySelector(".site-footer__siret");
    if (!el) return;
    var siren = "523\u00a0884\u00a0898";
    var siret = "523\u00a0884\u00a0898\u00a000017";
    el.innerHTML =
      "SIREN : " +
      siren +
      " \u00b7 SIRET : " +
      siret;
  })();

  const nav = document.getElementById("nav-principale");
  const toggle = document.getElementById("nav-toggle");
  const headerInner = document.querySelector(".site-header__inner");

  var bodyScrollLockY = null;
  var navBackdrop = null;

  var closeMainNav = function () {};

  function applyBodyScrollLock(lock) {
    if (lock) {
      if (bodyScrollLockY !== null) {
        return;
      }
      bodyScrollLockY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return;
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (bodyScrollLockY !== null) {
      var y = bodyScrollLockY;
      bodyScrollLockY = null;
      window.requestAnimationFrame(function () {
        window.scrollTo(0, y);
      });
    }
  }

  function syncNavBackdrop(open) {
    if (!navBackdrop) return;
    var mobile = window.matchMedia("(max-width: 767px)").matches;
    if (!mobile) {
      navBackdrop.classList.remove("site-nav-backdrop--visible");
      navBackdrop.setAttribute("aria-hidden", "true");
      return;
    }
    navBackdrop.classList.toggle("site-nav-backdrop--visible", open);
    navBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function ensureNavBackdrop() {
    if (navBackdrop) return navBackdrop;
    var el = document.getElementById("site-nav-backdrop");
    if (el) {
      navBackdrop = el;
    } else {
      navBackdrop = document.createElement("div");
      navBackdrop.id = "site-nav-backdrop";
      navBackdrop.className = "site-nav-backdrop";
      navBackdrop.setAttribute("aria-hidden", "true");
      navBackdrop.addEventListener("click", function () {
        closeMainNav();
      });
    }
    return navBackdrop;
  }

  /* État fermé au chargement : évite l’icône « X » (menu « ouvert ») sans panneau visible
     après cache bfcache, restauration d’onglet ou HTML partiellement obsolète. */
  if (nav && toggle) {
    nav.classList.remove("is-open");
    document.documentElement.classList.remove("site-nav-is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
    applyBodyScrollLock(false);
  }

  function placeMainNavForViewport() {
    if (!nav || !toggle) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (mobile) {
      var bd = ensureNavBackdrop();
      if (nav.parentNode !== document.body) {
        document.body.appendChild(bd);
        document.body.appendChild(nav);
      } else if (bd.parentNode !== document.body) {
        document.body.appendChild(bd);
        document.body.insertBefore(bd, nav);
      } else if (nav.previousElementSibling !== bd) {
        document.body.insertBefore(bd, nav);
      }
    } else if (headerInner && nav.parentNode !== headerInner) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      document.documentElement.classList.remove("site-nav-is-open");
      applyBodyScrollLock(false);
      syncNavBackdrop(false);
      headerInner.insertBefore(nav, toggle.nextSibling);
    }
    if (mobile) {
      const menuOpen = nav.classList.contains("is-open");
      nav.setAttribute("aria-hidden", menuOpen ? "false" : "true");
      toggle.setAttribute("aria-expanded", menuOpen ? "true" : "false");
      toggle.setAttribute("aria-label", menuOpen ? "Fermer le menu" : "Ouvrir le menu");
      document.documentElement.classList.toggle("site-nav-is-open", menuOpen);
      syncNavBackdrop(menuOpen);
    } else {
      nav.removeAttribute("aria-hidden");
      syncNavBackdrop(false);
    }
  }

  placeMainNavForViewport();
  window.addEventListener("resize", placeMainNavForViewport);

  if (nav && toggle) {
    const links = nav.querySelectorAll("a");
    const headerCta = document.querySelector(".site-header__cta");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      if (window.matchMedia("(max-width: 767px)").matches) {
        nav.setAttribute("aria-hidden", open ? "false" : "true");
      } else {
        nav.removeAttribute("aria-hidden");
      }
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      document.documentElement.classList.toggle("site-nav-is-open", open);
      syncNavBackdrop(open);
      applyBodyScrollLock(open);
      // Accessibility: keep focus inside nav when opened on mobile.
      if (open && window.matchMedia("(max-width: 767px)").matches) {
        try {
          var firstLink = nav.querySelector("a");
          if (firstLink) firstLink.focus({ preventScroll: true });
        } catch (e) {}
      }
    }

    closeMainNav = function () {
      if (nav.classList.contains("is-open")) {
        setOpen(false);
      }
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    links.forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    if (headerCta) {
      headerCta.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) setOpen(false);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setOpen(false);
      }
    });

    window.addEventListener("pageshow", function (ev) {
      if (!ev.persisted) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      document.documentElement.classList.remove("site-nav-is-open");
      syncNavBackdrop(false);
      applyBodyScrollLock(false);
    });
  }

  function initMainReveal() {
    const main = document.querySelector(".site-main");
    if (!main) return;
    window.requestAnimationFrame(function () {
      main.classList.add("site-main--ready");
    });
  }

  initMainReveal();

  function runWhenMainSurfaceReady(fn) {
    var main = document.querySelector(".site-main");
    var tries = 0;
    function tick() {
      if (!main || main.classList.contains("site-main--ready") || tries++ > 24) {
        fn();
        return;
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  function initFadeInSections() {
    const nodes = document.querySelectorAll(".fade-in-section");
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (window.matchMedia("(max-width: 767px)").matches) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.02 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  initFadeInSections();

  function defaultHeaderReservePx() {
    var rootStyle = getComputedStyle(document.documentElement);
    var narrow = window.matchMedia("(max-width: 767px)").matches;
    var headerVar = narrow ? "--header-h-mobile" : "--header-h-desktop";
    var headerPx = parseFloat(rootStyle.getPropertyValue(headerVar)) || (narrow ? 72 : 80);
    return headerPx + 12;
  }

  function headerReserveForElement(el) {
    if (!el) return defaultHeaderReservePx();
    var sm = parseFloat(getComputedStyle(el).scrollMarginTop);
    if (!isNaN(sm) && sm > 0) return sm;
    return defaultHeaderReservePx();
  }

  function documentOffsetTop(el) {
    var top = 0;
    var n = el;
    while (n) {
      top += n.offsetTop;
      n = n.offsetParent;
    }
    return top;
  }

  function scrollEdgeTopUnderHeader(edge, marginRef) {
    if (!edge || typeof edge.getBoundingClientRect !== "function") return;
    var reserve = headerReserveForElement(marginRef || edge);
    void document.documentElement.offsetHeight;
    void edge.offsetHeight;
    var rectTop = window.pageYOffset + edge.getBoundingClientRect().top;
    var offTop = documentOffsetTop(edge);
    var y = rectTop - reserve;
    if (Math.abs(rectTop - offTop) > 24) {
      y = offTop - reserve;
    }
    window.scrollTo({ top: Math.max(0, y), left: 0, behavior: "auto" });
  }

  function scrollHashTargetToTop(target) {
    if (!target) return;
    try {
      target.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
    } catch (e1) {}
    scrollEdgeTopUnderHeader(target, target);
  }

  var OFFRE_SCROLL_FIX_IDS = ["parcours-delais", "process-title", "delais-title"];

  function offreScrollFixIdFromHref(href) {
    var h = href.replace(/\\/g, "/").trim();
    var m = h.match(/#([\w-]+)\s*$/);
    if (!m) return null;
    var id = m[1].toLowerCase();
    return OFFRE_SCROLL_FIX_IDS.indexOf(id) !== -1 ? id : null;
  }

  function initHashTargetReveal() {
    var hashScrollIv = null;

    function performRevealForTarget(target) {
      if (!target) return;

      if (hashScrollIv) {
        window.clearInterval(hashScrollIv);
        hashScrollIv = null;
      }

      try {
        if ("scrollRestoration" in history) {
          history.scrollRestoration = "manual";
        }
      } catch (e2) {}

      var touched = [];
      document.querySelectorAll(".fade-in-section").forEach(function (node) {
        if (node.contains(target)) {
          node.style.setProperty("transition", "none");
          node.classList.add("is-visible");
          touched.push(node);
          return;
        }
        var pos = node.compareDocumentPosition(target);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
          node.style.setProperty("transition", "none");
          node.classList.add("is-visible");
          touched.push(node);
        }
      });

      function applyScroll() {
        scrollHashTargetToTop(target);
      }

      function releaseTransitions() {
        touched.forEach(function (n) {
          n.style.removeProperty("transition");
        });
      }

      applyScroll();
      requestAnimationFrame(function () {
        applyScroll();
        requestAnimationFrame(function () {
          applyScroll();
          window.setTimeout(applyScroll, 0);
          window.setTimeout(applyScroll, 60);
          window.setTimeout(applyScroll, 180);
          window.setTimeout(applyScroll, 420);
          window.setTimeout(releaseTransitions, 480);
        });
      });

      var nudge = 0;
      hashScrollIv = window.setInterval(function () {
        applyScroll();
        nudge += 1;
        if (nudge >= 12) {
          window.clearInterval(hashScrollIv);
          hashScrollIv = null;
        }
      }, 90);
    }

    function reveal() {
      var raw = (location.hash || "").replace(/^#/, "");
      if (!raw) return;
      try {
        raw = decodeURIComponent(raw);
      } catch (e) {
        return;
      }
      var target = document.getElementById(raw);
      if (!target) return;
      runWhenMainSurfaceReady(function () {
        performRevealForTarget(target);
      });
    }

    document.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest("a");
        if (!a) return;
        var href = (a.getAttribute("href") || "").trim();
        if (!href) return;

        var scrollFixId = offreScrollFixIdFromHref(href);
        if (!scrollFixId) return;

        var el = document.getElementById(scrollFixId);
        if (!el) return;

        var path = (window.location.pathname || "").replace(/\\/g, "/");
        var file = (path.split("/").pop() || "").toLowerCase();
        var hNorm = href.replace(/\\/g, "/").trim();
        var sameOffrePage =
          new RegExp("^#" + scrollFixId + "$", "i").test(hNorm) ||
          (file === "offre.html" && /offre\.html#/i.test(hNorm) && new RegExp("#" + scrollFixId + "\\s*$", "i").test(hNorm));

        if (!sameOffrePage) return;

        e.preventDefault();
        closeMainNav();

        var hashNeed = "#" + scrollFixId;

        function afterMenuLayout() {
          if (location.hash !== hashNeed) {
            location.hash = scrollFixId;
          } else {
            runWhenMainSurfaceReady(function () {
              performRevealForTarget(el);
            });
          }
        }

        window.setTimeout(function () {
          requestAnimationFrame(function () {
            requestAnimationFrame(afterMenuLayout);
          });
        }, 0);
      },
      true
    );

    reveal();
    window.addEventListener("hashchange", reveal);
    window.addEventListener("load", function () {
      if (location.hash && location.hash.length > 1) {
        reveal();
      }
    });
  }

  initHashTargetReveal();

  function initFaqAccordion() {
    document.querySelectorAll(".faq-editorial__item").forEach(function (details) {
      const panel = details.querySelector(".faq-editorial__panel");
      if (!panel) return;

      function syncPanelHeight() {
        if (details.open) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
          panel.style.maxHeight = "0";
        }
      }

      details.addEventListener("toggle", syncPanelHeight);
      syncPanelHeight();
    });
  }

  initFaqAccordion();

  function submitToNetlify(form, feedback, successMsg) {
    var params = new URLSearchParams();
    params.append("form-name", form.getAttribute("name") || "");
    new FormData(form).forEach(function(val, key) { params.append(key, val); });
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    })
    .then(function(res) {
      // Netlify Forms only works when the site is served by Netlify.
      // GitHub Pages may still return 200 for "/" but will NOT capture submissions.
      var nfId = res.headers.get("x-nf-request-id");
      var server = res.headers.get("server") || "";
      var looksLikeNetlify = !!nfId || /netlify/i.test(server);
      if (!res.ok || !looksLikeNetlify) {
        var err = new Error("not_netlify");
        err.code = "not_netlify";
        throw err;
      }
      if (feedback) {
        feedback.innerHTML = successMsg;
        feedback.classList.add("form-feedback--success");
        feedback.hidden = false;
        try { feedback.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch(e) {}
      }
      form.reset();
    })
    .catch(function() {
      if (feedback) {
        feedback.innerHTML = "Erreur r\u00e9seau. \u00c9crivez-nous directement\u00a0: <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a>";
        feedback.hidden = false;
      }
    });
  }

  function openMailtoFromForm(form, subject) {
    try {
      var fd = new FormData(form);
      var lines = [];
      fd.forEach(function (val, key) {
        if (key === "form-name") return;
        var v = String(val == null ? "" : val).trim();
        if (!v) return;
        lines.push(key + " : " + v);
      });
      var body = lines.join("\n");
      var href =
        "mailto:" +
        encodeURIComponent(CONTACT_EMAIL) +
        "?subject=" +
        encodeURIComponent(subject || "Demande Mémoire & Présence") +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = href;
      return true;
    } catch (e) {
      return false;
    }
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const feedback = document.getElementById("contact-form-feedback");
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (feedback) { feedback.textContent = ""; feedback.innerHTML = ""; feedback.hidden = true; feedback.classList.remove("form-feedback--success"); }
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();
      if (!name || !email || !message) {
        if (feedback) { feedback.textContent = "Merci de renseigner au minimum votre nom, votre e-mail et votre message."; feedback.hidden = false; }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (feedback) { feedback.textContent = "L'adresse e-mail ne semble pas valide. V\u00e9rifiez qu'il ne manque rien apr\u00e8s le @."; feedback.hidden = false; }
        return;
      }
      if (message.length < 20) {
        if (feedback) { feedback.textContent = "Quelques lignes de plus nous aideront \u00e0 mieux vous r\u00e9pondre (minimum 20 caract\u00e8res)."; feedback.hidden = false; }
        return;
      }
      submitToNetlify(contactForm, feedback, "Message envoy\u00e9 \u2014 nous vous r\u00e9pondons sous 24\u00a0\u00e0\u00a048\u00a0h.");
    });
  }

  const accompagnementForm = document.getElementById("accompagnement-form");
  if (accompagnementForm) {
    const accFeedback = document.getElementById("accompagnement-form-feedback");
    const pageDetails = document.getElementById("page-souvenir-details");
    const pageRadios = accompagnementForm.querySelectorAll(
      'input[name="page_souvenir"]'
    );
    const svcPage = document.getElementById("acc-svc-page");
    const svcPlaque = document.getElementById("acc-svc-plaque");
    const svcVideo = document.getElementById("acc-svc-video");
    const plaqueSection = document.getElementById("acc-plaque-section");
    const videoSection = document.getElementById("acc-video-section");

    function setSectionEnabled(section, enabled) {
      if (!section) return;
      section.hidden = !enabled;
      section
        .querySelectorAll("input, select, textarea, button")
        .forEach(function (el) {
          // Keep submit/print enabled
          if (el.type === "submit") return;
          el.disabled = !enabled;
        });
    }

    function setPageDetailsOpen(open) {
      if (!pageDetails) return;
      pageDetails.hidden = !open;
      pageDetails.querySelectorAll("input").forEach((input) => {
        input.disabled = !open;
      });
    }

    function syncPageSouvenir() {
      const yes =
        accompagnementForm.querySelector('input[name="page_souvenir"]:checked')
          ?.value === "oui";
      setPageDetailsOpen(yes);
    }

    pageRadios.forEach((r) => r.addEventListener("change", syncPageSouvenir));
    syncPageSouvenir();

    function syncServices() {
      // If "page" service is checked, default the page_souvenir to "oui" (without forcing).
      if (svcPage && svcPage.checked) {
        const oui = document.getElementById("acc-page-oui");
        if (oui && !oui.checked) oui.checked = true;
      }
      const wantsPlaque = !!(svcPlaque && svcPlaque.checked);
      const wantsVideo = !!(svcVideo && svcVideo.checked);
      setSectionEnabled(plaqueSection, wantsPlaque);
      setSectionEnabled(videoSection, wantsVideo);
    }

    [svcPage, svcPlaque, svcVideo].forEach(function (el) {
      if (!el) return;
      el.addEventListener("change", syncServices);
    });
    syncServices();

    const printBtn = document.getElementById("accompagnement-print");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }

    accompagnementForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (accFeedback) { accFeedback.textContent = ""; accFeedback.hidden = true; accFeedback.classList.remove("form-feedback--success"); }
      const fd = new FormData(accompagnementForm);
      const yourName = String(fd.get("your_name") || "").trim();
      const yourEmail = String(fd.get("your_email") || "").trim();
      const pageSouvenir = String(fd.get("page_souvenir") || "non").trim();
      const honorName = String(fd.get("honor_name") || "").trim();
      const services = fd.getAll("services[]").map((v) => String(v || "").trim()).filter(Boolean);
      if (!yourName || !yourEmail) {
        if (accFeedback) { accFeedback.textContent = "Merci d'indiquer votre nom et votre e-mail pour que nous puissions vous r\u00e9pondre."; accFeedback.hidden = false; }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(yourEmail)) {
        if (accFeedback) { accFeedback.textContent = "L'adresse e-mail ne semble pas valide. V\u00e9rifiez-la avant d'envoyer."; accFeedback.hidden = false; }
        return;
      }
      if (!services.length) {
        if (accFeedback) { accFeedback.textContent = "Merci de cocher au moins un élément (page, plaque, vidéo…)."; accFeedback.hidden = false; }
        return;
      }
      if (!honorName) {
        if (accFeedback) { accFeedback.textContent = "Pour cadrer l'hommage, merci d'indiquer au minimum le prénom et le nom de l’être honoré."; accFeedback.hidden = false; }
        return;
      }
      if (pageSouvenir === "oui") {
        const access = String(fd.get("access_type") || "").trim();
        if (!access) {
          if (accFeedback) { accFeedback.textContent = "Vous avez choisi une page en ligne\u00a0: merci de pr\u00e9ciser le type d'acc\u00e8s souhait\u00e9."; accFeedback.hidden = false; }
          return;
        }
      }
      // If user asked for plaque or video, ensure they provided at least ONE concrete detail,
      // otherwise Claude will have nothing actionable.
      if (services.includes("plaque")) {
        const mat = String(fd.get("plaque_matiere") || "").trim();
        const fmt = String(fd.get("plaque_format") || "").trim();
        const txt = String(fd.get("plaque_texte") || "").trim();
        const city = String(fd.get("livraison_ville") || "").trim();
        if (!mat && !fmt && !txt && !city) {
          if (accFeedback) { accFeedback.textContent = "Vous avez coché « Plaque + QR » : merci d’indiquer au moins un détail (matière, format, texte ou ville de livraison)."; accFeedback.hidden = false; }
          return;
        }
      }
      if (services.includes("video")) {
        const wish = String(fd.get("video_duree_souhaitee") || "").trim();
        const avail = String(fd.get("videos_duree") || "").trim();
        if (!wish && !avail) {
          if (accFeedback) { accFeedback.textContent = "Vous avez coché « Vidéo hommage » : merci d’indiquer soit la durée souhaitée, soit ce que vous avez déjà (durée/nb de vidéos)."; accFeedback.hidden = false; }
          return;
        }
      }
      submitToNetlify(accompagnementForm, accFeedback, "Formulaire envoy\u00e9 \u2014 nous vous recontactons rapidement.")
        .catch(function () {
          // Fallback (ex: GitHub Pages / local): open an email draft with the recap.
          var ok = openMailtoFromForm(accompagnementForm, "Accompagnement — Mémoire & Présence");
          if (accFeedback) {
            accFeedback.innerHTML = ok
              ? "Votre messagerie s'ouvre avec le r\u00e9capitulatif. Envoyez l'e-mail pour finaliser."
              : "Impossible d'ouvrir la messagerie. \u00c9crivez-nous \u00e0 <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a>.";
            accFeedback.classList.add("form-feedback--success");
            accFeedback.hidden = false;
          }
        });
    });
  }

  const devisForm = document.getElementById("devis-form");
  if (devisForm) {
    const devisFeedback = document.getElementById("devis-form-feedback");
    devisForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (devisFeedback) { devisFeedback.textContent = ""; devisFeedback.hidden = true; devisFeedback.classList.remove("form-feedback--success"); }
      const fd = new FormData(devisForm);
      const nom = String(fd.get("Nom demandeur") || "").trim();
      const prenom = String(fd.get("Pr\u00e9nom demandeur") || "").trim();
      const email = String(fd.get("E-mail") || "").trim();
      if (!nom || !prenom || !email) {
        if (devisFeedback) { devisFeedback.textContent = "Merci d'indiquer votre nom, votre pr\u00e9nom et votre e-mail."; devisFeedback.hidden = false; }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (devisFeedback) { devisFeedback.textContent = "L'adresse e-mail ne semble pas valide. V\u00e9rifiez-la avant d'envoyer."; devisFeedback.hidden = false; }
        return;
      }
      submitToNetlify(devisForm, devisFeedback, "Demande de devis re\u00e7ue \u2014 nous vous r\u00e9pondons sous 48\u00a0h.")
        .catch(function () {
          var ok = openMailtoFromForm(devisForm, "Demande de devis — Mémoire & Présence");
          if (devisFeedback) {
            devisFeedback.innerHTML = ok
              ? "Votre messagerie s'ouvre avec le r\u00e9capitulatif. Envoyez l'e-mail pour finaliser."
              : "Impossible d'ouvrir la messagerie. \u00c9crivez-nous \u00e0 <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a>.";
            devisFeedback.classList.add("form-feedback--success");
            devisFeedback.hidden = false;
          }
        });
    });
  }

})();
