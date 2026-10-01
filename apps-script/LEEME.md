# Conectar el formulario a Google Sheets (5 minutos)

1. Crea una hoja nueva en [sheets.new](https://sheets.new) y ponle de nombre «Sintonízate Vigo · Inscripciones».
2. En la hoja, ve a **Extensiones → Apps Script**.
3. Borra lo que haya, pega el contenido de [`Code.gs`](./Code.gs) y guarda (icono del disquete).
4. Pulsa **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
5. Pulsa **Implementar** y autoriza los permisos con tu cuenta de Google. Si aparece «Google no ha verificado esta aplicación», entra en *Configuración avanzada → Ir a (nombre del proyecto)*: es tu propio script.
6. Copia la **URL de la aplicación web**, que termina en `/exec`.
7. Pégala en [`src/site.ts`](../src/site.ts), en `SHEETS_ENDPOINT = '…'`, y haz commit. La web se vuelve a publicar sola.

Cada inscripción aparece como una fila nueva en la pestaña **Inscripciones**, con la fecha, el nombre, el teléfono, el email y el área elegida.

> Si más adelante cambias el código del script, usa **Implementar → Gestionar implementaciones → Editar → Nueva versión**. Así la URL no cambia.
