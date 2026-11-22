// Scroll fluide (Lenis) + clin d'oeil du titre quand l'onglet perd le focus.
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  (window as any).__lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  document.dispatchEvent(new CustomEvent('lenis:ready', { detail: lenis }));
}

const original = document.title;
const blurTitle = document.body.dataset.blurTitle || original;
window.addEventListener('blur', () => (document.title = blurTitle));
window.addEventListener('focus', () => (document.title = original));


// Pages projet : « À propos » et « Playground » s'alignent sur les bords des images du contenu.
const navEl = document.querySelector<HTMLElement>('.wrapper-nav');
function alignNav() {
  if (!navEl) return;
  const col = document.querySelector<HTMLElement>('.wrapper-cms-page .image-full-cms, .wrapper-cms-page .double-image-cms');
  if (!col) return;
  const r = col.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  navEl.style.setProperty('--nav-l', `${r.left}px`);
  navEl.style.setProperty('--nav-r', `${vw - r.right}px`);
}
alignNav();
window.addEventListener('resize', alignNav);
window.addEventListener('load', alignNav);
