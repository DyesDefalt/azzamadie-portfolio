/* ==========================================================================
   app.js — Shared Motion System (All Pages)
   Ahmad Azzam Fuadie Portfolio — Chemistry Multi-Page
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 1024;
  const isTouch = 'ontouchstart' in window;

  // ===== THEME TOGGLE =====
  var _ls = (function(){ try { return window['local'+'Storage']; } catch(e) { return null; } })();
  function safeGetStorage(key, fallback) { try { return _ls && _ls.getItem(key); } catch(e) { return fallback; } }
  function safeSetStorage(key, val) { try { _ls && _ls.setItem(key, val); } catch(e) {} }
  let currentTheme = safeGetStorage('theme', null) || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      safeSetStorage('theme', currentTheme);  
    });
  }

  // ===== NAVIGATION =====
  const nav = document.getElementById('nav');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY = 0;

  function updateNav() {
    if (!nav) return;
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    if (scrollY > 300) {
      if (scrollY > lastScrollY + 5) {
        nav.classList.add('nav--hidden');
      } else if (scrollY < lastScrollY - 5) {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastScrollY = scrollY;
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('nav__mobile-menu--open');
      if (isOpen) {
        mobileMenu.classList.remove('nav__mobile-menu--open');
        hamburgerBtn.classList.remove('nav__hamburger--active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('nav__mobile-menu--open');
        hamburgerBtn.classList.add('nav__hamburger--active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
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

  // ===== REDUCED MOTION: show all content & return =====
  if (prefersReducedMotion) {
    document.querySelectorAll('.hero__badge, .hero__name, .hero__subtitle, .hero__tagline, .hero__ctas, .hero__floating-stats').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) typingEl.textContent = 'From Lab Analyst to Digital Catalyst';
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';

    window.addEventListener('scroll', () => { updateNav(); }, { passive: true });
    return;
  }

  // ===== TEXT SPLITTER =====
  function splitText(element, type = 'chars') {
    const result = { chars: [], words: [], lines: [] };
    if (!element) return result;

    const text = element.textContent;
    element.innerHTML = '';
    element.setAttribute('aria-label', text);

    if (type === 'chars') {
      const words = text.split(/(\s+)/);
      words.forEach(segment => {
        if (/^\s+$/.test(segment)) {
          element.appendChild(document.createTextNode(segment));
        } else {
          const wordWrap = document.createElement('span');
          wordWrap.style.display = 'inline-block';
          wordWrap.style.whiteSpace = 'nowrap';
          for (let i = 0; i < segment.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.style.display = 'inline-block';
            charSpan.textContent = segment[i];
            charSpan.setAttribute('aria-hidden', 'true');
            wordWrap.appendChild(charSpan);
            result.chars.push(charSpan);
          }
          element.appendChild(wordWrap);
        }
      });
    } else if (type === 'words') {
      const words = text.split(/(\s+)/);
      words.forEach(segment => {
        if (/^\s+$/.test(segment)) {
          element.appendChild(document.createTextNode(segment));
        } else {
          const wordWrap = document.createElement('span');
          wordWrap.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = segment;
          inner.setAttribute('aria-hidden', 'true');
          wordWrap.appendChild(inner);
          element.appendChild(wordWrap);
          result.words.push(inner);
        }
      });
    }

    return result;
  }

  // ===== PRELOADER =====
  function initPreloader() {
    return new Promise(resolve => {
      const preloader = document.getElementById('preloader');
      const counter = document.getElementById('preloaderCounter');
      if (!preloader || !counter) { resolve(); return; }

      let count = 0;
      const target = 100;
      const duration = 1200;
      const startTime = Date.now();

      function tick() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        count = Math.floor(eased * target);
        counter.textContent = count;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = '100';
          gsap.to(preloader, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            delay: 0.2,
            onComplete: () => {
              preloader.style.display = 'none';
              resolve();
            }
          });
        }
      }
      requestAnimationFrame(tick);
    });
  }

  // ===== CUSTOM CURSOR =====
  function initCursor() {
    if (isMobile || isTouch) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;

      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Cursor states
    document.querySelectorAll('[data-cursor="link"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover-link');
        gsap.to(dot, { scale: 0, duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hover-link');
        gsap.to(dot, { scale: 1, duration: 0.2 });
      });
    });
  }

  // ===== SMOOTH SCROLL (native CSS scroll-behavior: smooth) =====
  // No Lenis — using native smooth scroll for ordinary scrolling experience

  // ===== PAGE TRANSITIONS =====
  function initPageTransitions() {
    const bars = document.querySelectorAll('.transition-bar');
    if (bars.length === 0) return;

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript')) return;
      if (link.getAttribute('target') === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = href;

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('nav__mobile-menu--open')) {
          mobileMenu.classList.remove('nav__mobile-menu--open');
          hamburgerBtn.classList.remove('nav__hamburger--active');
          document.body.style.overflow = '';
        }

        const tl = gsap.timeline();
        tl.to(bars, {
          scaleX: 1,
          transformOrigin: 'left',
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.inOut',
          onComplete: () => {
            window.location.href = target;
          }
        });
      });
    });

    // Entry animation — bars slide out
    gsap.set(bars, { scaleX: 0, transformOrigin: 'right' });
  }

  // ===== SCROLL PROGRESS =====
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });
  }

  // ===== MAGNETIC BUTTONS =====
  function initMagneticButtons() {
    if (isMobile || isTouch) return;

    document.querySelectorAll('.magnetic-wrap').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ===== TYPING EFFECT =====
  function initTypingEffect() {
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;

    const phrases = [
      'From Lab Analyst to Digital Catalyst',
      'Performance Marketer. AI Engineer.',
      'Building tools that bridge ads & code.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 30 : 50;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(type, delay);
    }
    type();
  }

  // ===== SECTION LABEL ANIMATION =====
  function initSectionLabels() {
    document.querySelectorAll('.section-label').forEach(label => {
      ScrollTrigger.create({
        trigger: label,
        start: 'top 85%',
        once: true,
        onEnter: () => label.classList.add('animated'),
      });
    });
  }

  // ===== HERO ANIMATIONS (Home page) =====
  function initHeroAnimations() {
    const badge = document.querySelector('.hero__badge');
    const name = document.querySelector('.hero__name');
    const tagline = document.querySelector('.hero__tagline');
    const subtitle = document.querySelector('.hero__subtitle');
    const ctas = document.querySelector('.hero__ctas');
    const stats = document.querySelector('.hero__floating-stats');

    if (!name) return;

    const tl = gsap.timeline({ delay: 0.3 });

    if (badge) tl.to(badge, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (name) tl.to(name, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    if (tagline) tl.to(tagline, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');
    if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    if (stats) tl.to(stats, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.2');
  }

  // ===== PARALLAX =====
  function initParallax() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      gsap.to(el, {
        y: () => window.innerHeight * speed * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  }

  // ===== INIT =====
  async function init() {
    gsap.registerPlugin(ScrollTrigger);

    await initPreloader();
    initCursor();
    initPageTransitions();
    initScrollProgress();
    initMagneticButtons();
    initSectionLabels();
    initParallax();

    // Home-page specific
    const page = document.body.dataset.page;
    if (page === 'home') {
      initHeroAnimations();
      initTypingEffect();

      // Hero mouse parallax on molecule
      const molecule = document.querySelector('.hero__molecule');
      if (molecule && !isMobile && !isTouch) {
        document.addEventListener('mousemove', (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 15;
          const y = (e.clientY / window.innerHeight - 0.5) * 10;
          molecule.style.transform = `translate(calc(50% + ${x}px), calc(-50% + ${y}px))`;
        });
      }
    }

    // Nav scroll
    window.addEventListener('scroll', updateNav, { passive: true });

    // Refresh ScrollTrigger after load
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
