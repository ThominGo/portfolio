// Découpage d'un titre en lettres (une par masque) en gardant les ligatures de la police :
// les lettres qui forment une ligature restent ensemble dans un même bloc (elles s'animent d'un seul tenant).
export interface Split {
  chars: HTMLElement[];
  masks: HTMLElement[];
  revert: () => void;
}

export function fontReady(): Promise<unknown> {
  const fonts = document.fonts;
  if (!fonts) return Promise.resolve();
  return Promise.all([fonts.load('1em Peridiadisplay').catch(() => null), fonts.ready]);
}

export function splitLetters(el: HTMLElement): Split {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  const glyphs = [...text];

  // paires qui forment une ligature / forme contextuelle dans Peridia Display (relevées en comparant le rendu avec et sans ligatures)
  const LIGATURES = new Set(
    ('ca co ea eo fa fb ff fh fi fj fk fl ft fî fï fë ga ll ri ta ' +
      'fB fC fD fE fF fG fH fI fJ fK fL fM fN fO fP fQ fR fS fT fU fV fW fX fY fZ ' +
      'AD AL AR AU AV AW CH EA ET GH HE HF KC LA NN OO SS TE TF TT TY UT VY YT ZZ').split(' '),
  );
  const units: string[] = [];
  for (let i = 0; i < glyphs.length; ) {
    const pair = glyphs[i] + (glyphs[i + 1] ?? '');
    const n = glyphs[i + 1] !== undefined && LIGATURES.has(pair) ? 2 : 1;
    units.push(glyphs.slice(i, i + n).join(''));
    i += n;
  }

  el.textContent = '';
  el.setAttribute('aria-label', text);
  const chars: HTMLElement[] = [];
  const masks: HTMLElement[] = [];
  for (const u of units) {
    if (/^\s+$/.test(u)) {
      el.appendChild(document.createTextNode(u));
      continue;
    }
    const mask = document.createElement('span');
    mask.className = 'gsap_split_letter-mask';
    mask.setAttribute('aria-hidden', 'true');
    // marge latérale (compensée) : les empattements qui dépassent de la lettre ne sont pas rognés pendant l'animation
    mask.style.cssText = 'display:inline-block;overflow:clip;vertical-align:top;padding-left:0.2em;padding-right:0.2em;margin-left:-0.2em;margin-right:-0.2em;';
    const ch = document.createElement('span');
    ch.className = 'gsap_split_letter';
    ch.style.display = 'inline-block';
    ch.textContent = u;
    mask.appendChild(ch);
    el.appendChild(mask);
    masks.push(mask);
    chars.push(ch);
  }
  return {
    chars,
    masks,
    revert: () => {
      el.innerHTML = original;
      el.removeAttribute('aria-label');
    },
  };
}
