// Récupère le contenu depuis Directus : réécrit src/data/content.json et télécharge
// les médias manquants (images -> src/assets/media, vidéos -> public/media/videos).
// À lancer avant chaque build : npm run sync
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { api, URL_BASE } from './lib/directus.mjs';
import { fileNameFromUrl, isVideoName } from './lib/media.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src/data/content.json');
const previous = JSON.parse(fs.readFileSync(out, 'utf8'));

const IMG = ['main', 'i01', 'left01', 'right01', 'i02', 'mobile01', 'mobile02', 'bgMobile', 'i03', 'i04', 'bgFull', 'i05', 'left02', 'right02', 'left03', 'right03'];
const files = new Map((await api('GET', '/files?limit=-1&fields=id,filename_download')).map((f) => [f.id, f.filename_download]));
const toDownload = new Map();

const media = (id) => {
  if (!id) return null;
  const name = files.get(id);
  if (!name) return null;
  const file = fileNameFromUrl(`https://x/${encodeURIComponent(name)}`);
  toDownload.set(file, id);
  return { file, url: `${URL_BASE}/assets/${id}` };
};
const list = (p, base, n) => Array.from({ length: n }, (_, i) => media(p[`vid_${base}_${i + 1}`])).filter(Boolean);

const rows = await api('GET', '/items/projects?limit=-1&sort=sort&filter[status][_eq]=published');
const projects = rows.map((p) => ({
  slug: p.slug, name: p.name, secondName: p.secondName ?? '', sort: p.sort, bgColor: p.bgColor ?? '#0f0f0f',
  categories: p.categories ?? [], categoryHtml: p.categoryHtml, categoryHtml_fr: p.categoryHtml_fr, link: p.link,
  intro: p.intro, context: p.context, process: p.process, intro_fr: p.intro_fr, context_fr: p.context_fr, process_fr: p.process_fr,
  images: Object.fromEntries(IMG.map((k) => [k, media(p[`img_${k}`])])),
  videos: {
    landscape01: media(p.vid_landscape01), landscape02: media(p.vid_landscape02),
    square: list(p, 'square', 5), squareExtra: list(p, 'squareExtra', 3), mobile: list(p, 'mobile', 3),
  },
}));
const pg = await api('GET', '/items/playground?limit=-1&sort=sort&filter[status][_eq]=published');
const playground = pg.map((i) => ({ slug: i.slug, name: i.name, sort: i.sort, kind: i.kind, media: media(i.media) }));

fs.writeFileSync(out, JSON.stringify({ ...previous, generatedAt: new Date().toISOString(), source: 'directus', projects, playground }, null, 2));
console.log(`content.json : ${projects.length} projets, ${playground.length} éléments playground`);

let n = 0;
for (const [file, id] of toDownload) {
  const dest = path.join(root, isVideoName(file) ? 'public/media/videos' : 'src/assets/media', file);
  if (fs.existsSync(dest)) continue;
  const res = await fetch(`${URL_BASE}/assets/${id}?download`);
  if (!res.ok) { console.warn(`✗ ${file} (${res.status})`); continue; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest));
  n++;
}
console.log(`${n} médias téléchargés.`);
