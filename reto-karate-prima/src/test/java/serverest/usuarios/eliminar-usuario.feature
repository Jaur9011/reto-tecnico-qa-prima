@usuarios @eliminar
Feature: DELETE /usuarios/{_id} - Eliminar usuario

  Background:
    * url baseUrl
    * def mensajeSchema = read(schemas + 'mensaje-schema.json')

  @smoke @positivo
  Scenario: Eliminar un usuario existente
    * def creado = call read('classpath:serverest/common/helpers/crear-usuario.feature')
    Given path 'usuarios', creado.id
    When method delete
    Then status 200
    And match response == mensajeSchema
    And match response.message == 'Registro excluído com sucesso'

    # Verificación: el usuario ya no existe
    Given path 'usuarios', creado.id
    When method get
    Then status 400
    And match response == { message: 'Usuário não encontrado' }

  @negativo
  Scenario: Eliminar un usuario inexistente no elimina ningún registro
    Given path 'usuarios', generarIdInexistente()
    When method delete
    Then status 200
    And match response == { message: 'Nenhum registro excluído' }

  @negativo
  Scenario: No se puede eliminar un usuario que tiene un carrito registrado
    * def usuario = generarUsuario()
    * def creado = call read('classpath:serverest/common/helpers/crear-usuario.feature') { usuario: '#(usuario)' }
    * def idsParaLimpiar = ['#(creado.id)']
    * def carrito = call read('classpath:serverest/common/helpers/crear-carrito.feature') { usuario: '#(usuario)' }

    Given path 'usuarios', creado.id
    When method delete
    Then status 400
    And match response == { message: 'Não é permitido excluir usuário com carrinho cadastrado', idCarrinho: '#(carrito.idCarrinho)' }

    # Se cancela el carrito para que el hook de limpieza pueda eliminar al usuario
    Given path 'carrinhos', 'cancelar-compra'
    And header Authorization = carrito.token
    When method delete
    Then status 200
