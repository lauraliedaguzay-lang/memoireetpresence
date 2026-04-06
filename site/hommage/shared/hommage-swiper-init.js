/**
 * Carrousel hommage (Swiper 11) — pages démo famille-martin / exemple-defunt.
 * Charge après swiper-bundle.min.js (defer, ordre document respecté).
 * Si #hommage-content a [hidden] (porte à code), n’initialise qu’une fois le contenu visible ou après l’événement hommage:unlocked.
 */
(function () {
  var swiperInst = null;

  function hommageContentVisible() {
    var el = document.getElementById("hommage-content");
    return el && !el.hasAttribute("hidden");
  }

  function initHommageSwiper() {
    if (swiperInst || typeof Swiper === "undefined") return;
    var root = document.querySelector(".hommage-swiper");
    if (!root || !hommageContentVisible()) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    swiperInst = new Swiper(".hommage-swiper", {
      loop: true,
      speed: reduceMotion ? 200 : 720,
      effect: reduceMotion ? "slide" : "fade",
      fadeEffect: { crossFade: true },
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 0,
      pagination: {
        el: ".hommage-swiper .swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      navigation: {
        nextEl: ".hommage-swiper .swiper-button-next",
        prevEl: ".hommage-swiper .swiper-button-prev",
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
    requestAnimationFrame(function () {
      if (swiperInst) swiperInst.update();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (hommageContentVisible()) initHommageSwiper();
  });
  document.addEventListener("hommage:unlocked", initHommageSwiper);
})();
