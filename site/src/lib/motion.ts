import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

export function initMotion() {
  if (reduced) {
    // Skip preloader, show everything
    const pre = document.getElementById('preloader');
    if (pre) pre.remove();
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ── Lenis smooth scroll ────────────────────────────────
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Preloader sequence ─────────────────────────────────
  const pre = document.getElementById('preloader');
  if (pre) {
    lenis.stop();
    const tl = gsap.timeline({
      onComplete: () => {
        pre.remove();
        lenis!.start();
        heroIntro();
      },
    });
    tl.to('.pre-logo', { opacity: 1, duration: 0.8, ease: 'power2.out' })
      .to('.pre-word span', { y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.4')
      .to('.pre-line', { width: 'min(280px, 40vw)', duration: 1, ease: 'expo.inOut' }, '-=0.5')
      .to(pre, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1,
        ease: 'expo.inOut',
        delay: 0.35,
      });
  } else {
    heroIntro();
  }

  // ── Header hide/show on scroll ─────────────────────────
  const header = document.getElementById('site-header');
  let lastY = 0;
  if (header) {
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      header.classList.toggle('is-scrolled', scroll > 60);
      if (scroll > 400 && scroll > lastY + 4) header.classList.add('is-hidden');
      else if (scroll < lastY - 4 || scroll < 400) header.classList.remove('is-hidden');
      lastY = scroll;
    });
  }

  // ── Menu overlay ───────────────────────────────────────
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('menu-overlay');
  if (toggle && overlay) {
    let open = false;
    const menuTl = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(overlay, { visibility: 'hidden' }) });
    menuTl
      .set(overlay, { visibility: 'visible' })
      .to(overlay, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
      .to('[data-menu-link]', { y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, '-=0.3');

    toggle.addEventListener('click', () => {
      open = !open;
      toggle.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      if (open) {
        lenis!.stop();
        menuTl.timeScale(1).play();
      } else {
        lenis!.start();
        menuTl.timeScale(1.6).reverse();
      }
    });
  }

  // ── Generic reveals ────────────────────────────────────
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  // Stagger groups
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal-item]');
    gsap.fromTo(
      items,
      { opacity: 0, y: 56 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 85%' },
      }
    );
  });

  // Split-line headline reveals
  document.querySelectorAll<HTMLElement>('[data-lines]').forEach((el) => {
    const lines = el.querySelectorAll('.line-inner');
    gsap.fromTo(
      lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 86%' },
      }
    );
  });

  // Parallax images — guarantee full coverage on every viewport.
  // The wrapper is the positioned box; the img is absolutely stretched to
  // fill it, then we translate vertically with enough overscan (scale) that
  // the edges never show. object-fit: cover + inset:0 keeps it filled.
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    // Ensure the wrapper is a positioning context that clips
    const cs = getComputedStyle(wrap);
    if (cs.position === 'static') wrap.style.position = 'relative';
    wrap.style.overflow = 'hidden';

    // Stretch the image to always cover the wrapper
    img.style.position = 'absolute';
    img.style.inset = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    const speed = parseFloat(wrap.dataset.parallax || '0.12');
    // Overscan so the translate never reveals an edge: scale = 1 + 2*speed
    const scale = 1 + speed * 2;
    gsap.fromTo(
      img,
      { yPercent: -speed * 100, scale },
      {
        yPercent: speed * 100,
        scale,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  // Image clip reveals
  document.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.3,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // Horizontal scroll sections — pin only on fine pointers (desktop)
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((section) => {
    const track = section.querySelector<HTMLElement>('.hscroll-track');
    if (!track) return;
    if (!finePointer) {
      section.classList.add('hscroll-touch');
      return;
    }
    const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -getAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getAmount()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  });

  // Marquees
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((m) => {
    const track = m.querySelector<HTMLElement>('.marquee-track');
    if (!track) return;
    const dir = m.dataset.marquee === 'right' ? 1 : -1;
    gsap.to(track, {
      xPercent: dir * -50,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });
  });

  // Progress bar for story pages
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  }
}

// Hero intro plays after preloader
function heroIntro() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const tl = gsap.timeline();
  const img = hero.querySelector('[data-hero-img]');
  const lines = hero.querySelectorAll('.line-inner');
  const fadeEls = hero.querySelectorAll('[data-hero-fade]');
  if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
  if (lines.length) tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }, 0.3);
  if (fadeEls.length) tl.fromTo(fadeEls, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.8);
}

export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: -80 });
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView();
  else window.scrollTo(0, target);
}
