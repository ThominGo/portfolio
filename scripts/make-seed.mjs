// Transforme l'export brut du CMS Webflow (data/webflow-export.json)
// en src/data/content.json, le format lu par le site Astro.
// Usage : npm run seed
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileNameFromUrl, mediaFromUrl } from './lib/media.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(resolve(root, 'data/webflow-export.json'), 'utf8'));

const clean = (html) =>
  html ? html.replace(/<p>‍<\/p>/g, '').replace(/<p>\s*<\/p>/g, '').trim() || null : null;
const img = (v) => (v && v.url ? mediaFromUrl(v.url) : null);
const vid = (v) => (v ? mediaFromUrl(v) : null);

const categories = [
  { slug: '3d-immersif', name: '3D & Immersif', name_fr: '3D & Immersif' },
  { slug: 'ux-ui-webflow', name: 'UX/UI & Webflow', name_fr: 'UX/UI & Webflow' },
];
const catSlugByWfId = Object.fromEntries(
  src.categories.map((c) => [c.id, c.fieldData.name.startsWith('3D') ? '3d-immersif' : 'ux-ui-webflow']),
);

// Ordre d'affichage réel du site en production (la liste UX Webflow ne suivait pas le champ "ordre").
const sortOverride = {
  'un-beau-jour': 10,
  'momentum-academie': 20,
  'caractere-bois': 30,
  climax: 40,
  andre: 50,
  letsignit: 60,
};

const projects = src.projets
  .filter((p) => !p.isDraft && !p.isArchived)
  .map((p) => {
    const f = p.fieldData;
    return {
      slug: f.slug,
      name: f.name.trim(),
      secondName: (f['second-name'] ?? '').trim(),
      sort: sortOverride[f.slug] ?? f['ordre-2'] ?? 999,
      bgColor: f['bg-color'] ?? '#1b1b1b',
      categories: (f['type-3'] ?? []).map((id) => catSlugByWfId[id]).filter(Boolean),
      categoryHtml: clean(f['categorie-3']),
      link: f['lien-du-projet'] || null,
      intro: clean(f['explication-2']),
      context: clean(f['second-explication']),
      process: clean(f['third-explication']),
      // Traductions françaises : à remplir (Directus : champs *_fr). Repli sur l'anglais sinon.
      intro_fr: null,
      context_fr: null,
      process_fr: null,
      categoryHtml_fr: null,
      images: {
        main: img(f['main-image']),
        i01: img(f['image-01']),
        left01: img(f['image-left-01']),
        right01: img(f['image-right-01']),
        i02: img(f['image-02']),
        mobile01: img(f['image-mobile-01']),
        mobile02: img(f['image-mobile-02']),
        bgMobile: img(f['image-bg-mobile']),
        i03: img(f['image-03']),
        i04: img(f['image-04']),
        bgFull: img(f['image-bg-full']),
        i05: img(f['image-05']),
        left02: img(f['image-left-02']),
        right02: img(f['image-right-02']),
        left03: img(f['image-left-03']),
        right03: img(f['image-right-03']),
      },
      videos: {
        landscape01: vid(f['webm']),
        landscape02: vid(f['video-url-02']),
        square: [f['video-url-03'], f['video-url-04'], f['video-url-05'], f['04-video-1-1']].map(vid).filter(Boolean),
        squareExtra: [f['video-square-01'], f['video-square-02'], f['video-square-03']].map(vid).filter(Boolean),
        mobile: [f['video-mobile-01'], f['video-mobile-02'], f['video-mobile-03']].map(vid).filter(Boolean),
      },
    };
  })
  .sort((a, b) => a.sort - b.sort);

// Playground : séquence réelle relevée sur le site en production (le contenu publié diffère de l'export CMS brouillon).
// Format : [type, fin d'URL encodée]. v = vidéo (assets-global), i = image (CDN projet), x = entrée vide (ignorée).
const IMG_BASE = 'https://cdn.prod.website-files.com/6605b8aa45d40660f8a7b349/';
const VID_BASE = 'https://assets-global.website-files.com/65f09a13418ba26057ac98e7/';
const live = [
  ['v', '661068749b2644a4dbb21936_StiD_02-transcode.mp4'],
  ['i', '69c05e9f60b1382abc5e9611_faf.avif'],
  ['i', '69c1bfc10e4dd7c76abdfa7a_661d0b4e859b70eb49ffb8f8_02%20(1).avif'],
  ['i', '69c05b06f8a2d17684e3322b_Olive%20%26%20thym.avif'],
  ['i', '69c1bf91517f30777e85e232_661d0ae620f2c10d7cedef6c_01%20Mirroir.avif'],
  ['v', '66100c39e3afe1b27f44c870_Chess-transcode.mp4'],
  ['v', '661065f4c843e1e1ac6589f2_Nathan%20Lacombe-transcode.mp4'],
  ['i', '69c1bf768fe18b451b74fddb_661d0b4e6ae6cecc8bc273fa_Solal%20(1).avif'],
  ['v', '6610675f003ba02ba9cf5b2e_0001-0400-transcode.mp4'],
  ['i', '69c05959dad175912e7c83aa_Frame%2031.avif'],
  ['v', '66100bf1aca98fbf472c74bd_Samira-transcode.mp4'],
  ['x', ''], ['x', ''],
  ['v', '6610673c229616a08f6b9d16_01_TV-transcode.mp4'],
  ['i', '69c1c0892986b0270a52ce3a_660ac3f3cf4f3438e386c84d_Affiche%20Secondaire.avif'],
  ['i', '69c1c07aedd3d37bee963ad9_66114a73a65d6864af255d75_VFX.avif'],
  ['i', '69c05e553adef1023cd5fbbc_mist.avif'],
  ['v', '661068c2df3383f9299120a3_StiD_03-transcode.mp4'],
  ['i', '69c18a384ce19886c7780483_661002f7a73bf7359d3cea2c_Nath%20(1).avif'],
  ['i', '69c05a0c7bffa9d566ca5e88_A4%20-%208.avif'],
  ['i', '69c1c0996e32dbf6ba21f712_660ac3f343bf1e4a0265cefb_Capture%20d%E2%80%99e%CC%81cran%202023-05-31%20a%CC%80%2013.53%202.avif'],
  ['i', '69c18a485153b5637770c8e6_661002f72d049a4894f280be_419%20(1).avif'],
  ['i', '69c1bf80992ef743b793fc6f_661d0ae775b45b3193a60bfe_V4.avif'],
  ['i', '69c1bf893f3a572b2a839ca4_661d0ae6e65a5e79846be443_Maison.avif'],
  ['v', '661066b2b93f07ca0ad15faf_Majordom%20Connect-transcode.mp4'],
  ['v', '661c3cd117f8abd5b1fdaec8_Dt-transcode.mp4'],
  ['i', '69c1c06c2ba3ef515fe699d6_660ac69702fb18e205c1fcda_Capture%20d%E2%80%99e%CC%81cran%202024-02-22%20a%CC%80%2021.18%203.avif'],
  ['v', '6610678807ef0231601debb4_9P_Gravity-transcode.mp4'],
  ['v', '661068749b2644a4dbb21936_StiD_02-transcode.mp4'],
  ['i', '69c059d53adef1023cd56b3d_Frame%2010.avif'],
  ['i', '69c1bf9aaec37e61314c86d8_661d0af3b8eeb78689180a9f_RenduAccent02.avif'],
  ['v', '__cdn__65f09a13418ba26057ac98e7%2F69f6320300c7a02e654cb354_studio_9p_1767460702_3801314712902963272_23092027_mp4.mp4'],
];
const nameFromTail = (t) => {
  const last = decodeURIComponent(t).split('/').pop().replace(/\.[a-z0-9]+$/i, '');
  const parts = last.split('_');
  const base = /^[0-9a-f]{24}$/.test(parts[0]) ? parts.slice(1) : parts;
  const useful = base.filter((x) => !/^[0-9a-f]{24}$/.test(x));
  return (useful.length ? useful.join(' ') : last).replace(/-transcode$/i, '').replace(/[-]+/g, ' ').trim();
};
const playground = [];
for (const [kind, t] of live) {
  if (kind === 'x') continue;
  const url = kind === 'i' ? IMG_BASE + t : t.startsWith('__cdn__') ? 'https://cdn.prod.website-files.com/' + t.slice(7) : VID_BASE + t;
  const name = nameFromTail(t);
  playground.push({
    slug: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + (playground.length + 1),
    name,
    sort: (playground.length + 1) * 10,
    kind: kind === 'v' ? 'video' : 'image',
    media: mediaFromUrl(url),
  });
}

const out = { generatedAt: new Date().toISOString(), source: 'webflow-export', categories, projects, playground };
const dest = resolve(root, 'src/data/content.json');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log(`content.json : ${projects.length} projets, ${playground.length} items playground`);
