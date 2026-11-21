// Lightbox simple : clic sur une image => plein écran, clic ou Échap pour fermer.
const links = document.querySelectorAll<HTMLAnchorElement>('[data-lightbox]');
links.forEach((a) => {
  a.addEventListener('click', (e) => {
    const img = a.querySelector('img');
    if (!img) return;
    e.preventDefault();
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    const big = document.createElement('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.appendChild(big);
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
  });
});
