import { Locator, Page } from '@playwright/test';
import { aNumero, textoExacto } from '../../utils/texto';

export interface ProductoEnLista {
  nombre: string;
  precio: number;
}

// Lista de productos del carrito y del resumen del checkout
export class ListaProductosComponent {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
  }

  item(nombre: string): Locator {
    return this.items.filter({ has: this.page.getByTestId('inventory-item-name').filter({ hasText: textoExacto(nombre) }) });
  }

  async obtenerProductos(): Promise<ProductoEnLista[]> {
    const productos: ProductoEnLista[] = [];
    for (const item of await this.items.all()) {
      productos.push({
        nombre: (await item.getByTestId('inventory-item-name').innerText()).trim(),
        precio: aNumero(await item.getByTestId('inventory-item-price').innerText())
      });
    }
    return productos;
  }
}
