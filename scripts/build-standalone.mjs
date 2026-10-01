// Empaqueta cada presentación en UN archivo HTML autónomo (scripts y fuentes
// dentro) que se abre con doble clic, sin servidor ni conexión.
// Uso: BASE_PATH=/ npm run build && npm run standalone   (luego haz commit)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const decks = ['dia-1', 'dia-2'];
const read = (p) => readFileSync('dist' + p, 'utf8');
mkdirSync('public/descargas', { recursive: true });

function inlineCss(href) {
  let css = read(href);
  // Solo el subconjunto latino (cubre español) y solo woff2: el archivo pesa menos.
  css = css.replace(/@font-face\s*{[^}]*}/g, (block) => {
    if (!/-latin-(?:ext-)?(?:opsz|\d)/.test(block)) return '';
    return block
      .replace(/,\s*url\([^)]+\.woff\)\s*format\(["']woff["']\)/g, '')
      .replace(/url\((\/_astro\/[^)]+\.woff2)\)/g, (_, f) => `url(data:font/woff2;base64,${readFileSync('dist' + f).toString('base64')})`);
  });
  if (/url\(\/_astro\//.test(css)) throw new Error('Quedan recursos sin incrustar en ' + href);
  return `<style>${css}</style>`;
}

for (const d of decks) {
  let html = read(`/presentaciones/${d}/index.html`);
  if (html.includes('/Sintonizatevigo/')) throw new Error('Compila con BASE_PATH=/ antes de empaquetar.');
  html = html
    .replace(/<link rel="(?:icon|apple-touch-icon)"[^>]*>/g, '')
    .replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => inlineCss(href))
    .replace(/<script src="(\/js\/[^"]+)"><\/script>/g, (_, src) => `<script>${read(src).replace(/<\/script/gi, '<\\/script')}</script>`)
    // Fuera de la web no hay índice al que volver.
    .replace(/<a href="\/presentaciones\/"[^>]*>[^<]*<\/a>/, '');
  if (/(?:src|href)="\/(?!\/)/.test(html)) throw new Error(`Quedan rutas absolutas en ${d}`);
  const out = `public/descargas/sintonizate-vigo-presentacion-${d}.html`;
  writeFileSync(out, html);
  console.log(`${out}: ${(html.length / 1024).toFixed(0)} KB`);
}
