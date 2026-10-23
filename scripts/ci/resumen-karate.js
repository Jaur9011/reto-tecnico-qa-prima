// Resumen de Karate para GitHub Actions. Uso: node ../scripts/ci/resumen-karate.js (desde reto-karate-prima)
const fs = require('fs');
const path = require('path');

const archivo = path.join(process.cwd(), 'target', 'karate-reports', 'karate-summary-json.txt');
const ambiente = process.argv[2] || 'local';

if (!fs.existsSync(archivo)) {
  console.log('### ⚠️ API · Karate: no se generó el reporte');
  process.exit(0);
}

const resumen = JSON.parse(fs.readFileSync(archivo, 'utf-8'));
const fallidos = resumen.featureSummary.filter((f) => f.failedCount > 0);

console.log('### API · Karate (ServeRest)');
console.log('| Ambiente | ✅ Pasaron | ❌ Fallaron | ⏱️ Tiempo |');
console.log('|---|---|---|---|');
console.log(`| ${ambiente} | ${resumen.scenariosPassed} | ${resumen.scenariosfailed} | ${Math.round(resumen.elapsedTime / 1000)} s |`);

if (fallidos.length) {
  console.log('\n**Features con fallos:**');
  fallidos.forEach((f) => console.log(`- \`${f.relativePath}\` (${f.failedCount} fallidos)`));
}
