# Informe de estrategia de automatización

## 1. Enfoque

La suite valida la API de Usuarios de ServeRest a nivel de **contrato** (estructura de la respuesta) y de **comportamiento** (códigos de estado, mensajes y efecto real sobre los datos). Se trabajó en tres fases:

1. **Exploración:** lectura del Swagger oficial (`https://serverest.dev/swagger.json`) y llamadas reales para confirmar cuerpos, códigos y mensajes, incluidos los de error.
2. **Diseño de casos:** por cada criterio de aceptación, el camino feliz más las particiones inválidas de cada campo (vacío, tipo incorrecto, formato inválido, ausente, campo no definido) y las reglas de negocio (email único, usuario con carrito).
3. **Automatización** con Karate DSL, ejecución en paralelo y CI en GitHub Actions.

## 2. Fuente de verdad del contrato

Los esquemas se ciñen **estrictamente al Swagger**. Por ejemplo, `_id` se valida como `#string` porque el Swagger no especifica longitud, y `administrador` como `#regex (true|false)` porque el Swagger lo define con `enum: ["true", "false"]`. La única regla agregada es `quantidade >= 0`, una invariante lógica (una cantidad no puede ser negativa).

Los comportamientos que la API aplica pero el Swagger no documenta (por ejemplo, la longitud de 16 caracteres del id) se cubren con **escenarios negativos** y se registran como hallazgos, en lugar de incorporarse al esquema.

## 3. Cobertura

| Endpoint | Positivos | Negativos |
|---|---|---|
| `GET /usuarios` | Lista completa; filtro por email; filtro por `administrador` true/false | Email inexistente → lista vacía; `administrador` fuera del enum |
| `POST /usuarios` | 4 usuarios válidos desde CSV, con verificación por GET | Email duplicado; body vacío; cada campo obligatorio ausente; 9 valores inválidos; campo no definido |
| `GET /usuarios/{_id}` | Búsqueda de usuario existente | ID inexistente; ID corto, largo y con caracteres especiales |
| `PUT /usuarios/{_id}` | Actualización completa con verificación; solo nombre con el mismo email; ID inexistente → 201 | Email de otro usuario; 9 valores inválidos; body vacío |
| `DELETE /usuarios/{_id}` | Eliminación con verificación de que ya no existe | ID inexistente; usuario con carrito (regla de negocio) |

Total: **48 escenarios**, 13 positivos y 35 negativos.

## 4. Patrones y buenas prácticas

**Un feature por endpoint, en lenguaje de negocio.** Cada archivo abre con la historia de usuario y los escenarios se nombran por el comportamiento esperado.

**Tests independientes y paralelizables.** Ningún escenario depende de datos preexistentes ni del orden de ejecución: cada uno crea lo que necesita con helpers reutilizables (`crear-usuario.feature`, `crear-carrito.feature`). La suite corre en 4 hilos.

**Datos de prueba en tres capas.**
- *CSV* (`usuarios-validos.csv`): casos válidos de registro, editables sin programar.
- *JSON* (`campos-invalidos.json`): valores inválidos, compartidos por POST y PUT. Se usa JSON porque los casos necesitan tipos (número, booleano) que CSV no puede representar.
- *Generadores JS* (`generarUsuario`, `generarEmail`, `generarIdInexistente`): lo que debe ser único en cada ejecución. El patrón de *overrides* permite que cada escenario fije solo el dato relevante.

**Limpieza automática (teardown).** Los escenarios registran los IDs creados en `idsParaLimpiar` y un hook `afterScenario` global los elimina al terminar, incluso si el escenario falló.

**Validación de esquemas con fuzzy matching de Karate.** Los contratos viven en `common/schemas/*.json` (`#string`, `#regex`, `#[] usuarioSchema`) y se reutilizan entre features. Además del tipo, se comparan los valores exactos cuando el escenario los conoce: `match response == karate.merge(usuario, { _id: idCreado })`.

**Verificación del efecto, no solo del status.** Después de POST, PUT y DELETE se consulta el recurso para confirmar que el cambio ocurrió.

**Configuración por ambiente.** `karate-config.js` resuelve la URL según `karate.env` (`publico` o `local`), falla con un mensaje claro ante un ambiente desconocido y admite `-DbaseUrl`.

**Tags para ejecución selectiva:** `@smoke`, `@positivo`, `@negativo` y un tag por endpoint.

## 5. Integración continua

GitHub Actions ejecuta la suite en cada push y pull request, como regresión programada de lunes a viernes y bajo demanda. Por defecto levanta ServeRest dentro del runner para obtener resultados deterministas; el ambiente público queda como opción manual. Publica un resumen con los totales y el reporte HTML como artefacto.

## 6. Hallazgos

- La regla de 16 caracteres alfanuméricos del id no está documentada en el Swagger, y solo `GET /usuarios/{_id}` la aplica (`PUT` y `DELETE` no).
- Recurso no encontrado responde 400 (no 404), y `DELETE` de un ID inexistente responde 200.
- La contraseña se devuelve en texto plano en `GET /usuarios` y `GET /usuarios/{_id}`.

## 7. Posibles mejoras

- Validación con JSON Schema estándar generado desde el Swagger, si el contrato se comparte con otros equipos.
- Pruebas de rendimiento reutilizando los mismos features con Karate Gatling.
- Extender la suite a `login`, `produtos` y `carrinhos`.
