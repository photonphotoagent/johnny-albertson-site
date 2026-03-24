/* ============================================
   JOHNNY ALBERTSON — MULTI-PAGE SITE
   GSAP + ScrollTrigger
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const isHome = document.body.classList.contains('page-home');

  // ---- PRELOADER (home only) ----
  if (isHome) {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      const preloaderTl = gsap.timeline({
        onComplete: () => {
          preloader.style.pointerEvents = 'none';
          initPage();
        }
      });
      preloaderTl
        .to('.preloader__line', { scaleX: 1, duration: 1, ease: 'power2.inOut' })
        .to('.preloader__text', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .to('.preloader__text', { opacity: 0, duration: 0.4, delay: 0.4 })
        .to('.preloader__line', { scaleX: 0, transformOrigin: 'right', duration: 0.5, ease: 'power2.in' }, '-=0.2')
        .to(preloader, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' }, '-=0.1');
    } else {
      initPage();
    }
  } else {
    // Sub-pages: run leaving transition then init
    const transition = document.querySelector('.page-transition');
    if (transition) {
      transition.classList.add('page-transition--leaving');
      setTimeout(() => {
        transition.style.display = 'none';
      }, 700);
    }
    initPage();
  }

  function initPage() {
    navBehavior();
    scrollProgress();
    backToTop();
    smoothScrollLinks();
    pageTransitions();
    stickyCta();

    // Page-specific animations
    if (isHome) {
      heroAnimations();
      introAnimations();
      statsBarAnimations();
      pathsAnimations();
      testimonialSnippetAnimations();
    }
    if (document.body.classList.contains('page-story')) {
      pageHeroAnimations();
      chapterAnimations();
      heartAnimations();
      strategicCtaAnimations();
    }
    if (document.body.classList.contains('page-results')) {
      pageHeroAnimations();
      philosophyAnimations();
      impactAnimations();
      strategicCtaAnimations();
    }
    if (document.body.classList.contains('page-work')) {
      pageHeroAnimations();
      partnershipAnimations();
      contentHubAnimations();
      autoPopulateContact();
    }
  }

  // ---- SCROLL PROGRESS BAR ----
  function scrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ---- BACK TO TOP ----
  function backToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        btn.classList.add('back-to-top--visible');
      } else {
        btn.classList.remove('back-to-top--visible');
      }
    }, { passive: true });
    btn.addEventListener('click', () => {
      gsap.to(window, { scrollTo: { y: 0 }, duration: 0.8, ease: 'power3.inOut' });
    });
  }

  // ---- STICKY CTA ----
  function stickyCta() {
    const cta = document.querySelector('.sticky-cta');
    if (!cta) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 800) {
        cta.classList.add('sticky-cta--visible');
      } else {
        cta.classList.remove('sticky-cta--visible');
      }
    }, { passive: true });
  }

  // ---- PAGE TRANSITIONS ----
  function pageTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Only intercept internal page links (not anchors, not external)
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.getAttribute('target') === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const transition = document.querySelector('.page-transition');
        if (transition) {
          transition.style.display = 'flex';
          transition.classList.remove('page-transition--leaving');
          transition.classList.add('page-transition--entering');
          setTimeout(() => {
            window.location.href = href;
          }, 500);
        } else {
          window.location.href = href;
        }
      });
    });
  }

  // ---- HERO ANIMATIONS (home) ----
  function heroAnimations() {
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .to('.hero__title-word', { y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 })
      .to('.hero__label', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to('.hero__sub', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('.hero__image', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.6')
      .to('.hero__paths', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .to('.hero__contact', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.hero__scroll', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    gsap.to('.hero__container', {
      opacity: 0, y: -60,
      scrollTrigger: { trigger: '.hero', start: '60% top', end: 'bottom top', scrub: 1 }
    });
  }

  // ---- INTRO ANIMATIONS (home) ----
  function introAnimations() {
    const intro = document.querySelector('.intro');
    if (!intro) return;
    gsap.from('.intro__inner > *', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: intro, start: 'top 75%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- STATS BAR ANIMATIONS (home) ----
  function statsBarAnimations() {
    const stats = document.querySelectorAll('.stats-bar__number');
    stats.forEach(num => {
      const target = parseInt(num.dataset.count, 10);
      if (isNaN(target)) return;
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: num, start: 'top 85%', once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate: () => { num.textContent = Math.round(counter.val); }
          });
        }
      });
    });
    gsap.from('.stats-bar__item', {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats-bar', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- PATHS ANIMATIONS (home) ----
  function pathsAnimations() {
    const paths = document.querySelector('.paths');
    if (!paths) return;
    gsap.from('.paths__header > *', {
      y: 25, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.paths__header', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.paths__card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.paths__grid', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- TESTIMONIAL SNIPPET (home) ----
  function testimonialSnippetAnimations() {
    const section = document.querySelector('.testimonial-snippet');
    if (!section) return;
    gsap.from('.testimonial-snippet__inner', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- PAGE HERO ANIMATIONS (sub-pages) ----
  function pageHeroAnimations() {
    const hero = document.querySelector('.page-hero');
    if (!hero) return;
    gsap.from('.page-hero__breadcrumb', { y: 15, opacity: 0, duration: 0.5, delay: 0.3, ease: 'power3.out' });
    gsap.from('.page-hero__title', { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    gsap.from('.page-hero__sub', { y: 20, opacity: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' });
    gsap.from('.page-hero__divider', { scaleX: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
  }

  // ---- NAV BEHAVIOR ----
  function navBehavior() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!nav || !toggle || !menu) return;

    ScrollTrigger.create({
      start: 100,
      onUpdate: (self) => {
        if (self.scroll() > 100) { nav.classList.add('nav--scrolled'); }
        else { nav.classList.remove('nav--scrolled'); }
      }
    });

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('nav__toggle--active');
      menu.classList.toggle('nav__menu--open');
    });

    menu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('nav__toggle--active');
        menu.classList.remove('nav__menu--open');
      });
    });
  }

  // ---- CHAPTER ANIMATIONS (story) ----
  function chapterAnimations() {
    document.querySelectorAll('.chapter').forEach((chapter) => {
      const content = chapter.querySelector('.chapter__content');
      const bgImage = chapter.querySelector('.chapter__bg-image');

      if (bgImage) {
        gsap.to(bgImage, {
          y: '10%',
          scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      }

      if (content) {
        const elements = content.querySelectorAll('.chapter__number, .chapter__title, .chapter__divider, .chapter__text, .chapter__quote');
        gsap.from(elements, {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: chapter, start: 'top 65%', toggleActions: 'play none none reverse' }
        });
      }

      // Photo reveal
      const photo = chapter.querySelector('.chapter__photo');
      if (photo) {
        gsap.from(photo, {
          y: 60, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: chapter, start: 'top 60%', toggleActions: 'play none none reverse' }
        });
      }
    });
  }

  // ---- PHILOSOPHY ANIMATIONS (results) ----
  function philosophyAnimations() {
    gsap.from('.philosophy__header > *', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.philosophy__header', start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.philosophy__card', {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.philosophy__contrast', start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.philosophy__value', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.philosophy__values', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.philosophy__pullquote blockquote', {
      y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.philosophy__pullquote', start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- IMPACT ANIMATIONS (results) ----
  function impactAnimations() {
    gsap.from('.impact__header > *', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.impact__header', start: 'top 75%', toggleActions: 'play none none reverse' }
    });

    // Stat counters
    document.querySelectorAll('.impact__stat-number').forEach(num => {
      const target = parseInt(num.dataset.count, 10);
      if (isNaN(target)) return;
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: num, start: 'top 85%', once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate: () => { num.textContent = Math.round(counter.val); }
          });
        }
      });
    });

    gsap.from('.impact__stat', {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.impact__stats', start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    document.querySelectorAll('.impact__project').forEach((project) => {
      const reveal = project.querySelector('.impact__project-reveal');
      const content = project.querySelector('.impact__project-content');
      if (reveal) {
        gsap.to(reveal, {
          scaleX: 0, duration: 1, ease: 'power3.inOut',
          scrollTrigger: { trigger: project, start: 'top 70%', toggleActions: 'play none none reverse' }
        });
      }
      if (content) {
        gsap.from(content.children, {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: project, start: 'top 65%', toggleActions: 'play none none reverse' }
        });
      }
    });

    gsap.from('.impact__testimonial-inner', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.impact__testimonial', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- HEART ANIMATIONS (story) ----
  function heartAnimations() {
    const heartTitle = document.querySelector('.heart__title');
    if (!heartTitle) return;
    gsap.from('.heart__title', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.heart__title', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.heart__paragraph', {
      y: 25, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.heart__text', start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.heart__image-frame', {
      y: 40, opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.heart__image', start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.heart__quote p', {
      y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.heart__quote', start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- PARTNERSHIP ANIMATIONS (work-with-me) ----
  function partnershipAnimations() {
    gsap.from('.partnership__header > *', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.partnership__header', start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.partnership__path', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.partnership__paths', start: 'top 75%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.direct-contact', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.direct-contact', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- CONTENT HUB ANIMATIONS (work-with-me) ----
  function contentHubAnimations() {
    const title = document.querySelector('.content-hub__title');
    if (!title) return;
    gsap.from('.content-hub__title', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.content-hub__title', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.content-hub__item', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.content-hub__grid', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ---- STRATEGIC CTA ANIMATIONS ----
  function strategicCtaAnimations() {
    document.querySelectorAll('.strategic-cta').forEach(cta => {
      const inner = cta.querySelector('.strategic-cta__inner');
      if (!inner) return;
      gsap.from(inner, {
        y: 40, opacity: 0, scale: 0.97, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: cta, start: 'top 80%', toggleActions: 'play none none reverse' }
      });
    });
  }

  // ---- AUTO-POPULATE CONTACT LINKS BASED ON PATH (work-with-me) ----
  function autoPopulateContact() {
    const hash = window.location.hash;
    const textLink = document.getElementById('contactText');
    const emailLink = document.getElementById('contactEmail');
    if (!textLink || !emailLink) return;

    const messages = {
      '#real-estate': {
        smsBody: "Hey Johnny, I'm interested in your real estate services — investing, loans, or buying/selling. Would love to chat.",
        emailSubject: "Real Estate Inquiry",
        emailBody: "Hey Johnny,\n\nI found your site and I'm interested in learning more about your real estate services. Whether it's investing, hard money loans, or buying/selling — I'd love to have a conversation.\n\nLooking forward to hearing from you."
      },
      '#veterans': {
        smsBody: "Hey Johnny, I'm a veteran looking for help with VA claims and benefits. Would appreciate your support.",
        emailSubject: "Veteran Services Inquiry",
        emailBody: "Hey Johnny,\n\nI'm a veteran and I came across your site. I could use some help navigating VA claims and benefits. I'd really appreciate the chance to talk.\n\nThank you for what you do."
      },
      '#speaking': {
        smsBody: "Hey Johnny, I'm interested in booking you as a motivational speaker for an upcoming event.",
        emailSubject: "Speaking Inquiry",
        emailBody: "Hey Johnny,\n\nI'd love to discuss booking you as a speaker for an upcoming event. Your story and message would resonate with our audience.\n\nCould we set up a time to talk?"
      }
    };

    const fallback = {
      smsBody: "Hey Johnny, I found your site and would love to connect. Let me know a good time to chat.",
      emailSubject: "Hey Johnny — Let's Connect",
      emailBody: "Hey Johnny,\n\nI came across your site and I'm interested in learning more about what you do. Would love to connect when you have a moment.\n\nThanks!"
    };

    const msg = messages[hash] || fallback;
    textLink.href = 'sms:+19106166111?body=' + encodeURIComponent(msg.smsBody);
    emailLink.href = 'mailto:johnny@johnnyalbertson.com?subject=' + encodeURIComponent(msg.emailSubject) + '&body=' + encodeURIComponent(msg.emailBody);
  }

  // ---- SMOOTH SCROLL (anchors on same page) ----
  function smoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
      });
    });
  }

});
