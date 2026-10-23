@ignore
Feature: Helper - Eliminar un usuario por id (limpieza de datos)

  Scenario: Eliminar usuario
    Given url baseUrl
    And path 'usuarios', id
    When method delete
    * karate.log('Limpieza de usuario', id, '->', response.message)
