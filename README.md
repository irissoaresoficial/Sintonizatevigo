# Sintonízate Vigo

La web del evento: landing con inscripción, las dos presentaciones animadas, la encuesta en PDF y la marca.

| Ruta | Qué es |
|---|---|
| `/` | Landing del Día 1 con el formulario de inscripción (va a Google Sheets) |
| `/presentaciones/` | Índice de presentaciones y material descargable |
| `/presentaciones/dia-1/` | Día 1 · Despertar, 27 diapositivas animadas |
| `/presentaciones/dia-2/` | Día 2 · Posibilidad, 10 diapositivas animadas |
| `/encuesta/` | Encuesta de diagnóstico, una hoja A4 |
| `/encuesta-sintonizate-vigo.pdf` | La encuesta en PDF, lista para imprimir |
| `/marca/` | Logos (PNG y SVG) y la animación del logo en AVI sin fondo |

Las presentaciones, la encuesta y el material llevan `noindex`, así que Google no las muestra. Tampoco hay enlaces a ellas desde la landing.

## Presentar

Abre la presentación y usa estas teclas:

- **F**: pantalla completa.
- **← →** o **espacio**: avanzar y retroceder.
- **N**: notas de la ponente.
- **R**: volver al inicio.

**Sin internet:** `public/descargas/` tiene cada presentación en un solo archivo HTML que se abre con doble clic. Sirve como copia de seguridad para el día del evento. Para regenerarlos: `BASE_PATH=/ npm run build && npm run standalone`.

En el móvil se avanza tocando la mitad derecha o izquierda de la pantalla. Para sacar un PDF de las diapositivas, usa *Imprimir → Guardar como PDF*: cada diapositiva sale en su propia página.

## Qué tienes que cambiar tú

Todo está en [`src/site.ts`](src/site.ts):

- **Fecha, hora y lugar:** ahora ponen «Por anunciar».
- **Fotos de las ponentes:** copia cada imagen (cuadrada, de al menos 900×900) a `public/img/` y escribe su nombre de archivo en `foto`.
- **`SHEETS_ENDPOINT`:** la URL del formulario. Sigue [`apps-script/LEEME.md`](apps-script/LEEME.md). Mientras esté vacía, el formulario avisa de que las inscripciones aún no están activas.

Las fotos de los testimonios del Día 2 son huecos marcados en `design/Sintonizate Vigo - Presentacion Dia 2 v4.dc.html`. Busca `image-slot`.

## Publicación

Cada `push` a `main` publica la web en GitHub Pages con [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Solo hay que activarlo una vez: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run decks      # vuelve a extraer las diapositivas de design/*.dc.html
npm run build && npm run pdf   # regenera la encuesta en PDF (requiere Playwright y Chromium)
```

- Hecha con Astro, sin frameworks de cliente. Las fuentes (Inter con eje óptico y DM Sans) están alojadas en la propia web: no hay llamadas a Google Fonts.
- Las diapositivas salen tal cual de los prototipos de Claude Design (`design/`). `scripts/extract-decks.mjs` las separa de ese entorno, y `public/js/deck-stage.js` y `public/js/deck-anim.js` se encargan de la navegación, las animaciones y las partículas.
- `design/` guarda los archivos originales del diseño y la conversación (`chat-diseno.md`) como referencia.
