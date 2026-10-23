import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { obtenerUsuario } from '../data/usuarios';

Given('que estoy en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.abrir();
  await expect(this.loginPage.botonLogin).toBeVisible();
});

Given('que inicié sesión como {string}', async function (this: CustomWorld, tipoUsuario: string) {
  const { usuario, password } = obtenerUsuario(tipoUsuario);
  await this.loginPage.abrir();
  await this.loginPage.iniciarSesion(usuario, password);
  await expect(this.page).toHaveURL(this.productosPage.url);
});

When('inicio sesión como {string}', async function (this: CustomWorld, tipoUsuario: string) {
  const { usuario, password } = obtenerUsuario(tipoUsuario);
  await this.loginPage.iniciarSesion(usuario, password);
});

When('ingreso el usuario {string} y la contraseña {string}', async function (this: CustomWorld, usuario: string, password: string) {
  await this.loginPage.iniciarSesion(usuario, password);
});

When('intento abrir la página de productos sin iniciar sesión', async function (this: CustomWorld) {
  await this.productosPage.abrir();
});

Then('veo la página de productos', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.productosPage.url);
  await expect(this.productosPage.header.titulo).toHaveText('Products');
  await expect(this.productosPage.tarjetas.first()).toBeVisible();
});

Then('veo el mensaje de error de inicio de sesión {string}', async function (this: CustomWorld, mensaje: string) {
  await expect(this.loginPage.mensajeError).toHaveText(mensaje);
});

Then('permanezco en la página de inicio de sesión', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.loginPage.url);
  await expect(this.loginPage.botonLogin).toBeVisible();
});
