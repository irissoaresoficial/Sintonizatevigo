// Ediciones de contenido sobre las diapositivas extraídas de Claude Design.
// Petición de la clienta: quitar todas las frases pequeñas (subtítulos y descripciones)
// y dejar solo titulares. Cada frase quitada pasa a las notas de la ponente si no estaba
// ya, para que el guion no se pierda.
//
// Tipos de edición (se buscan por TEXTO exacto, no por estilo):
//   { text }                → quita el elemento más profundo cuyo texto es `text`
//   { text, up: 1 }         → quita el padre de ese elemento (p. ej. una fila con número)
//   { text, keepFirst }     → deja solo el primer hijo (p. ej. «Cuerpo.» sin su descripción)
//   { html, replace }       → sustituye un fragmento HTML literal (titulares nuevos)
import { parse } from 'node-html-parser';

export const EDITS = {
  'dia-1': {
    '02 Entrada': [{ text: 'Hoy no has venido a escuchar otra charla. Has venido a cuestionarte.' }],
    '03 60 meses': [
      { text: '¿Qué pasaría si dentro de cinco años siguieras exactamente igual?' },
      {
        html: 'font-size:162px;">60 meses más<br>de <span style="color:#FF3B30">lo mismo.</span>',
        replace: 'font-size:118px;">¿Cuántas veces<br>más vas a hacer<br><span style="color:#FF3B30">lo mismo?</span>',
      },
    ],
    '05 Ejercicio 1-10': [
      { text: 'Marca tu nota en cada eje.', up: 1 },
      { text: 'Une los cuatro puntos.', up: 1 },
      { text: '¿Tu rueda gira… o se atasca?', up: 1 },
    ],
    '07 Paso 1 · Rueda': [{ text: 'Cuerpo, emociones y dinero. Si uno falla, todo se frena.' }],
    '08 Tres dimensiones': [
      { text: 'Cuerpo. Sin energía física, todo cuesta más.' },
      { text: 'Emociones. Tus decisiones, tus hábitos y tus relaciones influyen en cómo actúas.' },
      { text: 'Dinero. No resuelve todos los problemas, pero la falta de recursos puede limitar tus opciones, tu tiempo y tus decisiones.' },
    ],
    '09 Decir que no': [{ text: '¿Qué quieres poder decidir sin que el dinero sea siempre el límite?' }],
    '10 Paso 2 · Cuerpo': [{ text: '¿De qué sirve ganar más si no tienes energía para disfrutarlo?' }],
    '12 Saber no es hacer': [{ text: 'Saber nunca fue el problema. ¿Qué pequeña acción vas a comenzar esta semana?' }],
    '13 Paso 3 · Miedo': [{ text: '¿Cuántas decisiones tomas desde el deseo y cuántas desde el miedo?' }],
    '15 Quién te lo enseñó': [{ text: 'Una creencia no es un hecho. Es una interpretación que aprendiste.' }],
    '16 Paso 4 · 160 horas': [{ text: '¿Cuántas horas de tu vida necesitas para producir tus ingresos?' }],
    '17 Ingreso no es libertad': [
      { text: 'Puedes ganar mucho dinero y tener muy poco tiempo.' },
      { text: '¿Cuánto de tu vida tienes que entregar para mantener tu nivel de ingresos?' },
    ],
    '19 Paso 5 · 2029': [{ text: 'Tienes energía. Has trabajado tus emociones. Tus ingresos han crecido. Tienes tiempo.' }],
    '21 Tu yo de 2029': [{ text: '¿Qué tuvo que cambiar para llegar allí?' }],
    '22 Tres caminos': [
      { text: 'Seguir haciendo exactamente lo mismo.' },
      { text: 'Aprender, aplicar y construir progresivamente.' },
      { text: 'Conocer personas, productos, modelos de negocio y sistemas diferentes a los que hasta ahora conocías.' },
    ],
    '23 Decides tú': [{ text: 'Solo quiero que conozcas posibilidades que quizá todavía no conoces.' }],
    '24 Mañana': [{ text: 'Mañana: libertad financiera, con toda la información sobre la mesa. Apúntate al finalizar.' }],
    '25 Cierre': [{ text: 'La prosperidad empieza cuando dejas de aceptar una vida que ya sabes que quieres cambiar.' }],
  },
  'dia-2': {
    '02 Volviste': [{ text: 'Volver ya es una decisión. La mayoría no vuelve.' }],
    '03 El recorrido': [
      { text: '¿Y si tu vida pudiera ser diferente?' },
      { text: 'Construye tu nueva realidad.' },
      { text: 'Producto, modelo de negocio, inversión y costes. Con total transparencia.' },
    ],
    '11 Formas de ingresos': [
      { text: 'Tu tiempo a cambio de un salario.' },
      { text: 'Tu propio trabajo, sin jefe pero sin descanso.' },
      { text: 'Un sistema y un equipo que trabajan contigo.' },
      { text: 'Tu dinero trabajando, con su riesgo.' },
      { text: 'Productos y redes de personas.' },
    ],
    // Se mantiene a propósito el aviso del Día 3 («No se garantizan resultados económicos…»):
    // es una advertencia necesaria, no decoración.
  },
};

const norm = (s) => s.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export function applyEdits(deck, html) {
  const edits = EDITS[deck] || {};
  const root = parse(html, { comment: true });
  const sections = root.querySelectorAll('section');
  for (const [label, list] of Object.entries(edits)) {
    const sec = sections.find((s) => s.getAttribute('data-label') === label);
    if (!sec) throw new Error(`[${deck}] No existe la diapositiva «${label}»`);
    const removed = [];
    for (const e of list) {
      if (e.html) {
        const before = sec.innerHTML;
        if (!before.includes(e.html)) throw new Error(`[${deck}] «${label}»: no encuentro el HTML a sustituir`);
        sec.set_content(before.replace(e.html, e.replace));
        continue;
      }
      // Elemento más profundo cuyo texto coincide exactamente.
      const matches = sec.querySelectorAll('*').filter((el) => norm(el.text) === norm(e.text));
      const el = matches.find((m) => !m.querySelectorAll('*').some((c) => norm(c.text) === norm(e.text)));
      if (!el) throw new Error(`[${deck}] «${label}»: no encuentro «${e.text}»`);
      if (e.keepFirst) {
        const first = el.childNodes.find((n) => n.nodeType === 1);
        el.set_content(first.toString());
      } else {
        let target = el;
        for (let i = 0; i < (e.up || 0); i++) target = target.parentNode;
        target.remove();
      }
      removed.push(norm(e.text));
    }
    // El texto quitado pasa a las notas de la ponente (si no estaba ya).
    const notes = sec.getAttribute('data-speaker-notes') || '';
    const missing = removed.filter((t) => !norm(notes).includes(t));
    if (missing.length) sec.setAttribute('data-speaker-notes', `${notes} · En pantalla antes: «${missing.join('» «')}»`.trim());
  }
  return root.toString();
}
