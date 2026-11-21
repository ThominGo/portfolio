// Animation des cartes (reprise de l'interaction Webflow « Scroll interaction »).
// Carte : scale 0.6 -> 1 ; lettres du titre haut/bas : y -10svw/+10svw -> 0 (masque par lettre),
// stagger total 0.1s, durée 1s, ease power4.out. Déclenchement bottom bottom -> top top,
// lecture à l'entrée, retour arrière à la sortie. Mobile (<480px) : start "top 70%", end "bottom 40%", amplitude 20svw.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const lenis = (window as any).__lenis;
lenis?.on('scroll', ScrollTrigger.update);

function build(card: HTMLElement, amp: number, start: string, end: string) {
  const top = card.querySelector<HTMLElement>('.top-name');
  const bot = card.querySelector<HTMLElement>('.bot-name');
  const splits: SplitText[] = [];
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(card, { scale: 0.6 }, { scale: 1, duration: 1, ease: 'power4.out' }, 0);
  const letters = (el: HTMLElement | null, from: number) => {
    if (!el) return;
    const s = SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'gsap_split_letter' });
    // le masque coupe sinon les jambages (y, g, p) à cause du line-height: 1
    ((s as any).masks as HTMLElement[] | undefined)?.forEach((m) => {
      m.style.paddingTop = '0.15em';
      m.style.paddingBottom = '0.25em';
      m.style.marginTop = '-0.15em';
      m.style.marginBottom = '-0.25em';
    });
    splits.push(s);
    tl.fromTo(s.chars, { y: `${from}svw` }, { y: '0svw', duration: 1, ease: 'power4.out', stagger: { amount: 0.1 } }, 0);
  };
  letters(top, -amp);
  letters(bot, amp);
  const st = ScrollTrigger.create({
    trigger: card,
    start,
    end,
    onEnter: () => tl.play(),
    onLeave: () => tl.reverse(),
    onEnterBack: () => tl.play(),
    onLeaveBack: () => tl.reverse(),
  });
  return () => {
    st.kill();
    tl.kill();
    splits.forEach((s) => s.revert());
    gsap.set(card, { clearProps: 'transform,scale' });
  };
}

export function initCards() {
  const cards = [...document.querySelectorAll<HTMLElement>('.card-project:not(.cms):not(._404)')];
  if (!cards.length) return;
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 480px)', mobile: '(max-width: 479px)', reduce: '(prefers-reduced-motion: reduce)' },
    (ctx) => {
      const c = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
      if (c.reduce) return;
      const cleanups = cards.map((card) =>
        c.mobile ? build(card, 20, 'top 70%', 'bottom 40%') : build(card, 10, 'bottom bottom', 'top top'),
      );
      return () => cleanups.forEach((f) => f());
    },
  );
  return mm;
}
