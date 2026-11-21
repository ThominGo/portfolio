// Filtres (hash #3d / #ux) et parallaxe des titres sur les cartes 3D.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll<HTMLElement>('[data-section]');
const links = document.querySelectorAll<HTMLElement>('[data-filter]');

function apply() {
  const which = location.hash === '#ux' ? 'ux' : '3d';
  sections.forEach((s) => s.classList.toggle('is-hidden', s.dataset.section !== which));
  links.forEach((l) => l.classList.toggle('is-active', l.dataset.filter === which));
  ScrollTrigger.refresh();
}
links.forEach((l) =>
  l.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', `#${l.dataset.filter}`);
    apply();
    window.scrollTo({ top: 0 });
  }),
);
window.addEventListener('hashchange', apply);
apply();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLElement>('.card-project').forEach((card) => {
    card.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const dir = Number(el.dataset.parallax);
      gsap.fromTo(
        el,
        { yPercent: -20 * dir },
        { yPercent: 20 * dir, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  });
}
