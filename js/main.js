(function () {
  'use strict';

  // ---- Config: replace with the real number (country code, digits only) ----
  var WA_NUMBER = '910000000000';
  var WA_TEXT = 'Hello Winlark Mines, I would like to enquire about construction materials.';

  window.WINLARK_WA = WA_NUMBER;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  // WhatsApp links
  document.querySelectorAll('.wa-link').forEach(function (a) {
    var txt = a.dataset.product ? 'Hello Winlark Mines, I would like to enquire about ' + a.dataset.product + '.' : WA_TEXT;
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(txt);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Smooth scroll
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Text splitting (word masks)
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var out = [];
    (function walk(node, cls) {
      node.childNodes.forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part.trim()) { if (part) out.push(' '); return; }
            out.push('<span class="w"><span class="' + cls + '">' + part + '</span></span>');
          });
        } else if (n.nodeType === 1) {
          walk(n, n.className || '');
        }
      });
    })(el, '');
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.innerHTML = out.join('');
    el.querySelectorAll('.w > span').forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
  });

  // Header: shrink on scroll
  var nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 60,
    onUpdate: function (self) { nav.classList.toggle('scrolled', self.scroll() > 60); }
  });

  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');
  var isOpen = false;
  function toggleMenu(open) {
    isOpen = open;
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('i').className = open ? 'ph ph-x' : 'ph ph-list';
    menu.classList.toggle('open', open);
    gsap.to(menu, { clipPath: open ? 'circle(150% at 100% 0)' : 'circle(0% at 100% 0)', duration: 0.7, ease: 'power3.inOut' });
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    if (open) {
      gsap.fromTo(menu.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, delay: 0.25, duration: 0.6, ease: 'power3.out' });
    }
  }
  btn.addEventListener('click', function () { toggleMenu(!isOpen); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) toggleMenu(false); });

  // Page animations (one hero sequence, scroll headings, gentle reveals)
  function initPage() {
    if (reduce) {
      gsap.set('.split .w > span', { yPercent: 0 });
      return;
    }
    gsap.set('.split .w > span', { yPercent: 110 });
    gsap.set('.reveal', { y: 30, opacity: 0 });

    // Hero sequence
    var tl = gsap.timeline();
    tl.from('.nav', { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.hero-tag', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
      .to('.hero .split .w > span', { yPercent: 0, duration: 1, stagger: 0.07, ease: 'power4.out' }, '-=0.3')
      .from('.hero .btn', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.5')
      .from('.hero-img', { clipPath: 'inset(12% 8% 12% 8% round 28px)', opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=0.7');

    // Other headings on scroll
    gsap.utils.toArray('.split').forEach(function (h) {
      if (h.closest('.hero')) return;
      gsap.to(h.querySelectorAll('.w > span'), {
        yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'power4.out',
        scrollTrigger: { trigger: h, start: 'top 85%' }
      });
    });

    // Reveals (batched so groups stagger)
    ScrollTrigger.batch('.reveal', {
      start: 'top 90%', once: true,
      onEnter: function (els) { gsap.to(els, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }); }
    });

    // Hero image parallax
    gsap.to('[data-parallax]', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero-img', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  // Preloader
  var pl = document.getElementById('preloader');
  var fill = document.getElementById('plFill');
  var num = document.getElementById('plNum');
  var state = { p: 0 };
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();

  gsap.to('.pl-logo', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
  var loaded = false;
  window.addEventListener('load', function () { loaded = true; });

  gsap.to(state, {
    p: 90, duration: 1.4, ease: 'power1.out',
    onUpdate: function () { fill.style.width = state.p + '%'; num.textContent = Math.round(state.p) + '%'; },
    onComplete: function waitLoad() {
      if (!loaded) { setTimeout(waitLoad, 100); return; }
      gsap.to(state, {
        p: 100, duration: 0.5,
        onUpdate: function () { fill.style.width = state.p + '%'; num.textContent = Math.round(state.p) + '%'; },
        onComplete: function () {
          gsap.to(pl, {
            yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 0.2,
            onStart: initPage,
            onComplete: function () {
              pl.remove();
              document.body.style.overflow = '';
              if (lenis) lenis.start();
              ScrollTrigger.refresh();
            }
          });
        }
      });
    }
  });
})();
