Cypress.Commands.add("login", () => {
    cy.visit("http://localhost:4200/#/")

    cy.get('[data-cy="nav-link-login"]').click()
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr")
    cy.get('[data-cy="login-input-password"]').type("testtest")
    cy.get('[data-cy="login-submit"]').click()
})