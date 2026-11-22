// Accès au contenu (projets, playground). Source : src/data/content.json,
// généré soit depuis l'export Webflow (npm run seed), soit depuis Directus (npm run sync).
import fs from 'node:fs';
import path from 'node:path';
import type { ImageMetadata } from 'astro';
import raw from '../data/content.json';
import type { Locale } from './i18n';

export interface Media {
  file: string;
  url: string | null;
}
type M = Media | null;

export interface Project {
  /** id Directus (présent après npm run sync) */
  id?: number;
  slug: string;
  name: string;
  secondName: string;
  sort: number;
  bgColor: string;
  categories: string[];
  categoryHtml: string | null;
  link: string | null;
  intro: string | null;
  context: string | null;
  process: string | null;
  intro_fr: string | null;
  context_fr: string | null;
  process_fr: string | null;
  categoryHtml_fr: string | null;
  images: Record<
    | 'main' | 'i01' | 'left01' | 'right01' | 'i02' | 'mobile01' | 'mobile02' | 'bgMobile'
    | 'i03' | 'i04' | 'bgFull' | 'i05' | 'left02' | 'right02' | 'left03' | 'right03',
    M
  >;
  videos: {
    landscape01: M;
    landscape02: M;
    square: Media[];
    squareExtra: Media[];
    mobile: Media[];
  };
}

export interface PlaygroundItem {
  id?: number;
  slug: string;
  name: string;
  sort: number;
  kind: 'video' | 'image';
  media: M;
  alt?: string | null;
}

export interface Category {
  slug: string;
  name: string;
  name_fr: string;
}

const data = raw as unknown as {
  categories: Category[];
  projects: Project[];
  playground: PlaygroundItem[];
};

export const categories = data.categories;
export const projects: Project[] = [...data.projects].sort((a, b) => a.sort - b.sort);
export const playground: PlaygroundItem[] = [...data.playground].sort((a, b) => a.sort - b.sort);

export const projectsByCategory = (slug: string) => projects.filter((p) => p.categories.includes(slug));
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const isThreeD = (p: Project) => p.categories.includes('3d-immersif');

/** Texte riche localisé, avec repli sur l'anglais si la traduction est absente. */
export function localized(p: Project, field: 'intro' | 'context' | 'process' | 'categoryHtml', locale: Locale) {
  const fr = p[`${field}_fr` as keyof Project] as string | null;
  if (locale === 'fr' && fr) return { html: fr, translated: true };
  return { html: p[field], translated: locale === 'en' };
}
/** Vrai si la page projet FR est entièrement traduite (sinon : noindex + canonical EN). */
export const hasFrench = (p: Project) => !!(p.intro_fr || !p.intro) && !!(p.context_fr || !p.context) && !!(p.process_fr || !p.process);

export const plain = (html: string | null) =>
  (html ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>\s*<p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

// --- Médias --------------------------------------------------------------

/** Images locales (src/assets/media), indexées par nom de fichier. */
const found = import.meta.glob<ImageMetadata>('/src/assets/media/*.{avif,png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
});
export const localImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(found).map(([k, v]) => [k.split('/').pop() as string, v]),
);

const VIDEO_BASE = (import.meta.env.PUBLIC_VIDEO_BASE ?? '').replace(/\/$/, '');
/** URL finale d'une vidéo : base R2/CDN si définie, sinon fichier local, sinon source distante. */
export function videoSrc(m: M | undefined): string | null {
  if (!m) return null;
  if (VIDEO_BASE) return `${VIDEO_BASE}/${m.file}`;
  if (fs.existsSync(path.join(process.cwd(), 'public/media/videos', m.file))) return `/media/videos/${m.file}`;
  return m.url;
}
