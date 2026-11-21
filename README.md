# Portfolio de Thomas Marilleau

Site statique **Astro** (EN par défaut, FR sous `/fr`), contenu géré dans **Directus** (local, Docker), hébergé sur **Cloudflare Pages**.

## Démarrage rapide

```bash
npm install
npm run assets        # télécharge images, vidéos, polices, CV depuis l'ancien site Webflow (une seule fois)
npm run dev           # http://localhost:4321
```

Le contenu de départ (`src/data/content.json`) vient de l'export Webflow. Sans `npm run assets`, le site fonctionne quand même en pointant vers les médias du CDN Webflow (pratique pour tester, à ne pas laisser en production).

## Directus (CMS)

```bash
cp .env.example .env            # change les mots de passe / secret
docker compose up -d            # http://localhost:8055/admin
npm run directus:setup          # crée les collections et importe tout le contenu + médias
npm run sync                    # Directus -> src/data/content.json + médias locaux
npm run build
```

Au quotidien : tu modifies dans Directus, puis `npm run publish:site` (sync + build), puis tu publies `dist` (voir ci-dessous).
Le champ `status` permet de masquer un projet (Brouillon). Les champs `*_fr` contiennent les traductions : tant qu'une page projet FR n'est pas entièrement traduite, elle est en `noindex` avec canonical vers la version EN et absente du sitemap.

> `directus:setup` n'a pas pu être testé dans l'environnement de développement (pas de Docker). Si une étape échoue, le script est relançable : il saute ce qui existe déjà.

## Déploiement Cloudflare Pages

1. Cloudflare > Workers & Pages > Create > Pages > connecter le dépôt GitHub `ThominGo/portfolio`.
2. Build command : `npm run build` ; output : `dist` ; variable `NODE_VERSION=22`.
   (Le dossier `src/assets/media` et `public/media` doivent être commités, ou utilise l'upload direct : `npx wrangler pages deploy dist`.)
3. Domaines personnalisés : `www.thomas-marilleau.com`, puis redirection de l'apex vers `www`.
4. Chez OVH, soit tu remplaces les serveurs DNS par ceux de Cloudflare (le registrar reste OVH), soit tu ajoutes un CNAME `www` vers `<projet>.pages.dev`.

Limite : 25 Mo par fichier. Les grosses vidéos peuvent aller sur Cloudflare R2 : mets l'URL publique dans `PUBLIC_VIDEO_BASE` (les fichiers doivent porter les mêmes noms que dans `public/media/videos`).

## SEO et IA

- Balises title/description, canonical, hreflang EN/FR, Open Graph, Twitter Cards
- JSON-LD : Person, WebSite, CollectionPage, ProfilePage, CreativeWork, BreadcrumbList
- `sitemap-index.xml`, `robots.txt` (crawlers d'IA autorisés), `llms.txt` et `llms-full.txt` (version texte complète des projets)
- Redirections 301 `/projets/*` vers `/work/*` (`public/_redirects`)
- Analytics : Simple Analytics sans cookie par défaut ; GTM optionnel via `PUBLIC_GTM_ID`

## À vérifier

- Polices : « Peridia Display » et « Gilroy » sont chargées depuis l'ancien site ; vérifie que leur licence couvre l'usage web hors Webflow.
- Mentions légales : hébergeur remplacé par Cloudflare, vérifie l'adresse.
- Traductions FR des textes de projets à compléter dans Directus.
