# language: es
@login
Característica: Inicio de sesión en Sauce Demo
  Como un cliente de Sauce Demo
  Quiero poder iniciar sesión con mis credenciales
  Para poder adquirir los productos que necesito

  Antecedentes:
    Dado que estoy en la página de inicio de sesión

  @smoke @positivo
  Escenario: Iniciar sesión con credenciales válidas
    Cuando inicio sesión como "standard_user"
    Entonces veo la página de productos

  @negativo
  Escenario: Un usuario bloqueado no puede iniciar sesión
    Cuando inicio sesión como "locked_out_user"
    Entonces veo el mensaje de error de inicio de sesión "Epic sadface: Sorry, this user has been locked out."
    Y permanezco en la página de inicio de sesión

  @negativo
  Esquema del escenario: No se puede iniciar sesión con <caso>
    Cuando ingreso el usuario "<usuario>" y la contraseña "<password>"
    Entonces veo el mensaje de error de inicio de sesión "<mensaje>"
    Y permanezco en la página de inicio de sesión

    Ejemplos:
      | caso                  | usuario          | password      | mensaje                                                                    |
      | contraseña incorrecta | standard_user    | clave_erronea | Epic sadface: Username and password do not match any user in this service |
      | usuario inexistente   | usuario_fantasma | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | usuario vacío         |                  | secret_sauce  | Epic sadface: Username is required                                         |
      | contraseña vacía      | standard_user    |               | Epic sadface: Password is required                                         |

  @negativo @seguridad
  Escenario: No se puede acceder a los productos sin iniciar sesión
    Cuando intento abrir la página de productos sin iniciar sesión
    Entonces veo el mensaje de error de inicio de sesión "Epic sadface: You can only access '/inventory.html' when you are logged in."
    Y permanezco en la página de inicio de sesión
