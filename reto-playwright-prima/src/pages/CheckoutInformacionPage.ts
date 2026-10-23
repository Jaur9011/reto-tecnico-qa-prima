import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export interface DatosEnvio {
  nombre: string;
  apellido: string;
  codigoPostal: string;
}

// Checkout paso 1
export class CheckoutInformacionPage extends BasePage {
  protected readonly ruta = '/checkout-step-one.html';

  readonly header: HeaderComponent;
  readonly campoNombre: Locator;
  readonly campoApellido: Locator;
  readonly campoCodigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly mensajeError: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.campoNombre = page.getByTestId('firstName');
    this.campoApellido = page.getByTestId('lastName');
    this.campoCodigoPostal = page.getByTestId('postalCode');
    this.botonContinuar = page.getByTestId('continue');
    this.mensajeError = page.getByTestId('error');
  }

  async completarDatos(datos: DatosEnvio): Promise<void> {
    await this.campoNombre.fill(datos.nombre);
    await this.campoApellido.fill(datos.apellido);
    await this.campoCodigoPostal.fill(datos.codigoPostal);
  }

  async continuar(): Promise<void> {
    await this.botonContinuar.click();
  }
}
