import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, selectors, webkit } from '@playwright/test';
import { config } from '../config/env';
import { CustomWorld } from './world';

setDefaultTimeout(config.stepTimeout);

let browser: Browser;

// Un navegador por worker
BeforeAll(async function () {
  selectors.setTestIdAttribute(config.testIdAttribute);
  browser = await { chromium, firefox, webkit }[config.browser].launch({
    headless: config.headless,
    slowMo: config.slowMo
  });
});

// Contexto nuevo por escenario (sesión y carrito limpios)
Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({ baseURL: config.baseUrl, viewport: config.viewport });
  this.context.setDefaultTimeout(config.actionTimeout);
  this.page = await this.context.newPage();
});

// Captura de pantalla si el escenario falla
After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const captura = await this.page.screenshot({ fullPage: true });
    this.attach(captura, 'image/png');
    this.attach(`URL al fallar: ${this.page.url()}`, 'text/plain');
  }
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
