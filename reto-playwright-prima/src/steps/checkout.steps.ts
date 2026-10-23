import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { obtenerCliente } from '../data/clientes';

When('inicio el checkout', async function (this: CustomWorld) {
  await this.carritoPage.irAlCheckout();
  await expect(this.page).toHaveURL(this.checkoutInformacionPage.url);
});

When(
  'completo mis datos de envío con nombre {string}, apellido {string} y código postal {string}',
  async function (this: CustomWorld, nombre: string, apellido: string, codigoPostal: string) {
    await this.checkoutInformacionPage.completarDatos({ nombre, apellido, codigoPostal });
  }
);

// Datos tomados de src/data/clientes.csv
When('completo mis datos de envío con los datos del cliente {string}', async function (this: CustomWorld, idCliente: string) {
  await this.checkoutInformacionPage.completarDatos(obtenerCliente(idCliente));
});

When('continúo con el checkout', async function (this: CustomWorld) {
  await this.checkoutInformacionPage.continuar();
});

Then('veo el mensaje de error del checkout {string}', async function (this: CustomWorld, mensaje: string) {
  await expect(this.checkoutInformacionPage.mensajeError).toHaveText(mensaje);
  await expect(this.page).toHaveURL(this.checkoutInformacionPage.url);
});

Then('el resumen muestra los productos agregados con sus precios', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.checkoutResumenPage.url);
  // esperar a que cargue la lista antes de leerla
  await expect(this.checkoutResumenPage.lista.items).toHaveCount(this.productosAgregados.length);
  expect(await this.checkoutResumenPage.lista.obtenerProductos()).toEqual(this.productosAgregados);
});

Then('el subtotal es la suma de los precios de los productos', async function (this: CustomWorld) {
  const { subtotal } = await this.checkoutResumenPage.obtenerMontos();
  const sumaPrecios = this.productosAgregados.reduce((suma, p) => suma + p.precio, 0);
  expect(subtotal).toBeCloseTo(sumaPrecios, 2);
});

Then('el total es el subtotal más el impuesto', async function (this: CustomWorld) {
  const { subtotal, impuesto, total } = await this.checkoutResumenPage.obtenerMontos();
  expect(total).toBeCloseTo(subtotal + impuesto, 2);
});

When('finalizo la compra', async function (this: CustomWorld) {
  await this.checkoutResumenPage.finalizar();
});

Then('veo la confirmación {string}', async function (this: CustomWorld, mensaje: string) {
  await expect(this.page).toHaveURL(this.confirmacionPage.url);
  await expect(this.confirmacionPage.encabezado).toHaveText(mensaje);
});

Then('el carrito queda vacío', async function (this: CustomWorld) {
  await expect(this.confirmacionPage.header.contadorCarrito).toHaveCount(0);
});
