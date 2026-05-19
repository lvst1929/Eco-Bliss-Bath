//Vérifier la présence des champs et boutons de connexion

describe("Smoke test page de connexion", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200/#/login")
    })
    it("doit afficher le bouton de connexion principal", () => {
        cy.get('[data-cy ="nav-link-login"]')
            .should("be.visible")
            .and("not.be.disabled")
    })
    it("doit afficher le titre Se connecter", () => {
        cy.contains("Se connecter")
            .should("be.visible")

    })
    it("doit afficher le sous-titre Welcome Back", () => {
        cy.contains("Welcome back !")
            .should("be.visible")

    })
    it("doit afficher le label Email", () => {
        cy.contains("Email")
            .should("be.visible")
    })
    it("doit afficher le champ d'insertion d'Email", () => {
        cy.get('[data-cy="login-input-username"]')
            .should("be.visible")

    })
    it("doit afficher le label Mot de passe", () => {
        cy.contains("Mot de passe")
            .should("be.visible")

    })
    it("doit afficher le champ d'insertion du Mot de passe", () => {
        cy.get('[data-cy="login-input-password"]')
            .should("be.visible")

    })
    it("doit afficher le bouton se connecter", () => {
        cy.get('[data-cy="login-submit"]')
            .should("be.visible")

    })
})

//Vérifier le bouton d'ajout au panier lorsque l'utilisateur est connecté 

describe("smoke test bouton d'ajout au panier disponible si user connecté", () => {
    beforeEach(() => {

        cy.visit("http://localhost:4200/#/")

        // connexion utilisateur
        //click login
        cy.get('[data-cy ="nav-link-login"]').click()
        //remplir email
        cy.get('[data-cy="login-input-username"]')
            .type("test2@test.fr")

        //remplir mdp 
        cy.get('[data-cy="login-input-password"]')
            .type("testtest")
        //click se connecter
        cy.get('[data-cy="login-submit"]').click()

        //click sur voir les produits
        cy.contains("Voir les produits").click()

        //click sur consulter pour afficher le produit
        cy.get('[data-cy="product-link"]')
            .first()
            .click()
        cy.url().should("include", "/products/")

    })

    it("doit afficher les boutons d'ajout au panier", () => {

        // vérifications
        cy.get('[data-cy="detail-product-add"]')
            .should("be.visible")
            .and("not.be.disabled")

    })
})