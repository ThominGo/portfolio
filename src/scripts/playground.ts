import { initTitleIntro } from './card-anim';
initTitleIntro();

// Lightbox : clic sur une image ou une vidéo => plein écran, clic ou Échap pour fermer.
const open = (build: () => HTMLElement) => {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  const media = build();
  box.appendChild(media);
  const close = () => {
    box.classList.remove('is-open');
    setTimeout(() => box.remove(), 250);
    document.removeEventListener('keydown', onKey);
    (window as any).__lenis?.start();
  };
  const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && close();
  box.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(box);
  (window as any).__lenis?.stop();
  requestAnimationFrame(() => box.classList.add('is-open'));
};

document.querySelectorAll<HTMLAnchorElement>('[data-lightbox]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const img = a.querySelector('img');
    if (!img) return;
    e.preventDefault();
    open(() => {
      const big = document.createElement('img');
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      return big;
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-lightbox-video]').forEach((wrap) => {
  wrap.addEventListener('click', () => {
    const v = wrap.querySelector('video');
    if (!v) return;
    open(() => {
      const big = document.createElement('video');
      big.src = v.currentSrc || v.querySelector('source')?.src || v.src;
      big.autoplay = true;
      big.loop = true;
      big.muted = true;
      big.controls = true;
      big.playsInline = true;
      big.setAttribute('aria-label', v.getAttribute('aria-label') ?? '');
      big.addEventListener('click', (ev) => ev.stopPropagation());
      return big;
    });
  });
});
