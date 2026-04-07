(() => {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }
  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  // Header: subtle elevate on scroll
  const header = qs("[data-header]");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Stepper: progress bar uses IntersectionObserver
  const steps = qsa("[data-step]");
  const bar = qs("[data-stepbar]");
  if (steps.length && bar) {
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          seen.add(e.target);
          const pct = Math.round((seen.size / steps.length) * 100);
          bar.style.setProperty("--pct", String(pct));
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0.01 }
    );
    steps.forEach((s) => io.observe(s));
  }

  // Accordion
  qsa("[data-accordion]").forEach((root) => {
    qsa("button[data-acc-btn]", root).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("aria-controls");
        const panel = id ? document.getElementById(id) : null;
        if (!panel) return;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
      });
    });
  });

  // Smooth anchor (only if user allows)
  if (!prefersReduced) {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^=\"#\"]");
      if (!a) return;
      const id = (a.getAttribute("href") || "").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#" + id);
    });
  }
})();

