(() => {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // --- NAV: mobile drawer ---------------------------------------------------
  const nav = qs("#nav");
  const navToggle = qs("#nav-toggle");
  const backdrop = qs("#nav-backdrop");

  const setNavOpen = (open) => {
    if (!nav || !navToggle || !backdrop) return;
    nav.dataset.open = open ? "true" : "false";
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    backdrop.dataset.open = open ? "true" : "false";
    document.documentElement.classList.toggle("nav-open", open);
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => setNavOpen(nav?.dataset?.open !== "true"));
  }
  if (backdrop) {
    backdrop.addEventListener("click", () => setNavOpen(false));
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });
  qsa('a[href^="#"]', nav).forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });

  // --- HERO: subtle parallax glow (pointer) --------------------------------
  const hero = qs(".hero");
  if (hero && !reduceMotion) {
    const glow = qs(".hero__glow", hero);
    let raf = 0;
    const onMove = (ev) => {
      if (!glow) return;
      const r = hero.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * 100;
      const y = ((ev.clientY - r.top) / r.height) * 100;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.setProperty("--gx", `${x}%`);
        glow.style.setProperty("--gy", `${y}%`);
      });
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
  }

  // --- REVEAL: intersection observer ---------------------------------------
  const revealEls = qsa("[data-reveal]");
  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add("is-revealed"));
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-revealed"));
    }
  }

  // --- FAQ -----------------------------------------------------------------
  qsa("[data-faq]").forEach((wrap) => {
    const items = qsa("details", wrap);
    items.forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        // close siblings to keep it crisp
        items.forEach((other) => {
          if (other !== d) other.open = false;
        });
      });
    });
  });

  // --- Form UX (fake demo) -------------------------------------------------
  const form = qs("#lead-form");
  const feedback = qs("#lead-feedback");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const need = String(fd.get("need") || "").trim();
      if (!name || !email || !need) {
        if (feedback) {
          feedback.textContent = "Merci d’indiquer votre nom, votre e-mail et votre besoin.";
          feedback.dataset.kind = "error";
        }
        return;
      }
      if (feedback) {
        feedback.textContent = "Merci — nous revenons vers vous avec 2 questions maximum pour cadrer votre demande.";
        feedback.dataset.kind = "success";
      }
      form.reset();
    });
  }
})();

