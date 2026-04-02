/* ==========================================================================
   app.js — Premium Motion System
   Ahmad Azzam Fuadie Portfolio — Awwwards SOTD Quality
   ========================================================================== */

(function () {
  'use strict';

  // ===== REDUCED MOTION CHECK =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 1024;
  const isTouch = 'ontouchstart' in window;

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
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY = 0;

  function updateNav() {
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

  // If reduced motion, show all content and return early
  if (prefersReducedMotion) {
    document.querySelectorAll('.hero__badge, .hero__name, .hero__subtitle, .hero__tagline, .hero__ctas, .hero__floating-stats').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) typingEl.textContent = 'Performance Marketer. AI Engineer. Product Builder.';
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';

    // Still enable nav scroll behavior
    window.addEventListener('scroll', () => {
      updateNav();
      updateActiveLink();
    }, { passive: true });

    // Smooth scroll for anchor links
    initSmoothScroll();
    animateCounters();
    return;
  }

  // ==========================================================================
  //  A. CUSTOM TEXT SPLITTER (SplitText replacement)
  // ==========================================================================
  function splitText(element, type = 'chars') {
    const result = { chars: [], words: [], lines: [] };
    if (!element) return result;

    const text = element.textContent;
    element.innerHTML = '';
    element.setAttribute('aria-label', text);

    if (type === 'chars') {
      // Preserve HTML structure by iterating character by character
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
    } else if (type === 'lines') {
      // Split into words first, then group into lines
      const words = text.split(/\s+/).filter(Boolean);
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.style.display = 'inline';
        span.textContent = word + (i < words.length - 1 ? ' ' : '');
        element.appendChild(span);
      });
      result.lines = Array.from(element.children);
    }

    return result;
  }

  // ==========================================================================
  //  B. PRELOADER
  // ==========================================================================
  function initPreloader() {
    return new Promise(resolve => {
      const preloader = document.getElementById('preloader');
      const counter = document.getElementById('preloaderCounter');
      const logoPath = document.querySelector('.preloader__logo path');
      if (!preloader) { resolve(); return; }

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

      // Logo path draw
      if (logoPath) {
        tl.to(logoPath, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.inOut'
        }, 0);
      }

      // Counter 0 → 100
      tl.to(count, {
        val: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counter) counter.textContent = Math.round(count.val);
        }
      }, 0);

      // Slight pause before exit
      tl.to({}, { duration: 0.2 });
    });
  }

  // ==========================================================================
  //  C. LENIS SMOOTH SCROLL
  // ==========================================================================
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Nav updates via lenis
    lenis.on('scroll', () => {
      updateNav();
      updateActiveLink();
    });
  }

  // ==========================================================================
  //  D. CUSTOM CURSOR (Desktop only)
  // ==========================================================================
  function initCustomCursor() {
    if (isMobile || isTouch) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'left', { duration: 0.1, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'top', { duration: 0.1, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'left', { duration: 0.35, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'top', { duration: 0.35, ease: 'power3' });

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotX(mouseX);
      dotY(mouseY);
      ringX(mouseX);
      ringY(mouseY);
    });

    // Cursor states based on data-cursor attribute
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
      if (target) {
        ring.classList.remove('hover-link', 'hover-image', 'hover-text');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    });
  }

  // ==========================================================================
  //  E. MAGNETIC EFFECT
  // ==========================================================================
  function initMagnetic() {
    if (isMobile || isTouch) return;

    const magneticEls = document.querySelectorAll('[data-magnetic]');
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dist = Math.sqrt(x * x + y * y);
        const maxDist = 100;
        if (dist < maxDist) {
          const strength = 0.3;
          gsap.to(el, {
            x: x * strength,
            y: y * strength,
            duration: 0.4,
            ease: 'power3.out'
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // ==========================================================================
  //  F. THREE.JS PARTICLE FIELD (Hero Background)
  // ==========================================================================
  function initParticleField() {
    const canvas = document.getElementById('heroCanvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, hero.offsetWidth / hero.offsetHeight, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(hero.offsetWidth, hero.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = isMobile ? 400 : 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    const colorPalette = [
      new THREE.Color('#00d4aa'),
      new THREE.Color('#6366f1'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.1,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 2 : 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Line connections (desktop only)
    let lineGeometry, lineMaterial, lineObj;
    if (!isMobile) {
      lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4aa,
        transparent: true,
        opacity: 0.08,
      });
    }

    let mouse = { x: 9999, y: 9999 };
    if (!isMobile) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      });
      hero.addEventListener('mouseleave', () => {
        mouse.x = 9999;
        mouse.y = 9999;
      });
    }

    function animateParticles() {
      requestAnimationFrame(animateParticles);
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        // Brownian motion
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        // Boundary wrapping
        if (pos[i * 3] > 300) pos[i * 3] = -300;
        if (pos[i * 3] < -300) pos[i * 3] = 300;
        if (pos[i * 3 + 1] > 300) pos[i * 3 + 1] = -300;
        if (pos[i * 3 + 1] < -300) pos[i * 3 + 1] = 300;

        // Mouse repulsion (desktop)
        if (!isMobile && mouse.x !== 9999) {
          const worldMouseX = mouse.x * 300;
          const worldMouseY = mouse.y * 300;
          const dx = pos[i * 3] - worldMouseX;
          const dy = pos[i * 3 + 1] - worldMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            pos[i * 3] += (dx / dist) * force * 2;
            pos[i * 3 + 1] += (dy / dist) * force * 2;
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Draw connecting lines (desktop, throttled)
      if (!isMobile && lineMaterial) {
        if (lineObj) scene.remove(lineObj);
        const linePositions = [];
        const maxConnections = 200;
        let connectionCount = 0;
        const maxDist = 80;

        for (let i = 0; i < particleCount && connectionCount < maxConnections; i += 3) {
          for (let j = i + 3; j < particleCount && connectionCount < maxConnections; j += 3) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < maxDist) {
              linePositions.push(
                pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
                pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
              );
              connectionCount++;
            }
          }
        }

        if (linePositions.length > 0) {
          lineGeometry = new THREE.BufferGeometry();
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
          lineObj = new THREE.LineSegments(lineGeometry, lineMaterial);
          scene.add(lineObj);
        }
      }

      renderer.render(scene, camera);
    }

    animateParticles();

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = hero.offsetWidth / hero.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(hero.offsetWidth, hero.offsetHeight);
      }, 200);
    });

    // Allow mouse interaction on canvas
    canvas.style.pointerEvents = 'auto';
  }

  // ==========================================================================
  //  G. HERO ANIMATIONS
  // ==========================================================================
  function initHeroAnimations() {
    const heroName = document.getElementById('heroName');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroBadge = document.getElementById('heroBadge');
    const heroTagline = document.getElementById('heroTagline');
    const heroCtas = document.getElementById('heroCtas');
    const heroStats = document.getElementById('heroStats');

    // Split hero name into characters, keeping words grouped
    if (heroName) {
      const gradientSpan = heroName.querySelector('.gradient-text');
      const gradientText = gradientSpan ? gradientSpan.textContent : '';

      // Collect text before the <br> / gradient span
      const nameText = heroName.childNodes[0]?.textContent || '';
      heroName.innerHTML = '';

      // First line: "Ahmad Azzam" — wrap each word to prevent mid-word breaks
      const firstLineWords = nameText.trim().split(/\s+/);
      firstLineWords.forEach((word, wi) => {
        const wordWrap = document.createElement('span');
        wordWrap.style.display = 'inline-block';
        wordWrap.style.whiteSpace = 'nowrap';
        for (let i = 0; i < word.length; i++) {
          const span = document.createElement('span');
          span.className = 'char';
          span.style.display = 'inline-block';
          span.textContent = word[i];
          wordWrap.appendChild(span);
        }
        heroName.appendChild(wordWrap);
        if (wi < firstLineWords.length - 1) {
          heroName.appendChild(document.createTextNode(' '));
        }
      });

      heroName.appendChild(document.createElement('br'));

      // "Fuadie" in gradient — animate as one block (gradient-text needs bg-clip:text
      // which doesn't work with individual inline-block char spans)
      if (gradientText) {
        const newGradientSpan = document.createElement('span');
        newGradientSpan.className = 'gradient-text';
        newGradientSpan.style.display = 'inline-block';
        newGradientSpan.style.clipPath = 'inset(100% 0 0 0)';
        newGradientSpan.textContent = gradientText;
        heroName.appendChild(newGradientSpan);
      }

      heroName.style.opacity = '1';
      heroName.style.transform = 'none';
    }

    const tl = gsap.timeline({ delay: 0.2 });

    // Badge
    tl.to(heroBadge, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    });

    // Name characters clip-path reveal
    const allChars = heroName ? heroName.querySelectorAll('.char') : [];
    if (allChars.length) {
      tl.to(allChars, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.out'
      }, '-=0.2');
    }

    // Gradient text ("Fuadie") reveal with slight delay
    const gradientEl = heroName ? heroName.querySelector('.gradient-text') : null;
    if (gradientEl) {
      tl.to(gradientEl, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.2');
    }

    // Subtitle mask reveal
    if (heroSubtitle) {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      heroSubtitle.parentNode.insertBefore(wrapper, heroSubtitle);
      wrapper.appendChild(heroSubtitle);
      heroSubtitle.style.opacity = '1';

      tl.fromTo(heroSubtitle, {
        y: '100%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.3');
    }

    // Tagline
    tl.to(heroTagline, { opacity: 1, duration: 0.3 }, '-=0.2')
      .add(() => { startTypingAnimation(); });

    // CTAs
    tl.to(heroCtas, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.2');

    // Stat chips with elastic ease
    if (heroStats) {
      const chips = heroStats.querySelectorAll('.hero__stat-chip');
      tl.to(heroStats, { opacity: 1, duration: 0.01 }, '-=0.1');
      tl.fromTo(chips, {
        y: 30,
        opacity: 0,
        scale: 0.8
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.3');
    }

    // Hero parallax on scroll
    const heroContent = document.querySelector('.hero__content');
    const heroCanvas = document.getElementById('heroCanvas');

    if (heroContent) {
      gsap.to(heroContent, {
        y: '-30%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    if (heroCanvas) {
      gsap.to(heroCanvas, {
        y: '-15%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  }

  // ==========================================================================
  //  H. TYPING ANIMATION
  // ==========================================================================
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

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typingEl.textContent = currentPhrase.substring(0, charIndex);

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

  // ==========================================================================
  //  I. SCROLL PROGRESS BAR
  // ==========================================================================
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
        scrub: 0.1,
      }
    });
  }

  // ==========================================================================
  //  J. SECTION SCROLL ANIMATIONS
  // ==========================================================================
  function initSectionAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // --- Section Labels: line draws then text fades ---
    document.querySelectorAll('.section-label').forEach(label => {
      ScrollTrigger.create({
        trigger: label,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          label.classList.add('animated');
          gsap.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.3 });
        }
      });
      gsap.set(label, { opacity: 0 });
    });

    // --- Section Headings: word clip-path reveal ---
    // Handle headings that contain <br> and <span class="gradient-text">
    function splitHeadingIntoWords(heading) {
      const allWordInners = [];
      const originalHTML = heading.innerHTML;
      // Process each line (split by <br>)
      const lines = originalHTML.split(/<br\s*\/?>/i);
      heading.innerHTML = '';

      lines.forEach((lineHtml, lineIdx) => {
        if (lineIdx > 0) heading.appendChild(document.createElement('br'));

        // Create temp container to parse HTML
        const temp = document.createElement('span');
        temp.innerHTML = lineHtml.trim();

        // Process child nodes
        temp.childNodes.forEach(node => {
          if (node.nodeType === 3) {
            // Text node - split into words
            const words = node.textContent.split(/\s+/).filter(Boolean);
            words.forEach((word, wi) => {
              if (wi > 0) heading.appendChild(document.createTextNode(' '));
              const wordWrap = document.createElement('span');
              wordWrap.className = 'word';
              const inner = document.createElement('span');
              inner.className = 'word-inner';
              inner.textContent = word;
              wordWrap.appendChild(inner);
              heading.appendChild(wordWrap);
              allWordInners.push(inner);
            });
          } else if (node.nodeType === 1) {
            // Element node (e.g., <span class="gradient-text">)
            // For gradient-text, animate as whole block since bg-clip:text
            // doesn't work with individual word wrappers
            const clone = node.cloneNode(true);
            clone.style.display = 'inline-block';
            clone.style.clipPath = 'inset(100% 0 0 0)';
            heading.appendChild(clone);
            allWordInners.push(clone); // animate clipPath instead of translateY
          }
        });
      });

      return allWordInners;
    }

    document.querySelectorAll('.section-heading, .contact__heading').forEach(heading => {
      const wordInners = splitHeadingIntoWords(heading);

      ScrollTrigger.create({
        trigger: heading,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          wordInners.forEach((el, i) => {
            const delay = i * 0.08;
            if (el.classList.contains('gradient-text')) {
              // Gradient elements use clip-path animation
              gsap.to(el, {
                clipPath: 'inset(0% 0 0 0)',
                duration: 0.7,
                delay: delay,
                ease: 'power3.out',
              });
            } else {
              // Regular words use translateY
              gsap.to(el, {
                y: '0%',
                duration: 0.7,
                delay: delay,
                ease: 'power3.out',
              });
            }
          });
        }
      });
    });

    // --- Paragraphs: fade up with blur ---
    document.querySelectorAll('.about__text p, .section-desc, .contact__desc, .experience__header p').forEach(p => {
      gsap.fromTo(p, {
        y: 30,
        opacity: 0,
        filter: 'blur(4px)',
      }, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: p,
          start: 'top 88%',
          once: true,
        }
      });
    });

    // --- Image Reveal: teal overlay slides away ---
    document.querySelectorAll('.img-reveal').forEach(reveal => {
      const overlay = reveal.querySelector('.img-reveal__overlay');
      if (!overlay) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: reveal,
          start: 'top 80%',
          once: true,
        }
      });

      tl.fromTo(overlay, {
        scaleX: 0,
        transformOrigin: 'left',
      }, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power3.inOut',
      })
      .set(overlay, { transformOrigin: 'right' })
      .to(overlay, {
        scaleX: 0,
        duration: 0.6,
        ease: 'power3.inOut',
      });
    });

    // --- Project Cards: 3D perspective entrance ---
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card, {
        opacity: 0,
        y: 40,
        rotateX: 10,
        transformPerspective: 800,
      }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
        delay: (i % 2) * 0.15,
      });
    });

    // --- Case Study Cards: 3D entrance ---
    gsap.utils.toArray('.case-card').forEach((card, i) => {
      gsap.fromTo(card, {
        opacity: 0,
        y: 40,
        rotateX: 10,
        transformPerspective: 800,
      }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
        delay: (i % 2) * 0.15,
      });
    });

    // --- About Stats ---
    const aboutStats = document.querySelectorAll('.about__stat');
    aboutStats.forEach((stat, i) => {
      gsap.fromTo(stat, {
        opacity: 0,
        y: 20,
        scale: 0.9,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%',
          once: true,
        }
      });
    });

    // --- Timeline Section ---
    initTimelineAnimations();

    // --- Skills Tags: spring stagger ---
    gsap.utils.toArray('.skill-tag').forEach((tag, i) => {
      gsap.fromTo(tag, {
        opacity: 0,
        y: 20,
        rotate: (Math.random() - 0.5) * 6,
        scale: 0.8,
      }, {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: {
          trigger: tag,
          start: 'top 92%',
          once: true,
        },
        delay: (i % 6) * 0.05,
      });
    });

    // --- Cert Badges: scale stagger ---
    gsap.utils.toArray('.cert-badge').forEach((badge, i) => {
      gsap.fromTo(badge, {
        opacity: 0,
        scale: 0.5,
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: badge,
          start: 'top 92%',
          once: true,
        },
        delay: (i % 5) * 0.06,
      });
    });

    // --- Contact Social Icons: spring in ---
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, i) => {
      gsap.fromTo(link, {
        opacity: 0,
        y: 30,
        scale: 0.5,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: link,
          start: 'top 92%',
          once: true,
        },
        delay: i * 0.08,
      });
    });

    // --- Footer parallax ---
    const footer = document.querySelector('.footer');
    if (footer) {
      gsap.fromTo(footer, {
        y: 30,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          once: true,
        }
      });
    }
  }

  // ==========================================================================
  //  K. TIMELINE ANIMATIONS
  // ==========================================================================
  function initTimelineAnimations() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    // Add the drawing line overlay
    const drawLine = document.createElement('div');
    drawLine.className = 'timeline__line-draw';
    timeline.appendChild(drawLine);

    // The vertical line draws as user scrolls
    gsap.to(drawLine, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.5,
      }
    });

    // Each timeline item
    gsap.utils.toArray('.timeline__item').forEach((item, i) => {
      const card = item.querySelector('.timeline__card');
      const dot = item.querySelector('.timeline__dot');
      const isOdd = i % 2 === 0;
      const isPivot = item.classList.contains('timeline__item--pivot');

      // Card entrance with 3D rotation
      gsap.fromTo(card, {
        opacity: 0,
        x: isOdd ? -60 : 60,
        rotateY: isOdd ? -5 : 5,
      }, {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          once: true,
        }
      });

      // Dot scale with pulse ring
      gsap.fromTo(dot, { scale: 0 }, {
        scale: 1,
        duration: 0.5,
        ease: 'back.out(3)',
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            // Create pulse ring
            const pulse = document.createElement('div');
            pulse.className = 'timeline__dot-pulse';
            dot.style.position = 'relative';
            dot.appendChild(pulse);
            gsap.fromTo(pulse, {
              scale: 0.5,
              opacity: 1,
            }, {
              scale: 2.5,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => pulse.remove(),
            });
          }
        }
      });

      // Career Pivot particle burst
      if (isPivot) {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            createParticleBurst(card);
          }
        });
      }
    });
  }

  // ==========================================================================
  //  L. PARTICLE BURST EFFECT
  // ==========================================================================
  function createParticleBurst(parent) {
    const rect = parent.getBoundingClientRect();
    const count = 20;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'burst-particle';
      particle.style.left = '50%';
      particle.style.top = '50%';
      parent.style.position = 'relative';
      parent.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count;
      const distance = 40 + Math.random() * 80;
      const size = 3 + Math.random() * 4;

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power3.out',
        onComplete: () => particle.remove(),
      });
    }
  }

  // ==========================================================================
  //  M. PROJECT CARD 3D TILT
  // ==========================================================================
  function initCardTilt() {
    if (isMobile || isTouch) return;

    document.querySelectorAll('.project-card').forEach(card => {
      const glare = card.querySelector('.card-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out',
        });

        // Move glare
        if (glare) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.15), transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }

  // ==========================================================================
  //  N. COUNTER ANIMATION
  // ==========================================================================
  function animateCounters() {
    const counters = document.querySelectorAll('.about__stat-number');
    const aboutStats = document.getElementById('aboutStats');
    if (!aboutStats || counters.length === 0) return;

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
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              counter.textContent = prefix + current + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = prefix + target + suffix;
                // Scale bounce on completion
                gsap.fromTo(counter, { scale: 1.2 }, {
                  scale: 1,
                  duration: 0.4,
                  ease: 'elastic.out(1, 0.5)'
                });
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(aboutStats);
  }

  // ==========================================================================
  //  O. PAGE TRANSITIONS
  // ==========================================================================
  function initPageTransitions() {
    const bars = document.querySelectorAll('.transition-bar');
    if (bars.length === 0) return;

    // Entry animation (if coming from another page)
    if (sessionStorage.getItem('pageTransition')) {
      gsap.set(bars, { scaleX: 1, transformOrigin: 'left' });
      gsap.to(bars, {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power4.inOut',
        onComplete: () => {
          sessionStorage.removeItem('pageTransition');
        }
      });
    }

    // Exit animation (clicking internal links)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Check if internal link
      const isInternal = (
        (href.startsWith('/') || href.endsWith('.html') || href.startsWith('index.html') || href.startsWith('blog.html') || href.startsWith('post.html') || href.startsWith('admin.html') || href.startsWith('editor.html')) &&
        !href.startsWith('http') &&
        !href.startsWith('//') &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:')
      );

      if (isInternal) {
        e.preventDefault();
        gsap.set(bars, { scaleX: 0, transformOrigin: 'right' });
        gsap.to(bars, {
          scaleX: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power4.inOut',
          onComplete: () => {
            sessionStorage.setItem('pageTransition', 'true');
            window.location.href = href;
          }
        });
      }
    });
  }

  // ==========================================================================
  //  P. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
          if (lenis) {
            lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }
        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = nav ? nav.offsetHeight : 0;
          const targetPos = target.offsetTop - navHeight - 20;
          if (lenis) {
            lenis.scrollTo(targetPos, { duration: 1.2 });
          } else {
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // ==========================================================================
  //  INIT
  // ==========================================================================
  async function init() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

    // Preloader
    await initPreloader();

    // Smooth scroll
    initLenis();

    // Custom cursor
    initCustomCursor();

    // Magnetic effects
    initMagnetic();

    // Three.js particle field
    initParticleField();

    // Hero animations
    initHeroAnimations();

    // Scroll progress bar
    initScrollProgress();

    // Section scroll animations
    initSectionAnimations();

    // Counter animation
    animateCounters();

    // Project card 3D tilt
    initCardTilt();

    // Page transitions
    initPageTransitions();

    // Smooth anchor scrolling
    initSmoothScroll();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
