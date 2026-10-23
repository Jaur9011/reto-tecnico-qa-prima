# Reto técnico – Automatización QA

[![CI - Automatización QA](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

Dos proyectos de automatización (API y UI) con integración continua en **GitHub Actions**.

| Proyecto | Tipo | Stack | Alcance |
|---|---|---|---|
| [`reto-karate-prima`](reto-karate-prima) | API | Karate 1.5.2 · JUnit 5 · Maven · Java 21 | 48 escenarios sobre el CRUD de usuarios de [ServeRest](https://serverest.dev): GET, POST, GET por ID, PUT y DELETE, con validación de esquemas, datos desde CSV/JSON y limpieza automática |
| [`reto-playwright-prima`](reto-playwright-prima) | UI | Playwright 1.64 · Cucumber 13 · TypeScript · Page Object Model | 17 escenarios en [Sauce Demo](https://www.saucedemo.com): login (`standard_user` y `locked_out_user`), carrito y compra completa, con datos desde CSV |

## Integración continua

El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta en cada push y pull request a `main`, de lunes a viernes a las 06:00 (hora Perú) y manualmente desde **Actions → Run workflow**.

| Job | Qué hace |
|---|---|
| **API · Karate** | Levanta ServeRest dentro del runner (o usa la API pública, a elección), ejecuta la suite en paralelo y publica el reporte HTML de Karate |
| **UI · Playwright** | Matriz de 3 navegadores (Chromium, Firefox, WebKit) en modo headless, con verificación de tipos y un reintento; publica el reporte HTML de Cucumber con capturas de los fallos |

Cada ejecución muestra un **resumen de resultados** en la página del workflow y deja los reportes como **artefactos descargables**.

## Ejecución local

```bash
# API
cd reto-karate-prima
mvn test

# UI
cd reto-playwright-prima
npm ci
npx playwright install chromium
npm test
```

Detalle de configuración, tags y reportes en el README de cada proyecto:

- [Karate – README](reto-karate-prima/README.md) · [Estrategia](reto-karate-prima/docs/ESTRATEGIA.md)
- [Playwright – README](reto-playwright-prima/README.md) · [Estrategia](reto-playwright-prima/docs/ESTRATEGIA.md)
