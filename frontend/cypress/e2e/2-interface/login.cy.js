//Scénario de connexion

describe("scenario complet de connexion", () => {
    it("doit connecter l'utilisateur", () => {
        cy.visit("http://localhost:4200/#/")

        //click login et redirection page login
        cy.get('[data-cy ="nav-link-login"]')
            .should("be.visible")
            .and("not.be.disabled")
            .click()
        cy.url()
            .should("include", "/login")

        //remplir email
        cy.get('[data-cy="login-input-username"]')
            .type("test2@test.fr")
            .should("be.visible")
            .should("have.value", "test2@test.fr")

        //remplir mdp 
        cy.get('[data-cy="login-input-password"]')
            .type("testtest")
            .should("be.visible")
            .should("have.value", "testtest")

        //click se connecter
        cy.get('[data-cy="login-submit"]')
            .should("be.visible")
            .and("not.be.disabled")
            .click()

        cy.url()
            .should("eq", "http://localhost:4200/#/")
        cy.get('[data-cy="nav-link-login"]')
            .should("not.exist")
        cy.get('[data-cy="nav-link-logout"]')
            .should("be.visible")
            .and("not.be.disabled")

        cy.get('[data-cy="nav-link-cart"]')
            .should("be.visible")
            .and("not.be.disabled")

    })


})