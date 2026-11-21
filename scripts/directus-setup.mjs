// Crée le modèle de données dans Directus puis y importe le contenu de src/data/content.json
// (médias récupérés depuis les URLs du CDN). À lancer une fois : npm run directus:setup
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { api, URL_BASE } from './lib/directus.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'src/data/content.json'), 'utf8'));

const IMG = ['main', 'i01', 'left01', 'right01', 'i02', 'mobile01', 'mobile02', 'bgMobile', 'i03', 'i04', 'bgFull', 'i05', 'left02', 'right02', 'left03', 'right03'];
const VID_SINGLE = ['landscape01', 'landscape02'];
const VID_LISTS = { square: 5, squareExtra: 3, mobile: 3 };

const text = (field, note, extra = {}) => ({ field, type: 'text', meta: { interface: 'input-multiline', note, ...extra } });
const rich = (field, note) => ({ field, type: 'text', meta: { interface: 'input-rich-text-html', note, width: 'full' } });
const str = (field, note, extra = {}) => ({ field, type: 'string', meta: { interface: 'input', note, ...extra } });
const file = (field) => ({ field, type: 'uuid', meta: { interface: 'file', special: ['file'], width: 'half' }, schema: {} });

const projectFields = [
  { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
  { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Publié', value: 'published' }, { text: 'Brouillon', value: 'draft' }] }, width: 'half' }, schema: { default_value: 'published' } },
  { field: 'sort', type: 'integer', meta: { interface: 'input', note: 'Ordre d’affichage (croissant)', width: 'half' }, schema: { default_value: 100 } },
  str('slug', 'URL : /work/<slug>', { required: true, width: 'half' }),
  str('name', 'Première ligne du titre (haut)', { required: true, width: 'half' }),
  str('secondName', 'Deuxième ligne du titre (bas)', { width: 'half' }),
  str('bgColor', 'Couleur de fond (hex)', { width: 'half' }),
  { field: 'categories', type: 'json', meta: { interface: 'select-multiple-checkbox', options: { choices: content.categories.map((c) => ({ text: c.name, value: c.slug })) }, note: 'Catégories (3d-immersif, ux-ui-webflow)' } },
  str('link', 'Lien du projet en ligne'),
  rich('categoryHtml', 'Tags (EN)'), rich('categoryHtml_fr', 'Tags (FR)'),
  rich('intro', 'Le projet (EN)'), rich('intro_fr', 'Le projet (FR)'),
  rich('context', 'Contexte & intention (EN)'), rich('context_fr', 'Contexte & intention (FR)'),
  rich('process', 'Process & production (EN)'), rich('process_fr', 'Process & production (FR)'),
  ...IMG.map((k) => file(`img_${k}`)),
  ...VID_SINGLE.map((k) => file(`vid_${k}`)),
  ...Object.entries(VID_LISTS).flatMap(([k, n]) => Array.from({ length: n }, (_, i) => file(`vid_${k}_${i + 1}`))),
];
const playgroundFields = [
  { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
  { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Publié', value: 'published' }, { text: 'Brouillon', value: 'draft' }] } }, schema: { default_value: 'published' } },
  { field: 'sort', type: 'integer', meta: { interface: 'input' }, schema: { default_value: 100 } },
  str('slug', 'Identifiant', { required: true }),
  str('name', 'Nom / texte alternatif', { required: true }),
  { field: 'kind', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Vidéo', value: 'video' }, { text: 'Image', value: 'image' }] } } },
  file('media'),
];

async function ensureCollection(name, note, fields) {
  const existing = await api('GET', `/collections/${name}`, null, { allow: [403, 404] });
  if (existing?.__status) {
    await api('POST', '/collections', { collection: name, meta: { note, icon: 'folder' }, schema: {}, fields });
    console.log(`+ collection ${name}`);
    // relations fichiers
    for (const f of fields.filter((x) => x.meta?.special?.includes('file'))) {
      await api('POST', '/relations', { collection: name, field: f.field, related_collection: 'directus_files', schema: { on_delete: 'SET NULL' } }, { allow: [400] });
    }
  } else {
    console.log(`= collection ${name} existe déjà`);
  }
}

await ensureCollection('projects', 'Projets du portfolio', projectFields);
await ensureCollection('playground', 'Éléments du Playground', playgroundFields);

// Lecture publique inutile : le build utilise le token. Rien à ouvrir.

const fileIds = new Map();
async function importMedia(m) {
  if (!m?.url) return null;
  if (fileIds.has(m.file)) return fileIds.get(m.file);
  const found = await api('GET', `/files?filter[filename_download][_eq]=${encodeURIComponent(m.file)}&limit=1&fields=id`);
  let id = found?.[0]?.id;
  if (!id) {
    try {
      const r = await api('POST', '/files/import', { url: m.url, data: { filename_download: m.file, title: m.file } });
      id = r.id;
      console.log(`  ↓ ${m.file}`);
    } catch (e) {
      console.warn(`  ✗ ${m.file} : ${e.message}`);
    }
  }
  fileIds.set(m.file, id ?? null);
  return id ?? null;
}

const existingSlugs = new Set(((await api('GET', '/items/projects?limit=-1&fields=slug')) ?? []).map((i) => i.slug));
for (const p of content.projects) {
  if (existingSlugs.has(p.slug)) { console.log(`= projet ${p.slug}`); continue; }
  const item = {
    status: 'published', sort: p.sort, slug: p.slug, name: p.name, secondName: p.secondName, bgColor: p.bgColor,
    categories: p.categories, link: p.link, categoryHtml: p.categoryHtml, categoryHtml_fr: p.categoryHtml_fr,
    intro: p.intro, intro_fr: p.intro_fr, context: p.context, context_fr: p.context_fr, process: p.process, process_fr: p.process_fr,
  };
  for (const k of IMG) item[`img_${k}`] = await importMedia(p.images[k]);
  for (const k of VID_SINGLE) item[`vid_${k}`] = await importMedia(p.videos[k]);
  for (const [k, n] of Object.entries(VID_LISTS)) {
    for (let i = 0; i < n; i++) item[`vid_${k}_${i + 1}`] = await importMedia(p.videos[k][i]);
  }
  await api('POST', '/items/projects', item);
  console.log(`+ projet ${p.slug}`);
}

const existingPg = new Set(((await api('GET', '/items/playground?limit=-1&fields=slug')) ?? []).map((i) => i.slug));
for (const it of content.playground) {
  if (existingPg.has(it.slug)) continue;
  await api('POST', '/items/playground', { status: 'published', sort: it.sort, slug: it.slug, name: it.name, kind: it.kind, media: await importMedia(it.media) });
  console.log(`+ playground ${it.slug}`);
}
console.log(`\nTerminé. Interface : ${URL_BASE}/admin`);
