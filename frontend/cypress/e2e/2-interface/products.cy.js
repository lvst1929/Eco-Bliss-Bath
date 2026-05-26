//ajout d'un produit au panier une fois connecté

describe("Scénario ajout produit au panier", () => {
    before(() => {
        cy.login()

        cy.get('[data-cy="nav-link-cart"]')
            .click()

        // vider le panier avant scenario
        cy.get("body").then(($body) => {

            if ($body.find('[data-cy="cart-line-delete"]').length > 0) {

                cy.get('[data-cy="cart-line-delete"]').each(($btn) => {
                    cy.wrap($btn).click()
                })

            }

        })

    })
    it("doit ajouter un produit au panier", () => {

        // Accès aux produits
        cy.contains("Voir les produits")
            .should("be.visible")
            .and("not.be.disabled")
            .click()


        // Viser le produit 5
        cy.get('a[href="#/products/5"]')
            .click()

        cy.url().should("include", "/products/5")

        // Vérifier stock disponible
        cy.get('[data-cy="detail-product-stock"]')
            .invoke("text")
            .then((stockText) => {

                const stock = parseInt(stockText.match(/\d+/)[0])

                expect(stock).to.be.greaterThan(0)

            })

        // Vérifier et cliquer sur ajout panier
        cy.get('[data-cy="detail-product-add"]')
            .should("be.visible")
            .and("not.be.disabled")
            .click()

        // Aller au panier
        cy.get('[data-cy="nav-link-cart"]')
            .should("be.visible")
            .click()

        // Vérifier que le panier contient un produit puis vérification de la présence des champs et du formulaire pour valider le panier
        cy.url().should("include", "/cart")

        cy.contains("Commande").should("be.visible")
        cy.contains("Panier").should("be.visible")

        cy.get('[data-cy="cart-line-image"]')
            .should("be.visible")
            .should("have.attr", "src")
            .and(
                "include",
                "https://cdn.pixabay.com/photo/2016/07/11/15/45/soap-1509963_960_720.jpg"
            )

        cy.get('[data-cy="cart-line-name"]')
            .should("be.visible")
            .and("contain", "Poussière de lune")

        cy.get('[data-cy="cart-line-description"]')
            .should("be.visible")
            .should(
                "contain",
                "Essayez notre savon aujourd'hui pour une expérience de bain rafraîchissante et revitalisante."
            )
        cy.get('[data-cy="cart-line-quantity"]')
            .should("be.visible")
            .should("contain", "1")

        cy.get('[data-cy="cart-line-total"]')
            .first()
            .should("be.visible")
            .should("contain", "9,99")

        cy.get('[data-cy="cart-line-delete"]')
            .should("be.visible")

        cy.contains("Total")
            .should("be.visible")
        cy.contains("Frais de livraison offerts")
            .should("be.visible")

        cy.contains("Vos informations").should("be.visible")
        cy.get('[data-cy="cart-input-lastname"]').should("be.visible")
        cy.get('[data-cy="cart-input-firstname"]').should("be.visible")
        cy.get('[data-cy="cart-input-address"]').should("be.visible")
        cy.get('[data-cy="cart-input-zipcode"]').should("be.visible")
        cy.get('[data-cy="cart-input-city"]').should("be.visible")
        cy.get('[data-cy="cart-submit"]').should("be.visible")

    })
})