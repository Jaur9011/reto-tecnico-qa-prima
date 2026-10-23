# language: es
@carrito
Característica: Carrito de compras
  Como un cliente de Sauce Demo
  Quiero agregar productos al carrito y revisarlos
  Para confirmar lo que voy a comprar

  Antecedentes:
    Dado que inicié sesión como "standard_user"

  @smoke @positivo
  Escenario: Agregar un producto al carrito desde la página de productos
    Cuando agrego el producto "Sauce Labs Backpack" al carrito
    Entonces el contador del carrito muestra 1
    Y el botón del producto "Sauce Labs Backpack" muestra "Remove"

  @positivo
  Escenario: Ver en el carrito los productos agregados
    Cuando agrego los siguientes productos al carrito:
      | producto                |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Onesie       |
    Entonces el contador del carrito muestra 3
    Cuando abro el carrito
    Entonces el carrito contiene los productos agregados con sus precios

  @positivo
  Escenario: Eliminar un producto del carrito
    Dado que agregué los siguientes productos al carrito:
      | producto                |
      | Sauce Labs Backpack     |
      | Sauce Labs Fleece Jacket |
    Y abro el carrito
    Cuando elimino el producto "Sauce Labs Backpack" del carrito
    Entonces el carrito no contiene el producto "Sauce Labs Backpack"
    Y el carrito contiene los productos agregados con sus precios
    Y el contador del carrito muestra 1

  @positivo @borde
  Escenario: Sin productos agregados el carrito no muestra contador
    Entonces el contador del carrito no se muestra
