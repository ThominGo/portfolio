// Accueil : filtres 3D / UX (hash) + animation des cartes.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCards, initTitleIntro } from './card-anim';

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

// Léger parallaxe sur la section UX/UI : chaque case se décale un peu (sens alterné d'une colonne à l'autre).
// On déplace la case entière et non l'image dans la case : la capture garde son ratio, rien n'est recadré.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const amp = window.innerWidth < 480 ? 8 : 16;
  document.querySelectorAll<HTMLElement>('.collection-ux-ui-webflow .collection-item-3').forEach((item, i) => {
    const dir = i % 2 ? -1 : 1;
    gsap.fromTo(
      item,
      { y: dir * amp },
      { y: -dir * amp, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } },
    );
  });
  ScrollTrigger.refresh();
}

initTitleIntro();
