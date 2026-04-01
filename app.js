/* ==========================================================================
   app.js — Animations, Interactions, Theme Toggle
   Ahmad Azzam Fuadie Portfolio
   ========================================================================== */

(function () {
  'use strict';

  // ===== THEME TOGGLE =====
  let currentTheme = 'dark';

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
    });
  }

  // ===== NAVIGATION =====
  const nav = document.getElementById('nav');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Scrolled state
    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide/show on scroll direction
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
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Hamburger menu
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

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('nav__mobile-menu--open');
        hamburgerBtn.classList.remove('nav__hamburger--active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link tracking
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ===== REDUCED MOTION CHECK =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== HERO ANIMATIONS =====
  function initHeroAnimations() {
    if (prefersReducedMotion) {
      // Show everything immediately
      document.querySelectorAll('#heroBadge, #heroName, #heroSubtitle, #heroTagline, #heroCtas, #heroStats').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      // Set final typing text
      const typingEl = document.querySelector('.typing-text');
      if (typingEl) typingEl.textContent = 'Performance Marketer. AI Engineer. Product Builder.';
      return;
    }

    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('#heroBadge', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .to('#heroName', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3')
    .to('#heroSubtitle', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .to('#heroTagline', {
      opacity: 1,
      duration: 0.3
    }, '-=0.2')
    .add(() => {
      startTypingAnimation();
    })
    .to('#heroCtas', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.2')
    .to('#heroStats', {
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');
  }

  // ===== TYPING ANIMATION =====
  function startTypingAnimation() {
    const phrases = [
      'Performance Marketer.',
      'AI Engineer.',
      'Product Builder.'
    ];
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      typingEl.textContent = currentText;

      let typeSpeed = isDeleting ? 30 : 60;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 300;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    const counters = document.querySelectorAll('.about__stat-number');
    const aboutStats = document.getElementById('aboutStats');
    if (!aboutStats) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out curve
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              counter.textContent = prefix + current + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = prefix + target + suffix;
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(aboutStats);
  }

  // ===== GSAP SCROLL ANIMATIONS (Fallback for browsers without animation-timeline) =====
  function initScrollAnimations() {
    if (prefersReducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Check if browser supports CSS scroll-driven animations
    const supportsScrollTimeline = CSS.supports('animation-timeline', 'view()');

    if (!supportsScrollTimeline) {
      // GSAP fallback for fade-in
      gsap.utils.toArray('.fade-in').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true
            }
          }
        );
      });
    }

    // Timeline cards — always use GSAP for alternating slide effect
    gsap.utils.toArray('.timeline__item').forEach((item, i) => {
      const card = item.querySelector('.timeline__card');
      const isOdd = i % 2 === 0;

      gsap.fromTo(card,
        { opacity: 0, x: isOdd ? -30 : 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          }
        }
      );

      // Animate the dot
      const dot = item.querySelector('.timeline__dot');
      gsap.fromTo(dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Project cards hover lift is CSS only — but add stagger entrance
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      if (!supportsScrollTimeline) {
        gsap.fromTo(card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true
            }
          }
        );
      }
    });

    // Case study cards
    gsap.utils.toArray('.case-card').forEach((card, i) => {
      if (!supportsScrollTimeline) {
        gsap.fromTo(card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true
            }
          }
        );
      }
    });

    // Cert badges
    gsap.utils.toArray('.cert-badge').forEach((badge, i) => {
      if (!supportsScrollTimeline) {
        gsap.fromTo(badge,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badge,
              start: 'top 95%',
              once: true
            }
          }
        );
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPos = target.offsetTop - navHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== INIT =====
  function init() {
    initHeroAnimations();
    animateCounters();
    initScrollAnimations();
  }

  // Wait for DOM and GSAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
