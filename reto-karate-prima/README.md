# ServeRest · Pruebas automatizadas de la API de Usuarios con Karate DSL

![Karate](https://img.shields.io/badge/Karate-1.5.2-blue) ![Java](https://img.shields.io/badge/Java-17%2B-orange) ![Maven](https://img.shields.io/badge/Maven-3.9-red)

Suite de pruebas automatizadas para el CRUD de usuarios de [ServeRest](https://serverest.dev/): validación de esquemas JSON según el Swagger oficial, casos positivos y negativos, datos de prueba desde CSV/JSON con generación de emails únicos, limpieza automática y ejecución continua en GitHub Actions.

> Informe de estrategia y patrones: [docs/ESTRATEGIA.md](docs/ESTRATEGIA.md)

## Historia de usuario

**Como** administrador del sistema, **quiero** gestionar los usuarios a través de la API, **para** administrar la base de datos de usuarios.

| # | Criterio de aceptación | Endpoint | Feature |
|---|---|---|---|
| 1 | Obtener la lista de usuarios | `GET /usuarios` | [listar-usuarios.feature](src/test/java/serverest/usuarios/listar-usuarios.feature) |
| 2 | Registrar un usuario con datos válidos | `POST /usuarios` | [registrar-usuario.feature](src/test/java/serverest/usuarios/registrar-usuario.feature) |
| 3 | Buscar un usuario por su ID | `GET /usuarios/{_id}` | [buscar-usuario-por-id.feature](src/test/java/serverest/usuarios/buscar-usuario-por-id.feature) |
| 4 | Actualizar un usuario existente | `PUT /usuarios/{_id}` | [actualizar-usuario.feature](src/test/java/serverest/usuarios/actualizar-usuario.feature) |
| 5 | Eliminar un usuario | `DELETE /usuarios/{_id}` | [eliminar-usuario.feature](src/test/java/serverest/usuarios/eliminar-usuario.feature) |

**Cobertura:** 48 escenarios (13 positivos, 35 negativos).

## Requisitos previos

| Herramienta | Versión | Verificar con |
|---|---|---|
| Java JDK | 17 o superior | `java -version` |
| Maven | 3.8 o superior | `mvn -v` |
| Node.js *(solo para ejecutar ServeRest localmente)* | 18 o superior | `node -v` |

## Instalación

```bash
git clone https://github.com/Jaur9011/reto-tecnico-qa-prima.git
cd reto-tecnico-qa-prima/reto-karate-prima
mvn -q test-compile   # descarga dependencias y compila
```

## Ejecución

### Contra la API pública (por defecto)

```bash
mvn test
```

### Contra ServeRest local (recomendado: rápido y sin datos de terceros)

```bash
# Terminal 1: levantar ServeRest en http://localhost:3000
npx serverest@latest

# Terminal 2: ejecutar la suite
mvn test -Dkarate.env=local
```

### Opciones

| Necesito… | Comando |
|---|---|
| Solo pruebas de humo | `mvn test -Dkarate.options="--tags @smoke"` |
| Solo casos negativos | `mvn test -Dkarate.options="--tags @negativo"` |
| Solo un endpoint | `mvn test -Dkarate.options="--tags @registrar"` |
| Excluir un tag | `mvn test -Dkarate.options="--tags ~@negativo"` |
| Otra URL base | `mvn test -DbaseUrl=http://mi-servidor:3000` |
| Cambiar hilos en paralelo | `mvn test -Dthreads=8` |

> En PowerShell, encierra cada `-D...` entre comillas: `mvn test "-Dkarate.env=local"`.

### Tags disponibles

| Tag | Significado |
|---|---|
| `@usuarios` | Todos los escenarios de la API de usuarios |
| `@listar` `@registrar` `@buscar` `@actualizar` `@eliminar` | Un endpoint concreto |
| `@smoke` | Camino feliz de cada endpoint |
| `@positivo` / `@negativo` | Tipo de caso |

## Datos de prueba

| Archivo | Uso |
|---|---|
| [usuarios-validos.csv](src/test/java/serverest/usuarios/data/usuarios-validos.csv) | Usuarios válidos para el registro. Agregar un caso = agregar una fila. El email no está en el CSV: se genera único en cada ejecución. |
| [campos-invalidos.json](src/test/java/serverest/usuarios/data/campos-invalidos.json) | Valores inválidos por campo, para POST y PUT. Es JSON porque incluye valores de tipo número y booleano, que CSV no puede representar. |
| [generar-usuario.js](src/test/java/serverest/common/helpers/generar-usuario.js) | Usuario válido aleatorio con email único y *overrides* opcionales. |

Cada escenario elimina al terminar los usuarios que creó (hook `afterScenario` en `karate-config.js`), incluso si falla.

## Reportes

Al terminar, abre `target/karate-reports/karate-summary.html` en el navegador: detalle de cada request/response, tiempos y vista por tags. El log HTTP completo queda en `target/karate.log`.

## Estructura del proyecto

```
reto-karate-prima/
├── docs/ESTRATEGIA.md                       # Informe de estrategia y patrones
├── pom.xml                                  # Dependencias (Karate + JUnit 5)
└── src/test/java/
    ├── karate-config.js                     # Ambientes, timeouts, utilidades y limpieza global
    ├── logback-test.xml                     # Logs: consola INFO, archivo DEBUG
    └── serverest/
        ├── ServeRestTest.java               # Runner paralelo (JUnit 5)
        ├── common/
        │   ├── helpers/                     # Reutilizables (@ignore: no se ejecutan solos)
        │   │   ├── generar-usuario.js       # Usuario válido con overrides
        │   │   ├── generar-email.js         # Email único
        │   │   ├── generar-id.js            # ID inexistente
        │   │   ├── crear-usuario.feature    # Precondición: usuario creado por API
        │   │   ├── crear-carrito.feature    # Precondición: usuario con carrito
        │   │   └── limpiar-usuario.feature  # Limpieza (la invoca el hook afterScenario)
        │   └── schemas/                     # Contratos JSON según el Swagger
        └── usuarios/
            ├── data/                        # CSV y JSON de datos de prueba
            └── *.feature                    # Un feature por endpoint
```

## Integración continua

La suite se ejecuta en el job **API · Karate** del workflow de la raíz del repositorio, [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- en cada **push** y **pull request** a `main`;
- de **lunes a viernes a las 06:00** (hora Perú) como regresión programada;
- **manualmente** desde *Actions → CI - Automatización QA → Run workflow*, eligiendo el ambiente (`local` o `publico`).

En CI se levanta ServeRest dentro del runner para que los resultados no dependan de la disponibilidad ni de los datos del servidor público. Cada ejecución publica un resumen en la página del workflow y el reporte HTML como artefacto `reporte-karate`.

## Observaciones sobre la API

1. El Swagger define `_id` solo como `string`, pero `GET /usuarios/{_id}` exige 16 caracteres alfanuméricos (`id deve ter exatamente 16 caracteres alfanuméricos`). El esquema se ciñe al Swagger y la regla se cubre con escenarios negativos que documentan la brecha.
2. `PUT /usuarios/{_id}` con un ID inexistente crea un usuario (201), tal como indica el Swagger.
3. Los errores de "no encontrado" responden **400** en vez de **404**, y `DELETE` sobre un ID inexistente responde **200**.
4. La contraseña se devuelve en texto plano en las consultas de usuarios.
