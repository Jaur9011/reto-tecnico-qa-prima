@ignore
Feature: Helper - Crear un usuario por API 

  Scenario: Crear usuario
    * def payload = karate.get('usuario') || generarUsuario()
    Given url baseUrl
    And path 'usuarios'
    And request payload
    When method post
    Then status 201
    * def id = response._id
