// Télécharge les médias (images, vidéos, polices, CV, favicon) depuis le CDN Webflow
// vers le dépôt local. À lancer une fois sur ta machine : npm run assets
// Les fichiers déjà présents sont ignorés. Relance-le sans risque.
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { collectMedia, isVideoName } from './lib/media.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CDN = 'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/';
const content = JSON.parse(fs.readFileSync(path.join(root, 'src/data/content.json'), 'utf8'));

const targets = new Map(); // chemin local -> url
const add = (rel, url) => url && targets.set(path.join(root, rel), url);

for (const m of collectMedia(content)) {
  if (!m.url) continue;
  add(isVideoName(m.file) ? `public/media/videos/${m.file}` : `src/assets/media/${m.file}`, m.url);
}
// Polices (noms locaux = ceux de src/styles/global.css)
add('public/fonts/PeridiaDisplay-Regular.woff2', CDN + '69bea77067dc0142529efe54_PeridiaDisplay-Regular.woff2');
add('public/fonts/Gilroy-Regular.otf', CDN + '69beaa3840aa5535381b9c8c_Radomir%20Tinkov%20-%20Gilroy-Regular.otf');
add('public/fonts/Gilroy-Black.otf', CDN + '69beaa38cca1c7c66bae1d85_Radomir%20Tinkov%20-%20Gilroy-Black.otf');
// Images de la page À propos et de la page 404
add('src/assets/media/69c818f16684ab14fa3dc108_mpi-2.png', CDN + '69c818f16684ab14fa3dc108_mpi-2.png');
add('src/assets/media/69c818a28babb77c4266da8e_mpi-1.png', CDN + '69c818a28babb77c4266da8e_mpi-1.png');
// Divers
add('public/media/CV_Thomas_Marilleau.pdf', 'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/6a106b5f5db729c22819f353_CV_Thomas_Marilleau.pdf');
add('public/media/opengraph-thomas.jpg', 'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/6aab973288c168d42d7849e5_opengraph-thomas.jpg');
add('public/favicon.png', CDN + '69c53b4996a1359f6bbb4d1f_tmfavicon.png');
add('public/webclip.png', CDN + '69c53c505394032a85d3c978_tm%20Webclip.png');

const LIMIT = 25 * 1024 * 1024; // limite Cloudflare Pages par fichier
let ok = 0, skipped = 0, failed = 0;
const big = [];

async function get([file, url]) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return void skipped++;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(file));
    const size = fs.statSync(file).size;
    if (size > LIMIT) big.push([path.relative(root, file), size]);
    ok++;
  } catch (e) {
    failed++;
    console.warn(`✗ ${path.relative(root, file)} : ${e.message}`);
  }
}

const queue = [...targets];
console.log(`${queue.length} fichiers à vérifier…`);
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await get(queue.shift()); }));

console.log(`Terminé : ${ok} téléchargés, ${skipped} déjà présents, ${failed} en échec.`);
if (big.length) {
  console.warn('\nFichiers de plus de 25 Mo (refusés par Cloudflare Pages). Héberge-les sur R2 (PUBLIC_VIDEO_BASE) ou compresse-les :');
  big.forEach(([f, s]) => console.warn(`  ${f} (${(s / 1048576).toFixed(1)} Mo)`));
}
process.exit(failed ? 1 : 0);
