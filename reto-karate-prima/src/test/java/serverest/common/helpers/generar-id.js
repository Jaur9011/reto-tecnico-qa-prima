/**
 * Genera un id alfanumérico de 16 caracteres que no existe en el sistema.
 * Se usa en escenarios negativos de "usuario no encontrado".
 */
function fn() {
  return java.util.UUID.randomUUID().toString().replace(/-/g, '').substring(0, 16);
}
