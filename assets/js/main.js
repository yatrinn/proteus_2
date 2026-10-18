// Proteus site behaviour: mobile menu, videos that play only while visible (with a pause control
// for each), and a light reveal on scroll. No dependencies.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- mobile menu ----------
  const menuBtn = document.querySelector('.nav__menu');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    const setOpen = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };
    menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // ---------- videos ----------
  const videos = Array.from(document.querySelectorAll('video[data-inview]'));
  const buttons = new Map();
  document.querySelectorAll('.vbtn[data-video]').forEach((b) => buttons.set(b.dataset.video, b));

  const sync = (v) => {
    const b = buttons.get(v.id);
    if (b) b.setAttribute('aria-pressed', String(v.paused));
  };
  const wake = (v) => {
    if (v.preload !== 'auto') {
      v.preload = 'auto';
      if (v.readyState === 0) v.load();
    }
  };
  const tryPlay = (v) => {
    wake(v);
    const p = v.play();
    if (p && p.catch) p.catch(() => sync(v));
  };

  videos.forEach((v) => {
    v.muted = true;
    // Without motion the hero shows the braced structure instead of the first frame of the loop.
    if (reduceMotion.matches && v.dataset.still) v.poster = v.dataset.still;
    v.addEventListener('play', () => sync(v));
    v.addEventListener('pause', () => sync(v));
    sync(v);
  });

  buttons.forEach((b, id) => {
    const v = document.getElementById(id);
    if (!v) return;
    b.addEventListener('click', () => {
      if (v.paused) {
        v.dataset.userPaused = '';
        tryPlay(v);
      } else {
        v.dataset.userPaused = '1';
        v.pause();
      }
    });
  });

  const visible = new Set();
  const shouldAutoplay = (v) => !reduceMotion.matches && v.dataset.userPaused !== '1';

  if ('IntersectionObserver' in window) {
    // Start fetching a little before a video scrolls into view, play only while it is mostly visible.
    const nearIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { wake(e.target); nearIO.unobserve(e.target); } });
    }, { rootMargin: '600px 0px' });
    const playIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          visible.add(v);
          if (shouldAutoplay(v)) tryPlay(v);
        } else {
          visible.delete(v);
          if (!v.paused) v.pause();
        }
      });
    }, { threshold: [0, 0.35, 0.7] });
    videos.forEach((v) => {
      if (v.preload !== 'auto') nearIO.observe(v);
      playIO.observe(v);
    });
  } else if (!reduceMotion.matches) {
    videos.forEach((v) => tryPlay(v));
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      videos.forEach((v) => { if (!v.paused) v.pause(); });
    } else {
      visible.forEach((v) => { if (shouldAutoplay(v)) tryPlay(v); });
    }
  });

  reduceMotion.addEventListener && reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) videos.forEach((v) => v.pause());
  });

  // ---------- reveal on scroll ----------
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }
})();
