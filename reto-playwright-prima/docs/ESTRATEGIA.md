# Informe de estrategia de automatización

## 1. Enfoque

La suite automatiza el recorrido de compra de Sauce Demo desde la perspectiva del cliente: iniciar sesión, agregar productos, revisar el carrito y completar el checkout. Se trabajó en tres fases:

1. **Exploración:** recorrido manual y con Playwright de cada página para inventariar los localizadores (`data-test`) y registrar los mensajes reales de error.
2. **Diseño de casos:** un escenario por criterio de aceptación más las particiones inválidas (usuario bloqueado, credenciales incorrectas, campos vacíos, datos de envío faltantes) y validaciones de negocio (precios en el carrito, subtotal y total).
3. **Automatización** con Playwright + Cucumber en TypeScript, ejecución en paralelo y CI en GitHub Actions.

## 2. Cobertura

| Feature | Positivos | Negativos |
|---|---|---|
| Login | `standard_user` accede a productos | `locked_out_user`; contraseña incorrecta; usuario inexistente; usuario vacío; contraseña vacía; acceso directo sin sesión |
| Carrito | Agregar un producto; ver varios productos con sus precios; eliminar un producto; carrito vacío sin contador | — |
| Compra | Flujo completo hasta "Thank you for your order!" con 3 clientes del CSV, validando productos, subtotal y total | Falta nombre; falta apellido; falta código postal |

Total: **17 escenarios** (8 positivos, 9 negativos).

## 3. Patrones de diseño

**Page Object Model (POM).** Cada página tiene una clase en `src/pages/` que expone sus localizadores y acciones (`LoginPage.iniciarSesion()`, `ProductosPage.agregarAlCarrito()`). Si cambia un localizador, se edita un solo archivo y ningún feature ni step se ve afectado. Las aserciones viven en los steps, no en las páginas: la página sabe *cómo* interactuar; el step decide *qué* verificar.

**Component Object.** Las partes que se repiten en varias páginas son componentes: `HeaderComponent` (contador y enlace del carrito) y `ListaProductosComponent` (lista de productos idéntica en el carrito y en el resumen del checkout). Se reutilizan por composición en lugar de duplicarse.

**Herencia con `BasePage`.** Centraliza la navegación (`abrir()`) y la validación de URL que comparten todas las páginas.

**World de Cucumber (estado por escenario).** `CustomWorld` crea un objeto nuevo por escenario con su página, sus Page Objects y los datos compartidos entre steps (`productosAgregados`). Así los escenarios no comparten estado aunque corran en paralelo.

**Hooks para el ciclo de vida.** Un navegador por *worker* (`BeforeAll`), porque abrirlo es lo más costoso, y un **contexto nuevo por escenario** (`Before`) con cookies y almacenamiento limpios. `After` adjunta captura de pantalla y URL cuando un escenario falla.

**Configuración centralizada.** `src/config/env.ts` reúne URL, navegador, modo headless, timeouts y atributo de test id, sobrescribibles por variables de entorno o `.env`.

## 4. Buenas prácticas aplicadas

- **Localizadores robustos:** `getByTestId` sobre el atributo `data-test`; los productos se buscan por su **nombre visible** y no por su posición en la lista.
- **Sin esperas fijas:** se usan las aserciones con reintento de Playwright (`expect(locator).toBeVisible()`, `toHaveCount`, `toHaveURL`) en lugar de `sleep`.
- **Validación del negocio, no solo de la UI:** los precios del carrito y del resumen se comparan con los que mostraba la página de productos; el subtotal debe ser la suma de los precios y el total, subtotal más impuesto.
- **Gherkin declarativo y reutilizable:** los pasos describen intenciones ("inicio sesión como standard_user"), no clics. Se usan `Antecedentes`, `Esquema del escenario` con `Ejemplos` y tablas de datos.
- **Datos externos en CSV:** los datos de envío de los clientes están en `src/data/clientes.csv` y el feature solo referencia el `id` de cada cliente. Agregar un caso de compra no requiere tocar código. Los `Ejemplos` se dividen en dos bloques para marcar solo el cliente principal como `@smoke`.
- **Tags** por funcionalidad (`@login`, `@carrito`, `@compra`) y tipo (`@smoke`, `@positivo`, `@negativo`, `@e2e`).
- **Versiones fijadas** en `package.json` y `package-lock.json` para ejecuciones reproducibles. TypeScript se fija en 5.9 porque `ts-node` aún no es compatible con TypeScript 7.
- **Verificación de tipos** (`tsc --noEmit`) como paso independiente en CI; la ejecución usa `transpileOnly` para ser más rápida.

## 5. Integración continua

GitHub Actions instala las dependencias con `npm ci`, verifica los tipos, instala el navegador elegido y ejecuta la suite con dos workers y un reintento. Publica una tabla resumen y sube el reporte HTML (con capturas de los fallos) como artefacto. Puede ejecutarse manualmente eligiendo navegador y tags.

## 6. Hallazgos

- Algunos enlaces de cada producto (imagen y título) tienen `role="button"`, por lo que un localizador genérico `getByRole('button')` resulta ambiguo dentro de una tarjeta. Se resolvió filtrando por el nombre accesible del botón.
- Tras un clic que navega, la URL cambia antes de que el contenido nuevo se dibuje. Las validaciones esperan un elemento de la página destino, no solo la URL.

## 7. Posibles mejoras

- Escenarios con los usuarios con defectos intencionales (`problem_user`, `error_user`, `performance_glitch_user`, `visual_user`).
- Matriz de navegadores (chromium, firefox, webkit) en CI.
- Pruebas visuales con `toHaveScreenshot` y de accesibilidad con `@axe-core/playwright`.
- Iniciar sesión mediante `storageState` para acelerar los escenarios que no prueban el login.
