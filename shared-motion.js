/* ==========================================================================
   shared-motion.js — Shared Motion for Blog/Post/Admin/Editor Pages
   Provides: Lenis smooth scroll, page transitions, scroll progress, cursor
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 1024;
  const isTouch = 'ontouchstart' in window;
  const isAdminPage = document.body.classList.contains('admin-page') ||
    window.location.pathname.includes('admin.html') ||
    window.location.pathname.includes('editor.html');

  // ===== THEME TOGGLE =====
  let currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // ===== NAVIGATION =====
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  function updateNav() {
    const scrollY = window.scrollY;
    if (nav) {
      if (scrollY > 50) nav.classList.add('nav--scrolled');
      else nav.classList.remove('nav--scrolled');

      if (scrollY > 300) {
        if (scrollY > lastScrollY + 5) nav.classList.add('nav--hidden');
        else if (scrollY < lastScrollY - 5) nav.classList.remove('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
    }
    lastScrollY = scrollY;
  }

  // Hamburger
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('nav__mobile-menu--open');
      mobileMenu.classList.toggle('nav__mobile-menu--open', !isOpen);
      hamburgerBtn.classList.toggle('nav__hamburger--active', !isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('nav__mobile-menu--open');
        hamburgerBtn.classList.remove('nav__hamburger--active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  if (prefersReducedMotion) {
    window.addEventListener('scroll', updateNav, { passive: true });
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
    return;
  }

  // ===== LENIS SMOOTH SCROLL =====
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.07, smoothWheel: true });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    lenis.on('scroll', updateNav);
  }

  // ===== PRELOADER (blog/post pages only, not admin) =====
  function initPreloader() {
    return new Promise(resolve => {
      const preloader = document.getElementById('preloader');
      const counter = document.getElementById('preloaderCounter');
      const logoPath = document.querySelector('.preloader__logo path');
      if (!preloader || isAdminPage) {
        if (preloader) preloader.style.display = 'none';
        resolve();
        return;
      }

      if (typeof gsap === 'undefined') {
        preloader.style.display = 'none';
        resolve();
        return;
      }

      let count = { val: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(preloader, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
              preloader.style.display = 'none';
              resolve();
            }
          });
        }
      });

      if (logoPath) {
        tl.to(logoPath, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0);
      }
      tl.to(count, {
        val: 100, duration: 1.8, ease: 'power2.inOut',
        onUpdate: () => { if (counter) counter.textContent = Math.round(count.val); }
      }, 0);
      tl.to({}, { duration: 0.2 });
    });
  }

  // ===== CUSTOM CURSOR (blog/post pages only) =====
  function initCustomCursor() {
    if (isMobile || isTouch || isAdminPage) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring || typeof gsap === 'undefined') return;

    document.body.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'left', { duration: 0.1, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'top', { duration: 0.1, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'left', { duration: 0.35, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'top', { duration: 0.35, ease: 'power3' });

    document.addEventListener('mousemove', (e) => {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      ring.classList.remove('hover-link', 'hover-image', 'hover-text');
      if (target) {
        const type = target.getAttribute('data-cursor');
        if (type === 'link') ring.classList.add('hover-link');
        else if (type === 'image') ring.classList.add('hover-image');
        else if (type === 'text') ring.classList.add('hover-text');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) ring.classList.remove('hover-link', 'hover-image', 'hover-text');
    });

    document.addEventListener('mouseleave', () => { gsap.to([dot, ring], { opacity: 0, duration: 0.2 }); });
    document.addEventListener('mouseenter', () => { gsap.to([dot, ring], { opacity: 1, duration: 0.2 }); });
  }

  // ===== SCROLL PROGRESS =====
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      }
    });
  }

  // ===== PAGE TRANSITIONS =====
  function initPageTransitions() {
    const bars = document.querySelectorAll('.transition-bar');
    if (bars.length === 0 || typeof gsap === 'undefined') return;

    // Entry animation
    if (sessionStorage.getItem('pageTransition')) {
      gsap.set(bars, { scaleX: 1, transformOrigin: 'left' });
      gsap.to(bars, {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power4.inOut',
        onComplete: () => { sessionStorage.removeItem('pageTransition'); }
      });
    }

    // Exit animation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      const isInternal = (
        (href.endsWith('.html') || href.startsWith('index.html') || href.startsWith('blog.html') || href.startsWith('post.html') || href.startsWith('admin.html') || href.startsWith('editor.html')) &&
        !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto:')
      );

      if (isInternal) {
        e.preventDefault();
        gsap.set(bars, { scaleX: 0, transformOrigin: 'right' });
        gsap.to(bars, {
          scaleX: 1, duration: 0.5, stagger: 0.06, ease: 'power4.inOut',
          onComplete: () => {
            sessionStorage.setItem('pageTransition', 'true');
            window.location.href = href;
          }
        });
      }
    });
  }

  // ===== INIT =====
  async function init() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!isAdminPage) {
      await initPreloader();
    }

    initLenis();

    if (!isAdminPage) {
      initCustomCursor();
      initScrollProgress();
    }

    initPageTransitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
