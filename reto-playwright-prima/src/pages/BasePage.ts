import { Page } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly ruta: string;

  constructor(protected readonly page: Page) {}

  async abrir(): Promise<void> {
    await this.page.goto(this.ruta);
  }

  // Para validar que estamos en esta página
  get url(): RegExp {
    return new RegExp(`${this.ruta.replace(/[.]/g, '\\.')}$`);
  }
}
