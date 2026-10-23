import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { ListaProductosComponent } from './components/ListaProductosComponent';

export class CarritoPage extends BasePage {
  protected readonly ruta = '/cart.html';

  readonly header: HeaderComponent;
  readonly lista: ListaProductosComponent;
  readonly botonCheckout: Locator;
  readonly botonSeguirComprando: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.lista = new ListaProductosComponent(page);
    this.botonCheckout = page.getByTestId('checkout');
    this.botonSeguirComprando = page.getByTestId('continue-shopping');
  }

  async eliminar(nombre: string): Promise<void> {
    await this.lista.item(nombre).getByRole('button', { name: 'Remove' }).click();
  }

  async irAlCheckout(): Promise<void> {
    await this.botonCheckout.click();
  }
}
