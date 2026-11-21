// Accueil : filtres 3D / UX (hash) + animation des cartes.
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCards } from './card-anim';

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
    (window as any).__lenis?.scrollTo(0, { immediate: true });
  }),
);
window.addEventListener('hashchange', apply);
apply();
initCards();
