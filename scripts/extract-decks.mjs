// Extrae las diapositivas de los prototipos de Claude Design (design/*.dc.html)
// a fragmentos HTML independientes del runtime (src/decks/*.html).
// Uso: npm run decks  — vuelve a ejecutarlo si cambias los .dc.html de design/.
import { readFileSync, writeFileSync } from 'node:fs';

const decks = [
  ['design/Sintonizate Vigo - Presentacion Dia 1 v4.dc.html', 'src/decks/dia-1.html'],
  ['design/Sintonizate Vigo - Presentacion Dia 2 v4.dc.html', 'src/decks/dia-2.html'],
];

for (const [src, out] of decks) {
  const raw = readFileSync(src, 'utf8');
  const m = raw.match(/<x-import[^>]*>([\s\S]*?)<\/x-import>/);
  if (!m) throw new Error(`No encuentro <x-import> en ${src}`);
  let html = m[1].trim();

  // Inter con eje óptico (opsz) autoalojada se registra como 'Inter Variable'.
  html = html
    .replace(/font-family:\s*Inter\b/g, "font-family:'Inter Variable'")
    .replace(/font-family="Inter"/g, `font-family="'Inter Variable', Inter, sans-serif"`);

  // <image-slot> era un hueco editable del prototipo: lo sustituimos por un
  // marcador estático. Cambia el src por la foto real cuando la tengas.
  html = html.replace(
    /<image-slot id="([^"]+)"[^>]*placeholder="([^"]*)"[^>]*><\/image-slot>/g,
    (_, id, ph) =>
      `<div data-slot="${id}" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:400;color:#AEAEB2;background:repeating-linear-gradient(135deg,rgba(0,0,0,.025) 0 2px,transparent 2px 14px)">${ph}</div>`,
  );

  if (/<image-slot|<sc-|\{\{/.test(html)) throw new Error(`Quedan restos del runtime en ${src}`);
  const n = (html.match(/<section/g) || []).length;
  writeFileSync(out, html + '\n');
  console.log(`${out}: ${n} diapositivas`);
}
