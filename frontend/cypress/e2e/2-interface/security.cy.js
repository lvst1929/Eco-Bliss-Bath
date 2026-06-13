describe("Tests sécurité XSS", () => {

    beforeEach(() => {
        cy.login()
    })

    it("ne doit pas afficher de pop-up lors d'une injection XSS dans les avis", () => {

        // Accès aux avis
        cy.contains("Avis").click()

        cy.url().should("include", "/reviews")

        // Détecter une éventuelle alert Javascript (écouteur avant action)
        cy.on("window:alert", () => {
            throw new Error("Faille XSS détectée")
        })

        // Injection XSS dans le formulaire avis
        cy.get('[data-cy="review-input-title"]')
            .type('<script>alert("XSS")</script>')

        cy.get('[data-cy="review-input-comment"]')
            .type('<script>alert("XSS")</script>')

        cy.get('[data-cy="review-input-rating-images"]')
            .find("img")
            //click sur la 5eme etoile
            .eq(4)
            .click()

        cy.get('[data-cy="review-submit"]')
            .click()

        // Vérification que la page reste affichée 
        cy.url()
            .should("include", "/reviews")

    })
})