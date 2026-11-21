// Client Directus minimal (REST + token statique), partagé par setup et sync.
import fs from 'node:fs';
import path from 'node:path';

// Charge .env sans dépendance
const envFile = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

export const URL_BASE = (process.env.DIRECTUS_URL || 'http://localhost:8055').replace(/\/$/, '');
const TOKEN = process.env.DIRECTUS_TOKEN || 'dev-static-token';

export async function api(method, route, body, { allow = [] } = {}) {
  const res = await fetch(`${URL_BASE}${route}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok && !allow.includes(res.status)) {
    throw new Error(`${method} ${route} -> ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  }
  return res.ok ? json.data : { __status: res.status, errors: json.errors };
}
