//ajout d'un produit au panier une fois connecté

describe("Scénario ajout produit au panier", () => {

    beforeEach(() => {
        cy.login()
    })


    it("doit empêcher l'utilisateur d'ajouter un produit en rupture de stock au panier", () => {
        cy.visit("http://localhost:4200/#/products/3")

        cy.get('[data-cy="detail-product-add"]')
            .click()

        cy.get('[data-cy="nav-link-cart"]')
            .click()

        cy.contains("Sentiments printaniers").should("not.exist")
    })


    it("doit empêcher l'utilisateur d'ajouter une quantité supérieure à 20 au panier", () => {
        cy.intercept("GET", "http://localhost:8081/orders").as("getOrders")

        cy.visit("http://localhost:4200/#/products/10")
        cy.url().should("include", "/products/10")

        // Attendre que le bouton soit bien disponible avant d'interagir
        cy.get('[data-cy="detail-product-add"]').should("be.visible").and("not.be.disabled")

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("21")
            .should("have.value", "21")

        cy.get('[data-cy="detail-product-add"]').click()

        cy.get('[data-cy="nav-link-cart"]').click()
        cy.url().should("include", "/cart")

        cy.wait("@getOrders").then((interception) => {
            const orderLines = interception.response.body.orderLines

            const productLine = orderLines.find((line) => {
                return line.product.name === "Aurore boréale"
            })

            expect(productLine).to.not.exist
        })
    })

    it("doit empêcher l'utilisateur d'ajouter une quantité négative au panier", () => {
        // pas d'interception car quand la quantité est négative, le front ne fait pas du tout d'appel à l'API
        // Il bloque l'action côté front-end avant même d'envoyer la requête

        cy.visit("http://localhost:4200/#/products/9")
        cy.url().should("include", "/products/9")

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("-1")
            .should("have.value", "-1")

        cy.get('[data-cy="detail-product-add"]').click()

        cy.get('[data-cy="nav-link-cart"]').click()

        cy.get("body").then(($body) => {
            expect($body.text()).not.to.contain("Mousse de rêve")
        })
    })


    it("doit ajouter un produit et vérifier que le contenu du panier correspond à l'ajout puis vérifier le stock", () => {
        let initialStock

        // Anomalie API : l'endpoint /orders/add utilise PUT au lieu de POST
        cy.intercept("PUT", "http://localhost:8081/orders/add").as("addToCart")

        cy.visit("http://localhost:4200/#/products/5")
        cy.url().should("include", "/products/5")

        // Récupérer le stock initial
        cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")
            .invoke("text")
            .should("match", /\d+/)
            .then((stockText) => {
                initialStock = parseInt(stockText.match(/\d+/)[0])
                expect(initialStock).to.be.greaterThan(0)
            })

        // Ajouter le produit et attendre la réponse API
        cy.get('[data-cy="detail-product-add"]').click()
        cy.wait("@addToCart")

        // Vérifier le panier sur la bonne ligne
        cy.url().should("include", "/cart")

        cy.contains('[data-cy="cart-line-name"]', "Poussière de lune")
            .should("be.visible")

        cy.contains('[data-cy="cart-line-name"]', "Poussière de lune")
            .closest('[data-cy="cart-line"]')
            .within(() => {
                cy.get('[data-cy="cart-line-quantity"]').should("have.value", "1")
                cy.get('[data-cy="cart-line-description"]').should("be.visible")
                cy.get('[data-cy="cart-line-total"]').should("be.visible")
                cy.get('[data-cy="cart-line-image"]').should("be.visible")
                cy.get('[data-cy="cart-line-delete"]').should("be.visible")
            })

        // Retour sur la fiche produit et vérification du stock décrémenté
        cy.visit("http://localhost:4200/#/products/5")
        cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")
            .invoke("text")
            .should("match", /\d+/)
            .then((newStockText) => {
                const updatedStock = parseInt(newStockText.match(/\d+/)[0])
                expect(updatedStock).to.eq(initialStock - 1)
            })
    })

    it("doit ajouter un produit au panier via l'interface et vérifier le stock via l'API", () => {
        let initialStock

        // Anomalie API : l'endpoint /orders/add utilise PUT au lieu de POST
        cy.intercept("PUT", "http://localhost:8081/orders/add").as("addToCart")

        // 1. Aller sur la fiche produit et récupérer le stock via l'interface
        cy.visit("http://localhost:4200/#/products/6")
        cy.url().should("include", "/products/6")

        cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")
            .invoke("text")
            .should("match", /\d+/)
            .then((stockText) => {
                initialStock = parseInt(stockText.match(/\d+/)[0])
                expect(initialStock).to.be.greaterThan(0)
            })

        // 2. Ajouter le produit via l'interface
        cy.get('[data-cy="detail-product-add"]')
            .should("be.visible")
            .and("not.be.disabled")
            .click()

        // Attendre que l'ajout soit bien enregistré côté API
        cy.wait("@addToCart")

        // 3. Vérifier le stock décrémenté via l'API
        cy.request("GET", "http://localhost:8081/products/6")
            .then((response) => {
                const updatedStock = response.body.availableStock
                expect(updatedStock).to.eq(initialStock - 1)
            })
    })


})