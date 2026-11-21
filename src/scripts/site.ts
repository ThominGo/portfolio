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

// Menu : « À propos » et « Playground » s'alignent sur les bords de la carte/photo de la page.
const nav = document.querySelector<HTMLElement>('.wrapper-nav');
function alignNav() {
  if (!nav) return;
  const card = [...document.querySelectorAll<HTMLElement>('.card-project')].find((c) => c.offsetWidth > 0);
  const vw = document.documentElement.clientWidth;
  if (!card || vw < 480) return void nav.classList.remove('nav-aligned');
  const left = (vw - card.offsetWidth) / 2;
  // pas assez de place à côté de « Projets » / « Contact » : on garde la disposition par défaut
  if (left < 170) return void nav.classList.remove('nav-aligned');
  nav.style.setProperty('--card-left', `${left}px`);
  nav.classList.add('nav-aligned');
}
alignNav();
window.addEventListener('resize', alignNav);
window.addEventListener('load', alignNav);
window.addEventListener('hashchange', () => requestAnimationFrame(alignNav));
document.addEventListener('click', () => setTimeout(alignNav, 50));
