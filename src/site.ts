// ─────────────────────────────────────────────────────────────
//  CONTENIDO EDITABLE DE LA WEB
//  Cambia aquí fecha, hora, lugar, fotos y el enlace del formulario.
// ─────────────────────────────────────────────────────────────

export const evento = {
  fecha: 'Por anunciar',
  hora: 'Por anunciar',
  lugar: 'Vigo · por anunciar',
  duracion: '2 horas',
  /** Texto corto del pie de página. */
  pie: 'Vigo · Fecha por anunciar',
};

/**
 * Ponentes. Para poner la foto: copia la imagen a /public/img/
 * (cuadrada, mínimo 900×900) y escribe aquí su nombre, p. ej. 'raquel.jpg'.
 */
export const ponentes = [
  { nombre: 'Raquel Rodríguez', area: 'Ponente', foto: '' },
  { nombre: 'Iris Soares', area: 'Ponente · Escuela de Sabiduría 33', foto: '' },
];

/**
 * URL de la aplicación web de Google Apps Script que guarda las inscripciones
 * en Google Sheets. Instrucciones en apps-script/LEEME.md.
 * Mientras esté vacía, el formulario avisa de que aún no está activo.
 */
export const SHEETS_ENDPOINT = '';
