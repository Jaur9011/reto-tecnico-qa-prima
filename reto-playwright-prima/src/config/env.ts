// Configuración general (se puede cambiar con variables de entorno o un archivo .env)
try {
  process.loadEnvFile();
} catch (error) {
  // Si no hay .env se usan los valores por defecto
  if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') {
    throw error;
  }
}

const navegadores = ['chromium', 'firefox', 'webkit'] as const;
export type Navegador = (typeof navegadores)[number];

const browser = (process.env.BROWSER ?? 'chromium') as Navegador;
if (!navegadores.includes(browser)) {
  throw new Error(`Navegador no soportado: ${browser}. Usa: ${navegadores.join(', ')}`);
}

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  browser,
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO ?? 0), // pausa entre acciones (ms)
  testIdAttribute: 'data-test',
  viewport: { width: 1366, height: 768 },
  stepTimeout: 30_000,
  actionTimeout: 10_000
};
