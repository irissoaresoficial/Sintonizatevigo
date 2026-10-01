/**
 * Sintonízate Vigo · Recepción de inscripciones de la landing en Google Sheets.
 * Pega este código en Extensiones → Apps Script de tu hoja (ver LEEME.md).
 */
const SHEET_NAME = 'Inscripciones';
const HEADERS = ['Fecha', 'Nombre', 'Teléfono', 'Email', 'Área a transformar', 'Origen'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    const nombre = clean(p.nombre, 120);
    const telefono = clean(p.telefono, 40);
    const email = clean(p.email, 160);
    if (!nombre || telefono.replace(/\D/g, '').length < 9 || !/^\S+@\S+\.\S+$/.test(email)) {
      return json({ ok: false, error: 'Datos incompletos' });
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    sheet.appendRow([new Date(), nombre, telefono, email, clean(p.area, 60), clean(p.origen, 300)]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Evita que una celda empiece por = + - @ (inyección de fórmulas).
function clean(v, max) {
  const s = String(v || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
