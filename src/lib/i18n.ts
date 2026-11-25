export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export type RouteKey = 'home' | 'about' | 'playground' | 'legal';

const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { en: '/', fr: '/fr' },
  about: { en: '/about', fr: '/fr/a-propos' },
  playground: { en: '/playground', fr: '/fr/playground' },
  legal: { en: '/legal-notice', fr: '/fr/mentions-legales' },
};

export const route = (key: RouteKey, locale: Locale) => routes[key][locale];
export const workPath = (slug: string, locale: Locale) => (locale === 'fr' ? `/fr/work/${slug}` : `/work/${slug}`);

export const htmlLang: Record<Locale, string> = { en: 'en', fr: 'fr' };
export const ogLocale: Record<Locale, string> = { en: 'en_US', fr: 'fr_FR' };

export const ui = {
  en: {
    nav: { projects: 'Projects', about: 'About', playground: 'Playground', contact: 'Contact' },
    legals: 'Legals',
    cv: 'CV',
    skip: 'Skip to content',
    filters: { threeD: '3D & Immersif', ux: 'UX/UI & Webflow' },
    viewProject: 'Voir le projet', // conservé tel quel depuis l'ancien site
    projectLink: 'Project link',
    labels: { project: 'The project', context: 'Context & intention', process: 'Process & production' },
    heroTitle: 'Marilleau',
    playgroundTitle: '(Labo)rilleau',
    blurTitle: "Danger ! Manque d'attention par ici !",
    notFound: { top: 'Page', bot: '404' },
    switchTo: 'Français',
  },
  fr: {
    nav: { projects: 'Projets', about: 'À propos', playground: 'Playground', contact: 'Contact' },
    legals: 'Mentions légales',
    cv: 'CV',
    skip: 'Aller au contenu',
    filters: { threeD: '3D & Immersif', ux: 'UX/UI & Webflow' },
    viewProject: 'Voir le projet',
    projectLink: 'Lien du projet',
    labels: { project: 'Le projet', context: 'Contexte & intention', process: 'Process & réalisation' },
    heroTitle: 'Marilleau',
    playgroundTitle: '(Labo)rilleau',
    blurTitle: "Danger ! Manque d'attention par ici !",
    notFound: { top: 'Page', bot: '404' },
    switchTo: 'English',
  },
} as const;

export const about = {
  en: {
    image_alt: 'Digital portrait of a man with short brown hair, beard, and a gray shirt wearing a necklace.',
    blocks: [
      {
        title: 'Hello',
        html: 'Freelance Web &amp; 3D Designer based in Bordeaux, creating visual experiences that blend interactive design and 3D universes, inspired by Internet culture and digital art.',
      },
      {
        title: 'Expertise',
        html: 'Direction Artistique<br/>3D &amp; Animation on Blender<br/>Web Design<br/>Webflow<br/>Motion Design<br/>Graphic Design',
      },
      {
        title: 'Awards',
        html: 'X1 Awwwards Nominee SOTY &amp; SOTM <br/>X1 Awwwards Sotd <br/><br/>X1 FWA SOTM &amp; SOTD <br/>X2 Muzli Honors <br/>X1 Gsap SOTD',
      },
      {
        title: 'Experience',
        html: '4 years at <a href="https://studio9p.com" target="_blank" rel="noopener" class="link">Studio 9P</a> as Junior Artistic Director<br/>→ Web Design <br/>→ Art Direction <br/>→ 3D - Blender <br/>→ Motion Design - After Effects <br/>→ Web Integration - Webflow<br/><br/>2 years Freelance in Artistic Director &amp; Web Design<br/><br/>MMI Bordeaux &amp; Master in Digital Art Direction at ECV Bordeaux',
      },
    ],
  },
  fr: {
    image_alt: "Portrait numérique d'un homme aux cheveux bruns courts, barbu, portant un t-shirt gris et un collier.",
    blocks: [
      {
        title: 'Bonjour',
        html: "Web &amp; 3D Designer freelance basé à Bordeaux, je crée des expériences visuelles qui mêlent design interactif et univers 3D, inspirées de la culture Internet et de l'art numérique.",
      },
      {
        title: 'Expertise',
        html: 'Direction Artistique<br/>3D &amp; Animation sous Blender<br/>Web Design<br/>Webflow<br/>Motion Design<br/>Design graphique',
      },
      {
        title: 'Récompenses',
        html: 'X1 Awwwards Nominee SOTY &amp; SOTM <br/>X1 Awwwards Sotd <br/><br/>X1 FWA SOTM &amp; SOTD <br/>X2 Muzli Honors <br/>X1 Gsap SOTD',
      },
      {
        title: 'Expérience',
        html: '4 ans chez <a href="https://studio9p.com" target="_blank" rel="noopener" class="link">Studio 9P</a> en tant que Directeur Artistique Junior<br/>→ Web Design <br/>→ Direction Artistique <br/>→ 3D - Blender <br/>→ Motion Design - After Effects <br/>→ Intégration Web - Webflow<br/><br/>2 ans en freelance : Direction Artistique &amp; Web Design<br/><br/>MMI Bordeaux &amp; Master en Direction Artistique Digitale à l\'ECV Bordeaux',
      },
    ],
  },
} as const;

export const legal = {
  en: [
    {
      title: 'Site Publisher',
      html: 'Thomas Marilleau<br/>Sole Trader – Micro-business<br/>SIRET: 990 194 078 00012<br/>APE Code: 6201Z – Computer Programming<br/>Address: 5 Route de Villenave, 40110 Morcenx-la-Nouvelle, France<br/>Email: thomas.marilleau@gmail.com<br/>Phone: +33 6 10 05 71 09<br/>',
    },
    {
      title: 'Intellectual Property',
      html: "All content on this site (text, images, graphics, logo, videos, etc.) is the exclusive property of Thomas Marilleau, unless otherwise stated. Any reproduction, representation, modification, publication, or adaptation of any part of the site's content, by any means or process, is prohibited without prior written authorization.",
    },
    {
      title: 'Personal Data',
      html: 'This site does not collect personal data without visitors\' knowledge. Any information sent by email is used solely to respond to inquiries. In accordance with the General Data Protection Regulation (GDPR), you may exercise your rights of access, rectification, or deletion of your data by sending an email to: <a href="mailto:thomas.marilleau@gmail.com">thomas.marilleau@gmail.com</a>.',
    },
    {
      title: 'Cookies',
      html: 'This site does not set advertising or tracking cookies. Audience measurement is handled by Simple Analytics, a privacy-friendly tool that does not use cookies and does not collect personal data.',
    },
    {
      title: 'Hosting Provider',
      html: 'This site is hosted by Cloudflare, Inc.<br/>101 Townsend Street<br/>San Francisco, CA 94107 – United States<br/>Website: <a href="https://www.cloudflare.com" target="_blank" rel="noopener">https://www.cloudflare.com</a><br/>',
    },
  ],
  fr: [
    {
      title: 'Éditeur du site',
      html: 'Thomas Marilleau<br/>Entrepreneur individuel – Micro-entreprise<br/>SIRET : 990 194 078 00012<br/>Code APE : 6201Z – Programmation informatique<br/>Adresse : 5 Route de Villenave, 40110 Morcenx-la-Nouvelle, France<br/>E-mail : thomas.marilleau@gmail.com<br/>Téléphone : +33 6 10 05 71 09<br/>',
    },
    {
      title: 'Propriété intellectuelle',
      html: "L'ensemble des contenus de ce site (textes, images, graphismes, logo, vidéos, etc.) est la propriété exclusive de Thomas Marilleau, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des contenus du site, par quelque moyen ou procédé que ce soit, est interdite sans autorisation écrite préalable.",
    },
    {
      title: 'Données personnelles',
      html: "Ce site ne collecte aucune donnée personnelle à l'insu des visiteurs. Les informations envoyées par e-mail sont utilisées uniquement pour répondre aux demandes. Conformément au Règlement général sur la protection des données (RGPD), vous pouvez exercer vos droits d'accès, de rectification ou de suppression de vos données en écrivant à : <a href=\"mailto:thomas.marilleau@gmail.com\">thomas.marilleau@gmail.com</a>.",
    },
    {
      title: 'Cookies',
      html: "Ce site ne dépose aucun cookie publicitaire ni de suivi. La mesure d'audience est réalisée avec Simple Analytics, un outil respectueux de la vie privée qui n'utilise pas de cookies et ne collecte aucune donnée personnelle.",
    },
    {
      title: 'Hébergeur',
      html: 'Ce site est hébergé par Cloudflare, Inc.<br/>101 Townsend Street<br/>San Francisco, CA 94107 – États-Unis<br/>Site web : <a href="https://www.cloudflare.com" target="_blank" rel="noopener">https://www.cloudflare.com</a><br/>',
    },
  ],
} as const;

export const meta = {
  en: {
    home: {
      title: 'Thomas Marilleau | Freelance Web & 3D Designer',
      description:
        'Freelance Web & 3D Designer. I build interactive experiences that blend design, 3D and motion, inspired by Internet culture and digital art.',
    },
    about: {
      title: 'Thomas Marilleau | About',
      description:
        'Freelance Web & 3D Designer based in Bordeaux. I build interactive experiences that blend design, 3D and motion, inspired by Internet culture and digital art.',
    },
    playground: {
      title: 'Thomas Marilleau | Playground',
      description:
        'Experiments and personal projects by Thomas Marilleau, exploring WebGL, 3D and motion at the crossroads of design and Internet culture.',
    },
    legal: {
      title: 'Legal Notice | Thomas Marilleau',
      description: 'Legal notice and terms for thomas-marilleau.com, freelance Web & 3D Designer based in Bordeaux.',
    },
    notFound: { title: 'Not Found', description: 'This page does not exist.' },
  },
  fr: {
    home: {
      title: 'Thomas Marilleau | Web & 3D Designer freelance à Bordeaux',
      description:
        "Web & 3D Designer freelance à Bordeaux. Je crée des expériences interactives mêlant design, 3D et motion, inspirées de la culture Internet.",
    },
    about: {
      title: 'Thomas Marilleau | À propos',
      description:
        "Web & 3D Designer freelance basé à Bordeaux. Je crée des expériences interactives mêlant design, 3D et motion, inspirées de la culture Internet.",
    },
    playground: {
      title: 'Thomas Marilleau | Playground',
      description:
        "Expérimentations et projets personnels de Thomas Marilleau autour du WebGL, de la 3D et du motion, à la croisée du design et de la culture Internet.",
    },
    legal: {
      title: 'Mentions légales | Thomas Marilleau',
      description: 'Mentions légales de thomas-marilleau.com, Web & 3D Designer freelance basé à Bordeaux.',
    },
    notFound: { title: 'Page introuvable', description: "Cette page n'existe pas." },
  },
} as const;
