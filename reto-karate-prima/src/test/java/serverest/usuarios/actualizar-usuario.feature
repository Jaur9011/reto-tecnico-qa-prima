@usuarios @actualizar
Feature: PUT /usuarios/{_id} - Actualizar usuario

  Background:
    * url baseUrl
    * def usuarioSchema = read(schemas + 'usuario-schema.json')
    * def creacionSchema = read(schemas + 'creacion-schema.json')
    # Precondición común: un usuario existente a actualizar
    * def original = generarUsuario({ administrador: 'true' })
    * def creado = call read('classpath:serverest/common/helpers/crear-usuario.feature') { usuario: '#(original)' }
    * def idsParaLimpiar = ['#(creado.id)']

  @smoke @positivo
  Scenario: Actualizar todos los datos de un usuario existente
    * def cambios = generarUsuario({ administrador: 'false' })
    Given path 'usuarios', creado.id
    And request cambios
    When method put
    Then status 200
    And match response == { message: 'Registro alterado com sucesso' }

    # Verificación: los cambios quedaron guardados
    Given path 'usuarios', creado.id
    When method get
    Then status 200
    And match response == usuarioSchema
    And match response == karate.merge(cambios, { _id: creado.id })

  @positivo
  Scenario: Actualizar solo el nombre manteniendo el mismo email
    * def cambios = karate.merge(original, { nome: 'Nombre Actualizado QA' })
    Given path 'usuarios', creado.id
    And request cambios
    When method put
    Then status 200
    And match response == { message: 'Registro alterado com sucesso' }

    Given path 'usuarios', creado.id
    When method get
    Then status 200
    And match response.nome == 'Nombre Actualizado QA'
    And match response.email == original.email

  @positivo
  Scenario: Actualizar un ID inexistente registra un usuario nuevo (documentado en Swagger como 201)
    * def nuevo = generarUsuario()
    Given path 'usuarios', generarIdInexistente()
    And request nuevo
    When method put
    Then status 201
    And match response == creacionSchema
    * def idsParaLimpiar = karate.append(idsParaLimpiar, response._id)

  @negativo
  Scenario: No se puede actualizar con un email que pertenece a otro usuario
    * def otro = call read('classpath:serverest/common/helpers/crear-usuario.feature')
    * def idsParaLimpiar = karate.append(idsParaLimpiar, otro.id)
    * def cambios = karate.merge(original, { email: otro.payload.email })
    Given path 'usuarios', creado.id
    And request cambios
    When method put
    Then status 400
    And match response == { message: 'Este email já está sendo usado' }

  @negativo
  Scenario Outline: No se puede actualizar un usuario con <caso>
    * copy cambios = original
    * eval cambios[campo] = valor
    * def errorEsperado = {}
    * eval errorEsperado[campo] = mensaje
    Given path 'usuarios', creado.id
    And request cambios
    When method put
    Then status 400
    And match response == errorEsperado

    Examples:
      | read('data/campos-invalidos.json') |

  @negativo
  Scenario: No se puede actualizar un usuario con el cuerpo vacío
    Given path 'usuarios', creado.id
    And request {}
    When method put
    Then status 400
    And match response contains { nome: 'nome é obrigatório', email: 'email é obrigatório' }
