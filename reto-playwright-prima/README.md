# Sauce Demo · Pruebas E2E con Playwright + Cucumber (TypeScript)

![Playwright](https://img.shields.io/badge/Playwright-1.64-2EAD33) ![Cucumber](https://img.shields.io/badge/Cucumber-13-23D96C) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)

Suite de pruebas automatizadas de extremo a extremo para [Sauce Demo](https://www.saucedemo.com/): escenarios en Gherkin (español), **Page Object Model** con componentes reutilizables, ejecución en paralelo, capturas de pantalla en los fallos y CI en GitHub Actions.

> Informe de estrategia y patrones: [docs/ESTRATEGIA.md](docs/ESTRATEGIA.md)

## Historia de usuario

**Como** cliente de Sauce Demo, **quiero** iniciar sesión, agregar productos al carrito y completar una compra, **para** adquirir los productos que necesito.

| # | Criterio de aceptación | Feature | Escenarios |
|---|---|---|---|
| 1 | Iniciar sesión con credenciales válidas | [login.feature](features/login.feature) | `standard_user` accede a la página de productos |
| 2 | No iniciar sesión con credenciales inválidas | [login.feature](features/login.feature) | `locked_out_user`, contraseña incorrecta, usuario inexistente, campos vacíos, acceso directo sin sesión |
| 3 | Agregar un producto desde la página de productos | [carrito.feature](features/carrito.feature) | Contador y botón "Remove" |
| 4 | Ver los productos agregados en el carrito | [carrito.feature](features/carrito.feature) | Nombres y precios coinciden; eliminar producto; carrito vacío |
| 5 | Completar la compra hasta la confirmación | [compra.feature](features/compra.feature) | Flujo E2E con 3 clientes desde CSV, validando subtotal y total; datos de envío faltantes |

**Cobertura:** 17 escenarios (8 positivos, 9 negativos).

## Datos de prueba

| Archivo | Uso |
|---|---|
| [src/data/clientes.csv](src/data/clientes.csv) | Datos de envío de los clientes para la compra. Agregar un caso = agregar una fila y su `id` en los `Ejemplos` de `compra.feature`. |
| [src/data/usuarios.ts](src/data/usuarios.ts) | Usuarios de Sauce Demo (`standard_user`, `locked_out_user`). |
| Tablas `Ejemplos` en los `.feature` | Casos negativos con su mensaje de error esperado. |

## Requisitos previos

| Herramienta | Versión | Verificar con |
|---|---|---|
| Node.js | 20 o superior (recomendado 22) | `node -v` |
| npm | 10 o superior | `npm -v` |

## Instalación

```bash
git clone https://github.com/<tu-usuario>/<repositorio>.git
cd <repositorio>/reto-playwright-prima
npm ci                              # instala las versiones exactas de package-lock.json
npx playwright install chromium     # descarga el navegador
```

## Ejecución

| Necesito… | Comando |
|---|---|
| Toda la suite | `npm test` |
| Solo pruebas de humo | `npm run test:smoke` |
| Una funcionalidad | `npm run test:login` · `npm run test:carrito` · `npm run test:compra` |
| Cualquier combinación de tags | `npx cucumber-js --tags "@compra and not @negativo"` |
| Verificar tipos de TypeScript | `npm run typecheck` |
| Descubrir localizadores grabando acciones | `npm run codegen` |

### Ver el navegador mientras se ejecuta

Copia `.env.example` como `.env` (ya viene con `HEADLESS=false` y `SLOW_MO=300`) y ejecuta `npm test`.
O, solo para una ejecución en PowerShell:

```powershell
$env:HEADLESS="false"; $env:SLOW_MO="300"; $env:WORKERS="1"; npm test
```

### Variables de configuración

| Variable | Por defecto | Descripción |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | URL de la aplicación |
| `BROWSER` | `chromium` | `chromium`, `firefox` o `webkit` |
| `HEADLESS` | `true` | `false` para ver el navegador |
| `SLOW_MO` | `0` | Pausa en ms entre acciones (para demos) |
| `WORKERS` | `2` | Escenarios en paralelo |
| `RETRIES` | `0` | Reintentos de escenarios fallidos |
| `SAUCE_PASSWORD` | `secret_sauce` | Contraseña de los usuarios de prueba |

## Reportes

Después de cada ejecución, en `reports/`:

- `cucumber-report.html`: reporte visual. Los escenarios fallidos incluyen **captura de pantalla** y la URL donde fallaron.
- `cucumber-report.json` / `cucumber-report.xml`: formatos para CI y otras herramientas.

## Estructura del proyecto

```
reto-playwright-prima/
├── features/                          # QUÉ se prueba: Gherkin en español
│   ├── login.feature
│   ├── carrito.feature
│   └── compra.feature
├── src/
│   ├── config/env.ts                  # Configuración central (URL, navegador, timeouts)
│   ├── data/
│   │   ├── usuarios.ts                # Usuarios de prueba
│   │   ├── clientes.csv               # Datos de envío para la compra
│   │   └── clientes.ts                # Lee clientes.csv
│   ├── pages/                         # CÓMO se interactúa: Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductosPage.ts
│   │   ├── CarritoPage.ts
│   │   ├── CheckoutInformacionPage.ts
│   │   ├── CheckoutResumenPage.ts
│   │   ├── ConfirmacionPage.ts
│   │   └── components/                # Partes de página reutilizables
│   │       ├── HeaderComponent.ts
│   │       └── ListaProductosComponent.ts
│   ├── steps/                         # Traducción Gherkin → Page Objects
│   ├── support/
│   │   ├── world.ts                   # Estado aislado por escenario
│   │   └── hooks.ts                   # Ciclo de vida del navegador y evidencias
│   └── utils/                         # Lectura de CSV, precios y textos exactos
├── cucumber.js                        # Configuración de Cucumber
├── tsconfig.json
└── .env.example
```

## Cómo encontrar localizadores

Sauce Demo tiene un atributo `data-test` en sus elementos, configurado como *test id* de Playwright (`config.testIdAttribute`), por lo que se usa `page.getByTestId('login-button')`. Para descubrir nuevos localizadores:

1. **DevTools:** F12 → *Select element* (Ctrl + Shift + C) → clic en el elemento → buscar `data-test`.
2. **Playwright Codegen:** `npm run codegen` → realizar las acciones → copiar los localizadores generados.
3. **Pick locator** dentro de Codegen: señala un elemento y muestra el mejor localizador.

Orden de preferencia: `getByTestId` → `getByRole` → `getByText`/`getByPlaceholder` → CSS/XPath (último recurso).

## Integración continua

La suite se ejecuta en el job **UI · Playwright** del workflow de la raíz del repositorio, [`.github/workflows/ci.yml`](../.github/workflows/ci.yml), en cada **push** y **pull request** a `main`, de **lunes a viernes a las 06:00** (hora Perú) y **manualmente** (*Actions → Run workflow*, con filtro de tags opcional). Corre en una matriz de **3 navegadores** (Chromium, Firefox y WebKit): verifica los tipos, ejecuta la suite con un reintento, publica un resumen y sube el reporte HTML de cada navegador como artefacto `reporte-playwright-<navegador>`.

## Usar este proyecto como plantilla

| Qué cambia en el nuevo proyecto | Dónde |
|---|---|
| URL de la aplicación | `BASE_URL` en `src/config/env.ts` y `.env.example` |
| Atributo de test id de la nueva app (`data-testid`, `data-qa`, …) | `testIdAttribute` en `src/config/env.ts` |
| Tamaño de pantalla y timeouts | `viewport`, `stepTimeout`, `actionTimeout` en `src/config/env.ts` |
| Usuarios y credenciales | `src/data/usuarios.ts` (y la variable de la contraseña) |
| Datos en CSV | `src/data/*.csv` (se leen con `leerCsv` de `src/utils/csv.ts`) |
| Páginas y localizadores | `src/pages/` (una clase por página) |
| Escenarios | `features/` y sus steps en `src/steps/` |
| Scripts por funcionalidad | `scripts` en `package.json` |
| Nombre del pipeline, rama, horario, navegadores | `.github/workflows/ci.yml` (en la raíz del repositorio) |

No cambian: `cucumber.js`, `tsconfig.json`, `src/support/` (World y hooks), `BasePage.ts` y `utils/`.

## Observaciones

- El reto pide `standard_user` y `locked_out_user`. Sauce Demo tiene otros usuarios con defectos intencionales (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`) que podrían agregarse en `src/data/usuarios.ts`.
- La aplicación no tiene backend real: el carrito vive en el navegador. Por eso cada escenario usa un **contexto de navegador nuevo**, lo que garantiza que empiece con el carrito vacío.
