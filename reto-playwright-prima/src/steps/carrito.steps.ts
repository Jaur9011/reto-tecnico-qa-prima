import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('abro el carrito', async function (this: CustomWorld) {
  await this.productosPage.header.abrirCarrito();
  await expect(this.page).toHaveURL(this.carritoPage.url);
});

When('elimino el producto {string} del carrito', async function (this: CustomWorld, nombre: string) {
  await this.carritoPage.eliminar(nombre);
  this.productosAgregados = this.productosAgregados.filter((p) => p.nombre !== nombre);
});

Then('el carrito contiene los productos agregados con sus precios', async function (this: CustomWorld) {
  await expect(this.carritoPage.lista.items).toHaveCount(this.productosAgregados.length);
  expect(await this.carritoPage.lista.obtenerProductos()).toEqual(this.productosAgregados);
});

Then('el carrito no contiene el producto {string}', async function (this: CustomWorld, nombre: string) {
  await expect(this.carritoPage.lista.item(nombre)).toHaveCount(0);
});
