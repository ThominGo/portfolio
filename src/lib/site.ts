export const SITE = {
  url: 'https://thomas-marilleau.com',
  name: 'Thomas Marilleau',
  email: 'thomas.marilleau@gmail.com',
  city: 'Bordeaux',
  country: 'FR',
  github: 'https://github.com/ThominGo',
  employer: { name: 'Studio 9P', url: 'https://studio9p.com' },
  cvUrl: '/media/CV_Thomas_Marilleau.pdf',
  ogImage: '/media/opengraph-thomas.jpg',
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
} as const;
