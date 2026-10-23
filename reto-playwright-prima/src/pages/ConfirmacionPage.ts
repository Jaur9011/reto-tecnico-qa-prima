import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export class ConfirmacionPage extends BasePage {
  protected readonly ruta = '/checkout-complete.html';

  readonly header: HeaderComponent;
  readonly encabezado: Locator;
  readonly texto: Locator;
  readonly botonVolver: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.encabezado = page.getByTestId('complete-header');
    this.texto = page.getByTestId('complete-text');
    this.botonVolver = page.getByTestId('back-to-products');
  }
}
