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

  const CONTACT_EMAIL = "memoire.presence.contact@gmail.com";

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

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

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const feedback = document.getElementById("contact-form-feedback");
    const CONTACT_SUBJECT_PLAIN = "Prise de contact — Mémoire & Présence";

    function resetContactFeedback() {
      if (!feedback) return;
      feedback.textContent = "";
      feedback.innerHTML = "";
      feedback.hidden = true;
      feedback.classList.remove("form-feedback--success");
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      resetContactFeedback();

      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const message = String(fd.get("message") || "").trim();

      if (!name || !email || !message) {
        if (feedback) {
          feedback.textContent =
            "Merci de renseigner au minimum votre nom, votre e-mail et votre message.";
          feedback.hidden = false;
        }
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        if (feedback) {
          feedback.textContent =
            "L’adresse e-mail ne semble pas valide. Vérifiez qu’il ne manque rien après le @.";
          feedback.hidden = false;
        }
        return;
      }

      if (message.length < 20) {
        if (feedback) {
          feedback.textContent =
            "Quelques lignes de plus nous aideront à comprendre votre situation (minimum 20 caractères).";
          feedback.hidden = false;
        }
        return;
      }

      const bodyPlain = [
        "Nom : " + name,
        "E-mail : " + email,
        phone ? "Téléphone : " + phone : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");

      const mailto =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        encodeURIComponent(CONTACT_SUBJECT_PLAIN) +
        "&body=" +
        encodeURIComponent(bodyPlain);

      if (!feedback) {
        window.location.href = mailto;
        return;
      }

      const gmailParams = new URLSearchParams({
        view: "cm",
        fs: "1",
        to: CONTACT_EMAIL,
        su: CONTACT_SUBJECT_PLAIN,
        body: bodyPlain,
      });
      const gmailUrl = "https://mail.google.com/mail/?" + gmailParams.toString();
      const gmailFitsUrl = gmailUrl.length <= 1900;

      feedback.classList.add("form-feedback--success");
      feedback.hidden = false;

      const p1 = document.createElement("p");
      p1.textContent =
        "Votre message est prêt. Cliquez sur une des options ci-dessous — beaucoup de navigateurs ne ouvrent plus la messagerie tout seuls.";

      const actions = document.createElement("div");
      actions.className = "contact-send-actions";

      if (gmailFitsUrl) {
        const aGmail = document.createElement("a");
        aGmail.href = gmailUrl;
        aGmail.target = "_blank";
        aGmail.rel = "noopener noreferrer";
        aGmail.className = "btn btn--primary";
        aGmail.textContent = "Ouvrir Gmail dans le navigateur";
        actions.appendChild(aGmail);
      }

      const aMail = document.createElement("a");
      aMail.href = mailto;
      aMail.className = "btn btn--ghost";
      aMail.textContent = "Ouvrir ma messagerie (Outlook, Mail…)";
      actions.appendChild(aMail);

      const btnCopy = document.createElement("button");
      btnCopy.type = "button";
      btnCopy.className = "btn btn--ghost contact-send-actions__copy";
      btnCopy.textContent = "Copier le texte du message";
      btnCopy.addEventListener("click", function () {
        const label = "Copier le texte du message";
        const done = function (ok) {
          btnCopy.textContent = ok ? "Copié !" : "Sélectionnez le message à la main";
          setTimeout(function () {
            btnCopy.textContent = label;
          }, 2800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(bodyPlain).then(
            function () {
              done(true);
            },
            function () {
              done(false);
            }
          );
        } else {
          done(false);
        }
      });
      actions.appendChild(btnCopy);

      feedback.appendChild(p1);
      if (!gmailFitsUrl) {
        const pLong = document.createElement("p");
        pLong.className = "form-note";
        pLong.style.margin = "0 0 0.5rem";
        pLong.textContent =
          "Votre message est assez long : utilisez « Copier le texte » ou votre messagerie.";
        feedback.appendChild(pLong);
      }
      feedback.appendChild(actions);

      const p2 = document.createElement("p");
      p2.className = "form-note";
      p2.style.marginTop = "0.85rem";
      p2.appendChild(document.createTextNode("Destinataire : "));
      const aDirect = document.createElement("a");
      aDirect.href = "mailto:" + CONTACT_EMAIL;
      aDirect.textContent = CONTACT_EMAIL;
      p2.appendChild(aDirect);
      feedback.appendChild(p2);

      try {
        feedback.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {}
    });
  }

  const accompagnementForm = document.getElementById("accompagnement-form");
  if (accompagnementForm) {
    const accFeedback = document.getElementById("accompagnement-form-feedback");
    const pageDetails = document.getElementById("page-souvenir-details");
    const pageRadios = accompagnementForm.querySelectorAll(
      'input[name="page_souvenir"]'
    );

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

    const printBtn = document.getElementById("accompagnement-print");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }

    accompagnementForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (accFeedback) {
        accFeedback.textContent = "";
        accFeedback.hidden = true;
      }

      const fd = new FormData(accompagnementForm);
      const yourName = String(fd.get("your_name") || "").trim();
      const yourEmail = String(fd.get("your_email") || "").trim();
      const pageSouvenir = String(
        fd.get("page_souvenir") || "non"
      ).trim();

      if (!yourName || !yourEmail) {
        if (accFeedback) {
          accFeedback.textContent =
            "Merci d’indiquer votre nom et votre e-mail pour que nous puissions vous répondre.";
          accFeedback.hidden = false;
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(yourEmail)) {
        if (accFeedback) {
          accFeedback.textContent =
            "L’adresse e-mail ne semble pas valide. Vérifiez-la avant d’envoyer.";
          accFeedback.hidden = false;
        }
        return;
      }

      if (pageSouvenir === "oui") {
        const access = String(fd.get("access_type") || "").trim();
        if (!access) {
          if (accFeedback) {
            accFeedback.textContent =
              "Vous avez choisi une page en ligne : merci de préciser le type d’accès souhaité.";
            accFeedback.hidden = false;
          }
          return;
        }
      }

      const honorName = String(fd.get("honor_name") || "").trim();
      const honorBirth = String(fd.get("honor_birth") || "").trim();
      const relation = String(fd.get("relation") || "").trim();
      const notes = String(fd.get("notes") || "").trim();
      const moderation = String(fd.get("moderation") || "").trim();
      const accessType = String(fd.get("access_type") || "").trim();

      const accessLabels = {
        lien: "Accès par lien",
        motdepasse: "Protégé par mot de passe",
        qr: "Principalement via QR sur la plaque",
      };
      const modLabels = {
        moderer: "Messages modérés avant publication",
        libre: "Publication libre des messages (détails à valider avec vous)",
        aucun: "Pas de livre d’or / pas de messages visiteurs",
      };

      const lines = [
        "— Formulaire d’accompagnement — Mémoire & Présence",
        "",
        "Vos coordonnées :",
        "Nom : " + yourName,
        "E-mail : " + yourEmail,
        "",
        "L’être honoré :",
        honorName ? "Prénom et nom : " + honorName : "Prénom et nom : (non renseigné)",
        honorBirth ? "Date de naissance : " + honorBirth : "Date de naissance : (non renseigné)",
        relation ? "Lien avec vous : " + relation : "Lien avec vous : (non renseigné)",
        "",
        "Page souvenir en ligne : " + (pageSouvenir === "oui" ? "Oui" : "Non pour l’instant"),
      ];

      if (pageSouvenir === "oui") {
        lines.push(
          "Type d’accès : " + (accessLabels[accessType] || accessType),
          "Livre d’or / messages : " + (modLabels[moderation] || moderation)
        );
      }

      if (notes) {
        lines.push("", "Précisions :", notes);
      }

      const body = lines.join("\n");
      const subject = encodeURIComponent(
        "Formulaire d’accompagnement — Mémoire & Présence"
      );
      const mailto =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        subject +
        "&body=" +
        encodeURIComponent(body);

      if (mailto.length > 1950) {
        if (accFeedback) {
          accFeedback.textContent =
            "Le message est trop long pour un envoi automatique. Utilisez « Imprimer ou PDF », ou écrivez-nous à l’adresse indiquée sur le site.";
          accFeedback.hidden = false;
        }
        return;
      }

      window.location.href = mailto;
    });
  }

  const devisForm = document.getElementById("devis-form");
  if (devisForm) {
    const devisFeedback = document.getElementById("devis-form-feedback");

    devisForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (devisFeedback) {
        devisFeedback.textContent = "";
        devisFeedback.hidden = true;
      }

      const fd = new FormData(devisForm);
      const nom = String(fd.get("Nom demandeur") || "").trim();
      const prenom = String(fd.get("Prénom demandeur") || "").trim();
      const email = String(fd.get("E-mail") || "").trim();
      if (!nom || !prenom || !email) {
        if (devisFeedback) {
          devisFeedback.textContent =
            "Merci d’indiquer votre nom, votre prénom et votre e-mail.";
          devisFeedback.hidden = false;
        }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (devisFeedback) {
          devisFeedback.textContent =
            "L’adresse e-mail ne semble pas valide. Vérifiez-la avant d’envoyer.";
          devisFeedback.hidden = false;
        }
        return;
      }

      const lines = ["— Demande de devis — Mémoire & Présence", ""];
      fd.forEach((value, key) => {
        const v = String(value || "").trim();
        if (v) lines.push(key + " : " + v);
      });

      const body = lines.join("\n");
      const subject = encodeURIComponent("Demande de devis — Mémoire & Présence");
      const mailto =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        subject +
        "&body=" +
        encodeURIComponent(body);

      if (mailto.length > 2100) {
        if (devisFeedback) {
          devisFeedback.textContent =
            "Le message est trop long pour un envoi automatique. Appelez le 07 86 17 37 15 ou envoyez deux e-mails en découpant les sections.";
          devisFeedback.hidden = false;
        }
        return;
      }

      window.location.href = mailto;
    });
  }

  // #region agent log — background lines debug
  if (document.body.classList.contains('page-home')) {
    window.addEventListener('load', function() {
      var data = {};
      // H-A: check body::after noise SVG tiling visible
      var bodyAfterStyle = window.getComputedStyle(document.body, '::after');
      data.bodyAfterBg = bodyAfterStyle.backgroundImage ? bodyAfterStyle.backgroundImage.substring(0, 80) : 'none';
      data.bodyAfterBgSize = bodyAfterStyle.backgroundSize;
      data.bodyAfterBgRepeat = bodyAfterStyle.backgroundRepeat;
      // H-B: check if .home-atelier element still exists in DOM
      var atelierEl = document.querySelector('.home-atelier');
      data.atelierExists = !!atelierEl;
      data.atelierLineCount = document.querySelectorAll('.home-atelier__line').length;
      // H-C: check body::before bg-sable
      var bodyBeforeStyle = window.getComputedStyle(document.body, '::before');
      data.bodyBeforeBg = bodyBeforeStyle.backgroundImage ? bodyBeforeStyle.backgroundImage.substring(0, 60) : 'none';
      // H-D: find any elements between hero and home-fold
      var main = document.querySelector('.home-main');
      data.mainChildCount = main ? main.children.length : -1;
      data.mainChildTags = main ? Array.from(main.children).map(function(c){return c.tagName+'.'+c.className.split(' ')[0];}).join(',') : '';
      // H-E: check hero footnote border visibility
      var footnote = document.querySelector('.hero__footnote');
      var fnStyle = footnote ? window.getComputedStyle(footnote) : null;
      data.footnoteBorderTop = fnStyle ? fnStyle.borderTop : 'none';
      fetch('http://127.0.0.1:7663/ingest/c8e2fa91-cc20-488f-8140-94baae723e29',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'238fac'},body:JSON.stringify({sessionId:'238fac',location:'script.js:856',message:'background lines audit',data:data,runId:'run1',hypothesisId:'A-B-C-D-E',timestamp:Date.now()})}).catch(function(){});
    });
  }
  // #endregion

})();
