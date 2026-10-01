import { defineConfig } from 'astro/config';

// En GitHub Pages la web cuelga de /<repo>/; el workflow pasa BASE_PATH.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  // Direcciones cortas para compartir.
  redirects: {
    '/dia-1': '/presentaciones/dia-1/',
    '/dia-2': '/presentaciones/dia-2/',
    '/presentacion': '/presentaciones/',
  },
});
