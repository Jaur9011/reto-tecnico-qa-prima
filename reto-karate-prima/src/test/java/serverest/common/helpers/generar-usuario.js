/**
 * Genera un usuario válido con datos aleatorios y email único.
 * overrides: campos a fijar, ej. { administrador: 'false' }
 */
function fn(overrides) {
  var usuario = {
    nome: 'Usuario QA',
    email: generarEmail(), // reutiliza generar-email.js: el dominio se define en un solo lugar
    password: 'Pwd' + java.util.UUID.randomUUID().toString().substring(0, 8),
    administrador: Math.random() < 0.5 ? 'true' : 'false'
  };

  return karate.merge(usuario, overrides || {});
}
