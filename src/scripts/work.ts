// Pages projet : animation des titres uniquement (pas de parallaxe sur les médias).
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { initTitleIntro } from './card-anim';

gsap.registerPlugin(ScrollTrigger);
initTitleIntro();
(window as any).__lenis?.on('scroll', ScrollTrigger.update);
// les images qui finissent de charger changent la hauteur de la page : on recalcule les positions pour éviter les sauts
window.addEventListener('load', () => ScrollTrigger.refresh());
