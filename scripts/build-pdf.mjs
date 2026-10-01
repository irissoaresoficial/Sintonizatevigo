// Genera public/encuesta-sintonizate-vigo.pdf a partir de /encuesta.
// Uso: npm run build && npm run pdf   (luego haz commit del PDF)
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4329;
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: 'ignore', env: { ...process.env, BASE_PATH: '/' } });

try {
  const url = `http://localhost:${PORT}/encuesta/`;
  for (let i = 0; ; i++) {
    try { if ((await fetch(url)).ok) break; } catch {}
    if (i > 60) throw new Error('El servidor de vista previa no arrancó. ¿Has ejecutado npm run build?');
    await new Promise((r) => setTimeout(r, 500));
  }
  const exe = existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = 'public/encuesta-sintonizate-vigo.pdf';
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
  await browser.close();
  console.log('PDF generado:', out);
} finally {
  server.kill();
  spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' });
}
