import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { ListaProductosComponent } from './components/ListaProductosComponent';
import { aNumero } from '../utils/texto';

// Checkout paso 2
export class CheckoutResumenPage extends BasePage {
  protected readonly ruta = '/checkout-step-two.html';

  readonly header: HeaderComponent;
  readonly lista: ListaProductosComponent;
  readonly subtotal: Locator;
  readonly impuesto: Locator;
  readonly total: Locator;
  readonly botonFinalizar: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.lista = new ListaProductosComponent(page);
    this.subtotal = page.getByTestId('subtotal-label');
    this.impuesto = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.botonFinalizar = page.getByTestId('finish');
  }

  async obtenerMontos(): Promise<{ subtotal: number; impuesto: number; total: number }> {
    return {
      subtotal: aNumero(await this.subtotal.innerText()),
      impuesto: aNumero(await this.impuesto.innerText()),
      total: aNumero(await this.total.innerText())
    };
  }

  async finalizar(): Promise<void> {
    await this.botonFinalizar.click();
  }
}
