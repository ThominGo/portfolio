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

function build(card: HTMLElement, amp: number, start: string, end: string, rest = false) {
  const top = card.querySelector<HTMLElement>('.top-name');
  const bot = card.querySelector<HTMLElement>('.bot-name');
  const splits: SplitText[] = [];
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(card, { scale: 0.6 }, { scale: 1, duration: 1, ease: 'power4.out' }, 0);
  const intro: { chars: Element[]; dir: 1 | -1; el: HTMLElement }[] = [];
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
    intro.push({ chars: s.chars, dir: from < 0 ? -1 : 1, el });
    tl.fromTo(s.chars, { y: `${from}svw` }, { y: '0svw', duration: 1, ease: 'power4.out', stagger: { amount: 0.1 } }, 0);
  };
  letters(top, -amp * 1.4);
  letters(bot, amp * 1.4);
  // rest : la carte est déjà en place au chargement, l'animation ne joue qu'en la quittant puis en la retrouvant
  if (rest) {
    tl.progress(1);
    // à l'arrivée : seules les lettres jouent leur entrée (la carte est déjà en place)
    const it = gsap.timeline({ delay: 0.15 });
    intro.forEach(({ chars, dir, el }) => {
      const size = parseFloat(getComputedStyle(el).fontSize);
      it.fromTo(chars, { y: dir * size * 1.45 }, { y: 0, duration: 1, ease: 'power4.out', stagger: { amount: 0.1 } }, 0);
      el.style.visibility = 'visible';
    });
  }
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

export function initCards(opts: { rest?: boolean } = {}) {
  const cards = [...document.querySelectorAll<HTMLElement>('.card-project:not(.cms):not(._404)')];
  if (!cards.length) return;
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 480px)', mobile: '(max-width: 479px)', reduce: '(prefers-reduced-motion: reduce)' },
    (ctx) => {
      const c = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
      if (c.reduce) return;
      const cleanups = cards.map((card) =>
        opts.rest
          ? build(card, c.mobile ? 20 : 10, 'top bottom', c.mobile ? 'bottom 40%' : 'top top', true)
          : c.mobile
            ? build(card, 20, 'top 70%', 'bottom 40%')
            : build(card, 10, 'bottom bottom', 'top top'),
      );
      return () => cleanups.forEach((f) => f());
    },
  );
  return mm;
}

// Titres : même animation de lettres que les cartes de la home, jouée à l'arrivée sur la page
// (masque par lettre, 1s, power4.out, stagger total 0.1s). Le décalage de départ vaut 1.45 fois la
// taille de la police : toujours au-delà du masque, donc aucun bout de lettre visible avant le départ.
const maskFix = (sp: SplitText) =>
  ((sp as any).masks as HTMLElement[] | undefined)?.forEach((m) => {
    m.style.paddingTop = '0.15em';
    m.style.paddingBottom = '0.25em';
    m.style.marginTop = '-0.15em';
    m.style.marginBottom = '-0.25em';
  });

export function initTitleIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // les lettres du haut descendent (-1), les autres montent (+1)
  const down = document.querySelectorAll<HTMLElement>('.horizontal-space .top-name');
  const up = document.querySelectorAll<HTMLElement>(
    '.horizontal-space .bot-name, body.playground .wrapper-hero .title-case, body.home .wrapper-hero .split-target',
  );
  const play = () => {
    const splits: SplitText[] = [];
    // une fois l'animation finie on retire le découpage : les jambages (y, g, p) redeviennent entiers
    const tl = gsap.timeline({ delay: 0.15, onComplete: () => splits.forEach((sp) => sp.revert()) });
    const letters = (el: HTMLElement, dir: 1 | -1) => {
      const size = parseFloat(getComputedStyle(el).fontSize);
      const sp = SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'gsap_split_letter' });
      // lettres qui montent : masque collé à la ligne (rien ne dépasse sous le titre, donc rien ne passe sur le texte voisin) ;
      // lettres qui descendent : marge au-dessus de la ligne pour ne pas rogner les accents
      if (dir === -1) maskFix(sp);
      splits.push(sp);
      tl.fromTo(sp.chars, { y: dir * size * 1.45 }, { y: 0, duration: 1, ease: 'power4.out', stagger: { amount: 0.1 } }, 0);
      el.style.visibility = 'visible'; // état de départ posé : aucune lettre visible avant l'animation
    };
    down.forEach((el) => letters(el, -1));
    up.forEach((el) => letters(el, 1));
  };
  (document.fonts?.ready ?? Promise.resolve()).then(play);
}
