// Utilitaires partagés par les scripts (seed, fetch-assets, sync Directus).

/** Nom de fichier local sûr dérivé d'une URL de média (ex. CDN Webflow). */
export function fileNameFromUrl(url) {
  const u = new URL(url);
  const last = decodeURIComponent(u.pathname).split('/').pop() ?? 'file';
  return last
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const isVideoName = (name) => /\.(mp4|webm|mov|m4v)$/i.test(name);
export const isFontName = (name) => /\.(woff2?|ttf|otf)$/i.test(name);

/** Objet média normalisé : `file` = nom local, `url` = source distante (peut être null). */
export function mediaFromUrl(url) {
  if (!url) return null;
  return { file: fileNameFromUrl(url), url };
}

/** Parcourt récursivement un objet et renvoie tous les médias `{file, url}` trouvés. */
export function collectMedia(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    node.forEach((n) => collectMedia(n, out));
    return out;
  }
  if (typeof node.file === 'string' && 'url' in node) {
    out.push(node);
    return out;
  }
  Object.values(node).forEach((v) => collectMedia(v, out));
  return out;
}
