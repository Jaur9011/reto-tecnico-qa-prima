function fn() {
  var env = karate.env || 'publico'; //Si no viene ningun ambiente, usa 'publico' por defecto

  // Un objeto con la URL de cada ambiente (prod, qa, dev, local, etc.)
  var urls = {
    publico: 'https://serverest.dev',
    local: 'http://localhost:3000'
  };
  if (!urls[env]) {
    throw 'Ambiente no soportado: ' + env + '. Usa: ' + Object.keys(urls).join(', ');
  }

  // Variables y utilidades disponibles en todos los features
  var config = {
    env: env,
    baseUrl: karate.properties['baseUrl'] || urls[env], // -DbaseUrl=... tiene prioridad
    schemas: 'classpath:serverest/common/schemas/',
    generarUsuario: read('classpath:serverest/common/helpers/generar-usuario.js'),
    generarEmail: read('classpath:serverest/common/helpers/generar-email.js'),
    generarIdInexistente: read('classpath:serverest/common/helpers/generar-id.js')
  };

  // Log para saber contra qué ambiente se ejecuta
  karate.log('Ambiente:', env, '| baseUrl:', config.baseUrl);

  // Timeouts(en milisegundos) y headers comunes
  karate.configure('connectTimeout', 15000);
  karate.configure('readTimeout', 15000);
  karate.configure('headers', { 'Content-Type': 'application/json', Accept: 'application/json' });

  // Limpieza automática: los ids guardados en "idsParaLimpiar" se eliminan al terminar
  // cada escenario, incluso si el escenario falló a mitad de camino.
  karate.configure('afterScenario', function () {
    var ids = karate.get('idsParaLimpiar') || [];
    for (var i = 0; i < ids.length; i++) {
      karate.call('classpath:serverest/common/helpers/limpiar-usuario.feature', { id: ids[i] });
    }
  });

  return config;
}
