import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductosPage } from '../pages/ProductosPage';
import { CarritoPage } from '../pages/CarritoPage';
import { CheckoutInformacionPage } from '../pages/CheckoutInformacionPage';
import { CheckoutResumenPage } from '../pages/CheckoutResumenPage';
import { ConfirmacionPage } from '../pages/ConfirmacionPage';
import { ProductoEnLista } from '../pages/components/ListaProductosComponent';

// Se crea uno nuevo por cada escenario
export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;

  // Productos agregados durante el escenario (nombre y precio)
  productosAgregados: ProductoEnLista[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  get loginPage() { return new LoginPage(this.page); }
  get productosPage() { return new ProductosPage(this.page); }
  get carritoPage() { return new CarritoPage(this.page); }
  get checkoutInformacionPage() { return new CheckoutInformacionPage(this.page); }
  get checkoutResumenPage() { return new CheckoutResumenPage(this.page); }
  get confirmacionPage() { return new ConfirmacionPage(this.page); }
}

setWorldConstructor(CustomWorld);
