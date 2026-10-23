import { Locator, Page } from '@playwright/test';

// Cabecera que se repite en las páginas después del login
export class HeaderComponent {
  readonly contadorCarrito: Locator;
  readonly enlaceCarrito: Locator;
  readonly titulo: Locator;

  constructor(page: Page) {
    this.contadorCarrito = page.getByTestId('shopping-cart-badge');
    this.enlaceCarrito = page.getByTestId('shopping-cart-link');
    this.titulo = page.getByTestId('title');
  }

  async abrirCarrito(): Promise<void> {
    await this.enlaceCarrito.click();
  }
}
