// Resumen de Cucumber para GitHub Actions. Uso: node ../scripts/ci/resumen-playwright.js <navegador> (desde reto-playwright-prima)
const fs = require('fs');
const path = require('path');

const archivo = path.join(process.cwd(), 'reports', 'cucumber-report.json');
const navegador = process.argv[2] || 'chromium';

if (!fs.existsSync(archivo)) {
  console.log(`### ⚠️ UI · Playwright (${navegador}): no se generó el reporte`);
  process.exit(0);
}

const features = JSON.parse(fs.readFileSync(archivo, 'utf-8'));

// Con reintentos un escenario aparece varias veces: se toma su último intento
const escenarios = new Map();
for (const feature of features) {
  for (const escenario of feature.elements.filter((e) => e.type === 'scenario')) {
    escenarios.set(escenario.id, { ...escenario, feature: feature.name });
  }
}
const lista = [...escenarios.values()];
const fallidos = lista.filter((e) => e.steps.some((s) => s.result.status === 'failed'));

console.log(`### UI · Playwright + Cucumber (${navegador})`);
console.log('| Navegador | ✅ Pasaron | ❌ Fallaron |');
console.log('|---|---|---|');
console.log(`| ${navegador} | ${lista.length - fallidos.length} | ${fallidos.length} |`);

if (fallidos.length) {
  console.log('\n**Escenarios con fallos:**');
  fallidos.forEach((e) => console.log(`- ${e.feature} → ${e.name}`));
}
