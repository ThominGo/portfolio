import type { APIRoute } from 'astro';
import { projects, plain } from '../lib/content';
import { meta, route, workPath } from '../lib/i18n';
import { SITE } from '../lib/site';

const abs = (p: string) => new URL(p, SITE.url).href;

export const GET: APIRoute = () => {
  const line = (p: (typeof projects)[number]) =>
    `- [${`${p.name} ${p.secondName}`.trim()}](${abs(workPath(p.slug, 'en'))}): ${plain(p.intro).slice(0, 160).replace(/\s+\S*$/, '')}…`;
  const body = `# ${SITE.name}

> ${meta.en.home.description} Based in ${SITE.city}, France. Available for freelance work. Contact: ${SITE.email}

Site available in English (default) and French (/fr). A complete plain-text version of all projects is available in [llms-full.txt](${abs('/llms-full.txt')}).

## Main pages

- [Projects](${abs(route('home', 'en'))}): selected work, filterable by 3D & Immersive and UX/UI & Webflow
- [About](${abs(route('about', 'en'))}): bio, expertise, awards and experience
- [Playground](${abs(route('playground', 'en'))}): personal experiments and visual explorations
- [Legal notice](${abs(route('legal', 'en'))})

## Projects

${projects.map(line).join('\n')}

## Optional

- [Version française](${abs(route('home', 'fr'))})
- [GitHub](${SITE.github})
- [CV (PDF)](${abs(SITE.cvUrl)})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
