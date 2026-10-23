@usuarios @listar
Feature: GET /usuarios - Listar usuarios

  Background:
    * url baseUrl
    * def usuarioSchema = read(schemas + 'usuario-schema.json')
    * def listaSchema = read(schemas + 'lista-usuarios-schema.json')

  @smoke @positivo
  Scenario: Obtener la lista de todos los usuarios
    Given path 'usuarios'
    When method get
    Then status 200
    # valida que la respuesta cumpla con el esquema de lista de usuarios
    And match response == listaSchema
    # valida que quantidade sea igual al largo de la lista usuarios
    And match response.quantidade == response.usuarios.length

  @positivo
  Scenario: Un usuario recién registrado aparece al filtrar por su email
    * def usuario = generarUsuario()
    * def creado = call read('classpath:serverest/common/helpers/crear-usuario.feature') { usuario: '#(usuario)' }
    * def idsParaLimpiar = ['#(creado.id)']
    Given path 'usuarios'
    And param email = usuario.email
    When method get
    Then status 200
    And match response == listaSchema
    And match response.quantidade == 1
    And match response.usuarios[0] == karate.merge(usuario, { _id: creado.id })

  @positivo
  Scenario Outline: Filtrar usuarios por administrador=<administrador>
    * def usuario = generarUsuario({ administrador: '<administrador>' })
    * def creado = call read('classpath:serverest/common/helpers/crear-usuario.feature') { usuario: '#(usuario)' }
    * def idsParaLimpiar = ['#(creado.id)']
    Given path 'usuarios'
    And param administrador = '<administrador>'
    When method get
    Then status 200
    And match response == listaSchema
    And match response.usuarios == '#[_ > 0]'
    And match each response.usuarios contains { administrador: '<administrador>' }

    Examples:
      | administrador |
      | true          |
      | false         |

  @negativo
  Scenario: Filtrar por un email no registrado devuelve una lista vacía
    Given path 'usuarios'
    And param email = generarEmail('no.existe')
    When method get
    Then status 200
    And match response == { quantidade: 0, usuarios: [] }

  @negativo
  Scenario: Filtrar con un valor de administrador fuera del enum es rechazado
    Given path 'usuarios'
    And param administrador = 'talvez'
    When method get
    Then status 400
    And match response == { administrador: "administrador deve ser 'true' ou 'false'" }
