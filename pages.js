/* ==========================================================================
   pages.js — Page-Specific Animations
   About, Work, Experience page animations
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function waitForGSAP() {
    return new Promise(resolve => {
      function check() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      }
      check();
    });
  }

  // ===== ABOUT PAGE =====
  function initAboutPage() {
    // Hero text reveal
    const heroTitle = document.querySelector('.about-hero__title');
    const heroSub = document.querySelector('.about-hero__subtitle');
    if (heroTitle) {
      gsap.from(heroTitle, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.5
      });
    }
    if (heroSub) {
      gsap.from(heroSub, {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.8
      });
    }

    // Lab chapter image reveal
    const imgOverlay = document.querySelector('.img-reveal__overlay');
    if (imgOverlay) {
      gsap.to(imgOverlay, {
        scaleX: 0,
        transformOrigin: 'right',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.about-lab',
          start: 'top 70%',
          once: true,
        }
      });
    }

    // Company cards stagger
    gsap.utils.toArray('.company-mini').forEach((card, i) => {
      gsap.from(card, {
        y: 40, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
        delay: i * 0.1,
      });
    });

    // Pivot equation animation
    gsap.utils.toArray('.equation-element, .equation-operator').forEach((el, i) => {
      gsap.from(el, {
        scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.about-pivot',
          start: 'top 70%',
          once: true,
        },
        delay: i * 0.15,
      });
    });

    // Metrics counter animation
    gsap.utils.toArray('.metric-highlight').forEach((el, i) => {
      gsap.from(el, {
        y: 30, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        delay: i * 0.1,
      });
    });

    // Tech quote
    const quote = document.querySelector('.about-tech__quote');
    if (quote) {
      gsap.from(quote, {
        x: -40, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 80%',
          once: true,
        }
      });
    }
  }

  // ===== WORK PAGE =====
  function initWorkPage() {
    // Hero
    const heroTitle = document.querySelector('.work-hero__title');
    const heroSub = document.querySelector('.work-hero__subtitle');
    if (heroTitle) {
      gsap.from(heroTitle, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.5
      });
    }
    if (heroSub) {
      gsap.from(heroSub, {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.8
      });
    }

    // Project cards — staggered entrance
    gsap.utils.toArray('.work-project').forEach((card, i) => {
      gsap.from(card, {
        y: 60, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          once: true,
        }
      });
    });

    // Case study cards — stagger
    gsap.utils.toArray('.case-card').forEach((card, i) => {
      gsap.from(card, {
        y: 40, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
        delay: i * 0.1,
      });
    });
  }

  // ===== EXPERIENCE PAGE =====
  function initExperiencePage() {
    // Hero
    const heroTitle = document.querySelector('.exp-hero__title');
    const heroSub = document.querySelector('.exp-hero__subtitle');
    if (heroTitle) {
      gsap.from(heroTitle, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.5
      });
    }
    if (heroSub) {
      gsap.from(heroSub, {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.8
      });
    }

    // Timeline line draw
    const lineDraw = document.querySelector('.timeline__line-draw');
    if (lineDraw) {
      gsap.to(lineDraw, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        }
      });
    }

    // Timeline items
    gsap.utils.toArray('.timeline__item').forEach((item, i) => {
      gsap.from(item, {
        y: 50, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          once: true,
        }
      });

      // Dot pulse on enter
      const pulse = item.querySelector('.timeline__dot-pulse');
      if (pulse) {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            gsap.fromTo(pulse,
              { scale: 0.5, opacity: 1 },
              { scale: 2.5, opacity: 0, duration: 0.8, ease: 'power2.out' }
            );
          }
        });
      }
    });

    // Periodic table tiles — stagger animation
    const marketingTiles = document.querySelectorAll('#marketingElements .element-tile');
    const techTiles = document.querySelectorAll('#techElements .element-tile');

    function animateTiles(tiles, triggerEl) {
      if (!tiles.length) return;
      gsap.from(tiles, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(2)',
        stagger: {
          each: 0.05,
          from: 'start',
        },
        scrollTrigger: {
          trigger: triggerEl || tiles[0].parentElement,
          start: 'top 80%',
          once: true,
        }
      });
    }

    animateTiles(marketingTiles, '#marketingElements');
    animateTiles(techTiles, '#techElements');

    // Cert badges
    gsap.utils.toArray('.cert-badge').forEach((badge, i) => {
      gsap.from(badge, {
        y: 30, opacity: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: {
          trigger: badge,
          start: 'top 85%',
          once: true,
        },
        delay: i * 0.05,
      });
    });
  }

  // ===== HOME PAGE SECTIONS =====
  function initHomeSections() {
    // Selected work cards
    gsap.utils.toArray('.home-work-card').forEach((card, i) => {
      gsap.from(card, {
        y: 60, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          once: true,
        }
      });
    });

    // Story block
    const storyText = document.querySelector('.home-story__text');
    if (storyText) {
      gsap.from(storyText, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: storyText,
          start: 'top 80%',
          once: true,
        }
      });
    }
  }

  // ===== INIT =====
  async function initPages() {
    await waitForGSAP();

    // Wait a tick for gsap to register plugins
    requestAnimationFrame(() => {
      const page = document.body.dataset.page;

      switch (page) {
        case 'home':
          initHomeSections();
          break;
        case 'about':
          initAboutPage();
          break;
        case 'work':
          initWorkPage();
          break;
        case 'experience':
          initExperiencePage();
          break;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPages);
  } else {
    initPages();
  }
})();
