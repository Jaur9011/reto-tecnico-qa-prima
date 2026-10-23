/**
 * Genera un email único para evitar colisiones con datos existentes.
 * prefijo (opcional): ej. generarEmail('no.existe') -> "no.existe.1729612345678.a1b2c3d4@example.com"
 * Dominio example.com: reservado para pruebas (RFC 2606), nunca recibe correos reales.
 */
function fn(prefijo) {
  var unico = java.lang.System.currentTimeMillis() + '.' + java.util.UUID.randomUUID().toString().substring(0, 8);
  return (prefijo || 'qa.karate') + '.' + unico + '@example.com';
}
