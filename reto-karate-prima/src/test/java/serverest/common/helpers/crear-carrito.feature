@ignore
Feature: Helper - Crear un carrito para un usuario

  # Requiere: usuario (con email y password)
  # Devuelve: token, idCarrinho

  Scenario: Login y creación de carrito
    Given url baseUrl
    And path 'login'
    And request { email: '#(usuario.email)', password: '#(usuario.password)' }
    When method post
    Then status 200
    * def token = response.authorization

    Given path 'produtos'
    When method get
    Then status 200
    * def conStock = karate.filter(response.produtos, function(p){ return p.quantidade > 0 })
    * if (conStock.length == 0) karate.fail('No hay productos con stock para crear el carrito')

    Given path 'carrinhos'
    And header Authorization = token
    And request { produtos: [{ idProduto: '#(conStock[0]._id)', quantidade: 1 }] }
    When method post
    Then status 201
    * def idCarrinho = response._id
