export const SITE = {
  url: 'https://www.thomas-marilleau.com',
  name: 'Thomas Marilleau',
  email: 'thomas.marilleau@gmail.com',
  city: 'Bordeaux',
  country: 'FR',
  github: 'https://github.com/ThominGo',
  employer: { name: 'Studio 9P', url: 'https://studio9p.com' },
  cvUrl: '/media/CV_Thomas_Marilleau.pdf',
  cvRemote:
    'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/6a106b5f5db729c22819f353_CV_Thomas_Marilleau.pdf',
  ogImage: '/media/opengraph-thomas.jpg',
  ogImageRemote:
    'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/6aab973288c168d42d7849e5_opengraph-thomas.jpg',
  aboutImage: {
    file: '69c818f16684ab14fa3dc108_mpi-2.png',
    url: 'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/69c818f16684ab14fa3dc108_mpi-2.png',
  },
  notFoundImage: {
    file: '69c818a28babb77c4266da8e_mpi-1.png',
    url: 'https://cdn.prod.website-files.com/65f09a13418ba26057ac98e7/69c818a28babb77c4266da8e_mpi-1.png',
  },
  // Identifiants optionnels (vides = scripts non chargés)
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? '',
  simpleAnalytics: (import.meta.env.PUBLIC_SIMPLE_ANALYTICS ?? 'true') !== 'false',
} as const;
