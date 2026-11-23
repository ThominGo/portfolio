// Accueil : filtres 3D / UX (hash) + animation des cartes.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCards, initTitleIntro } from './card-anim';

const sections = document.querySelectorAll<HTMLElement>('[data-section]');
const links = document.querySelectorAll<HTMLElement>('[data-filter]');

// adresses de l'ancien site conservées (#3d-immersif, #ux-ui-webflow) ; les anciens raccourcis #3d et #ux restent acceptés
const HASH: Record<string, string> = { '3d': '#3d-immersif', ux: '#ux-ui-webflow' };
function apply() {
  const which = ['#ux-ui-webflow', '#ux'].includes(location.hash) ? 'ux' : '3d';
  sections.forEach((s) => s.classList.toggle('is-hidden', s.dataset.section !== which));
  links.forEach((l) => l.classList.toggle('is-active', l.dataset.filter === which));
  ScrollTrigger.refresh();
}
links.forEach((l) =>
  l.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', HASH[l.dataset.filter!]);
    apply();
    (window as any).__lenis?.scrollTo(0, { immediate: true });
  }),
);
window.addEventListener('hashchange', apply);
apply();
initCards();

initTitleIntro();
