# language: es
@compra
Característica: Proceso de compra
  Como un cliente de Sauce Demo
  Quiero completar la compra de los productos de mi carrito
  Para poder adquirir los productos que necesito

  Antecedentes:
    Dado que inicié sesión como "standard_user"
    Y agregué los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Y abro el carrito
    Y inicio el checkout

  @positivo @e2e
  Esquema del escenario: Completar una compra hasta la confirmación con <cliente>
    Cuando completo mis datos de envío con los datos del cliente "<cliente>"
    Y continúo con el checkout
    Entonces el resumen muestra los productos agregados con sus precios
    Y el subtotal es la suma de los precios de los productos
    Y el total es el subtotal más el impuesto
    Cuando finalizo la compra
    Entonces veo la confirmación "Thank you for your order!"
    Y el carrito queda vacío

    # Datos de cada cliente en src/data/clientes.csv
    @smoke
    Ejemplos: Cliente principal
      | cliente      |
      | cliente_peru |

    Ejemplos: Otros datos de envío
      | cliente            |
      | cliente_tildes     |
      | cliente_extranjero |

  @negativo
  Esquema del escenario: No se puede continuar el checkout sin <campo>
    Cuando completo mis datos de envío con nombre "<nombre>", apellido "<apellido>" y código postal "<codigo>"
    Y continúo con el checkout
    Entonces veo el mensaje de error del checkout "<mensaje>"

    Ejemplos:
      | campo         | nombre | apellido | codigo | mensaje                        |
      | nombre        |        | García   | 15001  | Error: First Name is required  |
      | apellido      | Ana    |          | 15001  | Error: Last Name is required   |
      | código postal | Ana    | García   |        | Error: Postal Code is required |
