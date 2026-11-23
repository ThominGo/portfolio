// Pages projet : léger parallaxe sur les médias du contenu (.para) et sur l'image du hero des projets UX/UI.
// Le parallaxe déplace le bloc entier (translation seule) : pas de zoom ni de recadrage, donc les captures
// de sites gardent leur ratio et ne sont jamais coupées.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTitleIntro } from './card-anim';

gsap.registerPlugin(ScrollTrigger);
initTitleIntro();
(window as any).__lenis?.on('scroll', ScrollTrigger.update);

// pas de parallaxe sur les projets UX/UI (captures de sites : rien ne doit bouger ni être recadré)
const mm = gsap.matchMedia();
mm.add({ reduce: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 479px)' }, (ctx) => {
  const { reduce, mobile } = ctx.conditions as { reduce: boolean; mobile: boolean };
  if (reduce || document.body.classList.contains('work-ux')) return;
  const amp = mobile ? 10 : 24; // px de décalage de part et d'autre de la position normale

  // médias du contenu : le bloc qui contient l'image ou la vidéo se décale un peu plus vite que le défilement
  const boxes = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>('.wrapper-cms-page .para').forEach((el) => {
    const box = el.classList.contains('video-embed') ? el : el.parentElement;
    if (box) boxes.add(box);
  });
  boxes.forEach((box) =>
    gsap.fromTo(
      box,
      { y: amp },
      { y: -amp, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } },
    ),
  );

  // hero des projets UX/UI : l'image reste un peu en arrière quand on défile
  const hero = document.querySelector<HTMLElement>('.card-project.cms .case-image.ux')?.closest<HTMLElement>('.card-project');
  if (hero) {
    gsap.fromTo(
      hero,
      { yPercent: 0 },
      { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.horizontal-space', start: 'top top', end: 'bottom top', scrub: true } },
    );
  }
});
// les images qui finissent de charger changent la hauteur de la page : on recalcule les positions pour éviter les sauts
window.addEventListener('load', () => ScrollTrigger.refresh());
