// Pages projet : léger parallaxe sur les images et vidéos du contenu (.para).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTitleIntro } from './card-anim';

gsap.registerPlugin(ScrollTrigger);
initTitleIntro();
(window as any).__lenis?.on('scroll', ScrollTrigger.update);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLElement>('.wrapper-cms-page .para').forEach((el) => {
    // image : on déplace l'image dans son conteneur ; vidéo : on déplace la <video> dans son .video-embed
    const isVideoBox = el.classList.contains('video-embed');
    const target = isVideoBox ? el.querySelector<HTMLElement>('video') : el;
    const clip = isVideoBox ? el : el.parentElement;
    if (!target || !clip) return;
    clip.style.overflow = 'hidden';
    gsap.fromTo(
      target,
      { yPercent: -5, scale: 1.12 },
      { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: clip, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
  ScrollTrigger.refresh();
}
