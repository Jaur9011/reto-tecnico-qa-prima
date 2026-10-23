@usuarios @buscar
Feature: GET /usuarios/{_id} - Buscar usuario por ID

  Background:
    * url baseUrl
    * def usuarioSchema = read(schemas + 'usuario-schema.json')

  @smoke @positivo
  Scenario: Buscar un usuario existente por su ID
    * def usuario = generarUsuario()
    * def creado = call read('classpath:serverest/common/helpers/crear-usuario.feature') { usuario: '#(usuario)' }
    * def idsParaLimpiar = ['#(creado.id)']
    Given path 'usuarios', creado.id
    When method get
    Then status 200
    And match response == usuarioSchema
    And match response == karate.merge(usuario, { _id: creado.id })

  @negativo
  Scenario: Buscar un ID que no existe
    Given path 'usuarios', generarIdInexistente()
    When method get
    Then status 400
    And match response == { message: 'Usuário não encontrado' }

  # La regla de 16 caracteres alfanuméricos NO está en el Swagger (solo define "string");
  # estos escenarios verifican el comportamiento observado de la API y documentan esa brecha.
  @negativo
  Scenario Outline: Buscar con un ID de formato inválido: <descripcion>
    Given path 'usuarios', '<id>'
    When method get
    Then status 400
    And match response == { id: 'id deve ter exatamente 16 caracteres alfanuméricos' }

    Examples:
      | descripcion            | id                   |
      | menos de 16 caracteres | abc123               |
      | más de 16 caracteres   | abcdefghij1234567890 |
      | caracteres especiales  | abcdefghij12345-     |
