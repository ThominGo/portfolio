// Aperçu avec le Visual Editor Directus : lance le site en mode « édition » et le garde synchronisé
// avec Directus. Dès qu'un contenu change dans Directus, le contenu est resynchronisé (content.json + médias)
// et le site se recharge tout seul. À lancer : npm run preview:cms  (Directus doit tourner : docker compose up -d)
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { api, URL_BASE } from './lib/directus.mjs';

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const c = spawn(cmd, args, { stdio: 'inherit', ...opts });
    c.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} -> ${code}`))));
  });

const snapshot = async () => {
  const [p, g] = await Promise.all([api('GET', '/items/projects?limit=-1&sort=id'), api('GET', '/items/playground?limit=-1&sort=id')]);
  return crypto.createHash('sha1').update(JSON.stringify([p, g])).digest('hex');
};

console.log(`Directus : ${URL_BASE}`);
try {
  await run('node', ['scripts/directus-sync.mjs']);
} catch (e) {
  console.error(`\nImpossible de se synchroniser avec Directus (${e.message}).\nVérifie que Directus tourne : docker compose up -d`);
  process.exit(1);
}

const dev = spawn('npx', ['astro', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PUBLIC_VISUAL_EDITING: 'true', PUBLIC_DIRECTUS_URL: URL_BASE },
});
const stop = () => { dev.kill(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
dev.on('exit', (code) => process.exit(code ?? 0));

let last = await snapshot();
let busy = false;
let warned = false;
setInterval(async () => {
  if (busy) return;
  busy = true;
  try {
    const now = await snapshot();
    warned = false;
    if (now !== last) {
      console.log('\n[preview:cms] Changement dans Directus, synchronisation...');
      await run('node', ['scripts/directus-sync.mjs']);
      last = now;
    }
  } catch (e) {
    if (!warned) console.warn(`[preview:cms] Directus injoignable pour l'instant (${e.message})`);
    warned = true;
  } finally {
    busy = false;
  }
}, 2000);
