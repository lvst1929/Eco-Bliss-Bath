//ajout d'un produit au panier une fois connecté

describe("Scénario ajout produit au panier", () => {
    beforeEach(() => {
        cy.login()

        cy.get('[data-cy="nav-link-cart"]').click()

        // vider le panier avant scenario
        cy.get("body").then(($body) => {
            if ($body.find('[data-cy="cart-line-delete"]').length > 0) {
                cy.get('[data-cy="cart-line-delete"]').each(($btn) => {
                    cy.wrap($btn).click()
                })
            }
        })

        // Accès au produit 5
        cy.contains("Voir les produits").click()

        cy.get('a[href="#/products/5"]').click()

        cy.url().should("include", "/products/5")
    })

    it("doit afficher la disponibilité du produit", () => {
        cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")
            .invoke("text")
            .then((stockText) => {
                const stock = parseInt(stockText.match(/\d+/)[0])
                expect(stock).to.be.greaterThan(1)
            })
    })

    it("doit gérer les limites de quantité", () => {
        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("-1")
            .should("have.value", "-1")

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("21")
            .should("have.value", "21")
    })

    it("doit ajouter un produit au panier", () => {
        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("1")
            .should("have.value", "1")

        cy.get('[data-cy="detail-product-add"]')
            .should("be.visible")
            .and("not.be.disabled")
            .click()

        cy.url().should("include", "/cart")

        cy.contains("Commande").should("be.visible")
        cy.contains("Panier").should("be.visible")

        cy.get('[data-cy="cart-line-name"]')
            .should("be.visible")
            .and("contain", "Poussière de lune")

        cy.get('[data-cy="cart-line-description"]')
            .should("be.visible")
            .and(
                "contain",
                "Essayez notre savon aujourd'hui pour une expérience de bain rafraîchissante et revitalisante."
            )

        cy.get('[data-cy="cart-line-quantity"]')
            .should("be.visible")
            .and("contain", "1")

        cy.get('[data-cy="cart-line-total"]')
            .first()
            .should("be.visible")
            .and("contain", "9,99")

        cy.get('[data-cy="cart-line-image"]')
            .should("be.visible")
            .should("have.attr", "src")
            .and(
                "include",
                "https://cdn.pixabay.com/photo/2016/07/11/15/45/soap-1509963_960_720.jpg"
            )

        cy.get('[data-cy="cart-line-delete"]').should("be.visible")

        cy.contains("Total").should("be.visible")
        cy.contains("Frais de livraison offerts").should("be.visible")

        cy.contains("Vos informations").should("be.visible")
        cy.get('[data-cy="cart-input-lastname"]').should("be.visible")
        cy.get('[data-cy="cart-input-firstname"]').should("be.visible")
        cy.get('[data-cy="cart-input-address"]').should("be.visible")
        cy.get('[data-cy="cart-input-zipcode"]').should("be.visible")
        cy.get('[data-cy="cart-input-city"]').should("be.visible")
        cy.get('[data-cy="cart-submit"]').should("be.visible")
    })

    it("doit mettre à jour le stock après ajout au panier", () => {
        let initialStock

        cy.get('[data-cy="detail-product-stock"]')
            .invoke("text")
            .then((stockText) => {
                initialStock = parseInt(stockText.match(/\d+/)[0])
                expect(initialStock).to.be.greaterThan(1)
            })

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("1")

        cy.get('[data-cy="detail-product-add"]').click()

        cy.visit("http://localhost:4200/#/products/5")

        cy.get('[data-cy="detail-product-stock"]')
            .invoke("text")
            .then((updatedStockText) => {
                const updatedStock = parseInt(updatedStockText.match(/\d+/)[0])
                expect(updatedStock).to.eq(initialStock - 1)
            })
    })
})