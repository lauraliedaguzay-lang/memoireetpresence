(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;

  function setYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initNav() {
    const btn = $("#navToggle");
    const panel = $("#navPanel");
    if (!btn || !panel) return;

    const openCls = "nav--open";

    function setOpen(open) {
      panel.classList.toggle(openCls, open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.classList.toggle("no-scroll", open);
    }

    btn.addEventListener("click", () => {
      setOpen(!panel.classList.contains(openCls));
    });
    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^=\"#\"]");
      if (!a) return;
      setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initReveal() {
    const nodes = $$("[data-reveal]");
    if (!nodes.length) return;
    if (prefersReducedMotion) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
  }

  function initMarquee() {
    const el = $("#marquee");
    if (!el) return;
    if (prefersReducedMotion) {
      el.dataset.static = "true";
      return;
    }
    // Pure CSS anim; JS just duplicates for seamless loop.
    const row = el.querySelector(".marquee__row");
    if (!row) return;
    const clone = row.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    el.appendChild(clone);
  }

  setYear();
  initNav();
  initReveal();
  initMarquee();
})();

