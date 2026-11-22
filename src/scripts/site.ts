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

