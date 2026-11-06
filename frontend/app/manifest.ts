import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rabbit Farm — Gestion d’élevage cunicole',
    short_name: 'Rabbit Farm',
    description: 'Reproduction, portées, engraissement, santé, ventes et statistiques de votre élevage de lapins.',
    lang: 'fr',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f8fafc',
    theme_color: '#059669',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Nouvelle saillie', url: '/breeding?new=1' },
      { name: 'Tâches du jour', url: '/tasks' },
      { name: 'Nouvelle vente', url: '/sales?new=1' },
    ],
  };
}
