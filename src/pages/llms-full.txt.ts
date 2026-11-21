import type { APIRoute } from 'astro';
import { projects, plain } from '../lib/content';
import { about, meta, workPath } from '../lib/i18n';
import { SITE } from '../lib/site';

const abs = (p: string) => new URL(p, SITE.url).href;

export const GET: APIRoute = () => {
  const aboutText = about.en.blocks.map((b) => `### ${b.title}\n${plain(b.html)}`).join('\n\n');
  const work = projects
    .map(
      (p) => `## ${`${p.name} ${p.secondName}`.trim()}

URL: ${abs(workPath(p.slug, 'en'))}
Categories: ${plain(p.categoryHtml)}
${p.link ? `Live project: ${p.link}\n` : ''}
### The project
${plain(p.intro)}

### Context & intention
${plain(p.context)}

### Process & production
${plain(p.process)}`,
    )
    .join('\n\n---\n\n');
  const body = `# ${SITE.name}: full content

> ${meta.en.home.description}

Contact: ${SITE.email} | ${SITE.url}

# About

${aboutText}

# Projects

${work}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
