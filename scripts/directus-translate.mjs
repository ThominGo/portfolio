// Envoie les traductions françaises (data/translations-fr.json) dans les champs *_fr de Directus.
// Par défaut, ne remplit que les champs encore vides : tes retouches dans Directus sont conservées.
//   npm run translate            -> champs vides uniquement
//   npm run translate -- --force -> écrase aussi les champs déjà remplis
// Ensuite : npm run sync (ou laisse npm run preview:cms le faire) pour régénérer le site.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { api } from './lib/directus.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const tr = JSON.parse(fs.readFileSync(path.join(root, 'data/translations-fr.json'), 'utf8'));
const FIELDS = ['categoryHtml_fr', 'intro_fr', 'context_fr', 'process_fr'];

const rows = await api('GET', `/items/projects?limit=-1&fields=id,slug,${FIELDS.join(',')}`);
let done = 0, kept = 0;
for (const row of rows) {
  const t = tr[row.slug];
  if (!t) continue;
  const patch = {};
  for (const f of FIELDS) {
    if (!t[f]) continue;
    if (row[f] && !force) { kept++; continue; }
    patch[f] = t[f];
  }
  if (Object.keys(patch).length) {
    await api('PATCH', `/items/projects/${row.id}`, patch);
    console.log(`✓ ${row.slug} : ${Object.keys(patch).join(', ')}`);
    done++;
  }
}
console.log(`\nTerminé : ${done} projet(s) mis à jour, ${kept} champ(s) déjà rempli(s) conservé(s).`);
