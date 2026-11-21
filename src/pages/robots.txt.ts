import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

// Tous les robots, y compris les crawlers d'IA, sont les bienvenus.
const bots = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot', 'cohere-ai',
  'Meta-ExternalAgent', 'Bytespider', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User',
];

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
