/**
 * Carrousel hommage (Swiper 11, bundle CDN).
 * Attend que #hommage-content soit visible (pas [hidden]) puis initialise après reflow
 * (évite largeur/hauteur 0 si init au même instant que le déverrouillage).
 */
(function () {
  var swiperInst = null;
  var scheduled = false;

  function hommageContentVisible() {
    var el = document.getElementById("hommage-content");
    return el && !el.hasAttribute("hidden");
  }

  function buildSwiper(root) {
    if (swiperInst || typeof Swiper === "undefined" || !root) return;
    if (!hommageContentVisible()) return;

    var pag = root.querySelector(".swiper-pagination");
    var next = root.querySelector(".swiper-button-next");
    var prev = root.querySelector(".swiper-button-prev");
    if (!pag || !next || !prev) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      swiperInst = new Swiper(root, {
        loop: true,
        speed: reduceMotion ? 200 : 720,
        effect: reduceMotion ? "slide" : "fade",
        fadeEffect: { crossFade: true },
        grabCursor: true,
        touchStartPreventDefault: false,
        resistanceRatio: 0.75,
        threshold: 6,
        slidesPerView: 1,
        spaceBetween: 0,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        preloadImages: false,
        lazy: { loadPrevNext: true, loadPrevNextAmount: 1 },
        pagination: {
          el: pag,
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        },
        navigation: {
          nextEl: next,
          prevEl: prev,
        },
        keyboard: { enabled: true },
        autoplay: reduceMotion
          ? false
          : { delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true },
        a11y: {
          enabled: true,
          prevSlideMessage: "Image précédente",
          nextSlideMessage: "Image suivante",
          paginationBulletMessage: "Aller à l’image {{index}}",
        },
      });
    } catch (e) {
      swiperInst = null;
      return;
    }

    function refresh() {
      if (!swiperInst) return;
      swiperInst.update();
      swiperInst.updateSize();
      swiperInst.updateSlides();
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(refresh);
    });

    if (document.readyState === "complete") {
      requestAnimationFrame(refresh);
    } else {
      window.addEventListener("load", function onLoad() {
        window.removeEventListener("load", onLoad);
        refresh();
      });
    }
  }

  function scheduleInit() {
    if (swiperInst || scheduled) return;
    if (!hommageContentVisible()) return;
    var root = document.querySelector(".hommage-swiper");
    if (!root) return;

    scheduled = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scheduled = false;
        buildSwiper(root);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", scheduleInit);
  document.addEventListener("hommage:unlocked", scheduleInit);
})();
