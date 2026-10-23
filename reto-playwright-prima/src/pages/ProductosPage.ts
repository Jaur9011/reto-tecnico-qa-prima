import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { aNumero, textoExacto } from '../utils/texto';

export class ProductosPage extends BasePage {
  protected readonly ruta = '/inventory.html';

  readonly header: HeaderComponent;
  readonly tarjetas: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.tarjetas = page.getByTestId('inventory-item');
  }

  // Busca el producto por su nombre
  tarjeta(nombre: string): Locator {
    return this.tarjetas.filter({ has: this.page.getByTestId('inventory-item-name').filter({ hasText: textoExacto(nombre) }) });
  }

  // Se filtra por nombre porque la imagen y el título también tienen role="button"
  botonDe(nombre: string): Locator {
    return this.tarjeta(nombre).getByRole('button', { name: /^(Add to cart|Remove)$/ });
  }

  async obtenerPrecio(nombre: string): Promise<number> {
    return aNumero(await this.tarjeta(nombre).getByTestId('inventory-item-price').innerText());
  }

  async agregarAlCarrito(nombre: string): Promise<void> {
    await this.tarjeta(nombre).getByRole('button', { name: 'Add to cart' }).click();
  }
}
