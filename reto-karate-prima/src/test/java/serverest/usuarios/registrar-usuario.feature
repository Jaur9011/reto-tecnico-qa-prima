@usuarios @registrar
Feature: POST /usuarios - Registrar usuario

  Background:
    * url baseUrl
    * def usuarioSchema = read(schemas + 'usuario-schema.json')
    * def creacionSchema = read(schemas + 'creacion-schema.json')

  @smoke @positivo
  Scenario Outline: Registrar usuario válido desde CSV: <caso>
    # Datos del CSV + email único generado (en JS las variables van sin '#()')
    * def usuario = generarUsuario({ nome: nome, password: password, administrador: administrador })
    Given path 'usuarios'
    And request usuario
    When method post
    Then status 201
    And match response == creacionSchema
    * def idCreado = response._id
    * def idsParaLimpiar = ['#(idCreado)']

    # Verificación: el usuario quedó guardado con los datos del CSV
    Given path 'usuarios', idCreado
    When method get
    Then status 200
    And match response == usuarioSchema
    And match response == karate.merge(usuario, { _id: idCreado })

    Examples:
      | read('data/usuarios-validos.csv') |

  @negativo
  Scenario: No se puede registrar un usuario con un email ya registrado
    * def existente = call read('classpath:serverest/common/helpers/crear-usuario.feature')
    * def idsParaLimpiar = ['#(existente.id)']
    * def duplicado = generarUsuario({ email: existente.payload.email })
    Given path 'usuarios'
    And request duplicado
    When method post
    Then status 400
    And match response == { message: 'Este email já está sendo usado' }

  @negativo
  Scenario: No se puede registrar un usuario con el cuerpo vacío
    Given path 'usuarios'
    And request {}
    When method post
    Then status 400
    And match response ==
      """
      {
        nome: 'nome é obrigatório',
        email: 'email é obrigatório',
        password: 'password é obrigatório',
        administrador: 'administrador é obrigatório'
      }
      """

  @negativo
  Scenario Outline: No se puede registrar un usuario sin el campo obligatorio <campo>
    * def usuario = generarUsuario()
    * remove usuario.<campo>
    Given path 'usuarios'
    And request usuario
    When method post
    Then status 400
    And match response == { <campo>: '<campo> é obrigatório' }

    Examples:
      | campo         |
      | nome          |
      | email         |
      | password      |
      | administrador |

  @negativo
  Scenario Outline: No se puede registrar un usuario con <caso>
    * def usuario = generarUsuario()
    * eval usuario[campo] = valor
    * def errorEsperado = {}
    * eval errorEsperado[campo] = mensaje
    Given path 'usuarios'
    And request usuario
    When method post
    Then status 400
    And match response == errorEsperado

    Examples:
      | read('data/campos-invalidos.json') |

  @negativo
  Scenario: No se puede registrar un usuario con campos no definidos en el contrato
    * def usuario = generarUsuario({ rol: 'superadmin' })
    Given path 'usuarios'
    And request usuario
    When method post
    Then status 400
    And match response == { rol: 'rol não é permitido' }
