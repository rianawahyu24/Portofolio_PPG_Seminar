// ==========================================================================
// Portofolio Seminar PPG — shared interactivity
// ==========================================================================

/* Reduced-motion flag on <html> ASAP, before DOMContentLoaded, so CSS/JS below can read it */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) document.documentElement.classList.add('reduced-motion');

document.addEventListener('DOMContentLoaded', () => {

  /* Loading screen — hide once page is ready, capped at ~1.2s */
  const loader = document.getElementById('loader');
  if (loader) {
    const hideLoader = () => loader.classList.add('done');
    if (prefersReducedMotion) {
      hideLoader();
    } else {
      const minTimer = new Promise(res => setTimeout(res, 550));
      const ready = new Promise(res => {
        if (document.readyState === 'complete') res();
        else window.addEventListener('load', res, { once: true });
      });
      Promise.all([minTimer, ready]).then(hideLoader);
      setTimeout(hideLoader, 1400); // hard cap
    }
  }

  /* Scroll progress bar */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* Custom cursor (desktop, fine-pointer only — CSS also gates visibility) */
  const cursor = document.getElementById('custom-cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
    const growSelector = 'a, button, .card, .course-card, .toc-item, .people-card';
    document.querySelectorAll(growSelector).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
    document.querySelectorAll('.artefact-frame').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('grow', 'label'); cursor.dataset.label = 'LIHAT'; });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('grow', 'label'); });
    });
  }

  /* Back to top */
  document.querySelectorAll('.back-to-top').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* Draw-on-scroll connector lines (journey path, 4C connector) */
  const lineEls = document.querySelectorAll('.journey-line, .c-connector');
  if ('IntersectionObserver' in window && lineEls.length) {
    const lineIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('drawn'); lineIo.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    lineEls.forEach(el => lineIo.observe(el));
  } else {
    lineEls.forEach(el => el.classList.add('drawn'));
  }

  /* Subtle magnetic pull on CTAs (desktop, fine pointer only) */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.18;
        const my = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.setProperty('--mx', mx.toFixed(1) + 'px');
        el.style.setProperty('--my', my.toFixed(1) + 'px');
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  /* Ambient blob parallax (desktop, fine pointer only) — small, depth-only movement */
  const blobs = document.querySelectorAll('.ambient-blob');
  if (blobs.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    let ticking = false;
    const updateBlobs = () => {
      const y = window.scrollY;
      blobs.forEach(b => {
        const speed = parseFloat(b.dataset.speed || '0.04');
        b.style.transform = `translateY(${(y * speed).toFixed(1)}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateBlobs); ticking = true; }
    }, { passive: true });
  }

  /* Mobile nav toggle */
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  /* Accordion (4C reflection sections) */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close siblings within the same accordion group
      const group = item.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-item.open').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* Tabs (Artefak / Analisis / Kaitan Praktis) */
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const target = tabGroup.dataset.target;
    const panels = document.querySelectorAll(`[data-tabpanels="${target}"] .tab-panel`);
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(p => p.classList.toggle('active', p.dataset.tab === btn.dataset.tab));
      });
    });
  });

  /* Mark active nav link based on current page */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });

  /* Reveal-on-scroll (single subtle pass, not per-card default spam) */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
});
