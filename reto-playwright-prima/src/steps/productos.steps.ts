import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

async function agregarProducto(world: CustomWorld, nombre: string): Promise<void> {
  const precio = await world.productosPage.obtenerPrecio(nombre);
  await world.productosPage.agregarAlCarrito(nombre);
  world.productosAgregados.push({ nombre, precio });
}

async function agregarProductosDeTabla(world: CustomWorld, tabla: DataTable): Promise<void> {
  for (const { producto } of tabla.hashes()) {
    await agregarProducto(world, producto);
  }
}

// "agrego/agregué" acepta las dos formas
When('agrego/agregué el producto {string} al carrito', async function (this: CustomWorld, nombre: string) {
  await agregarProducto(this, nombre);
});

When('agrego/agregué los siguientes productos al carrito:', async function (this: CustomWorld, tabla: DataTable) {
  await agregarProductosDeTabla(this, tabla);
});

Given('que agregué los siguientes productos al carrito:', async function (this: CustomWorld, tabla: DataTable) {
  await agregarProductosDeTabla(this, tabla);
});

Then('el contador del carrito muestra {int}', async function (this: CustomWorld, cantidad: number) {
  await expect(this.productosPage.header.contadorCarrito).toHaveText(String(cantidad));
});

Then('el contador del carrito no se muestra', async function (this: CustomWorld) {
  await expect(this.productosPage.header.contadorCarrito).toHaveCount(0);
});

Then('el botón del producto {string} muestra {string}', async function (this: CustomWorld, nombre: string, texto: string) {
  await expect(this.productosPage.botonDe(nombre)).toHaveText(texto);
});
