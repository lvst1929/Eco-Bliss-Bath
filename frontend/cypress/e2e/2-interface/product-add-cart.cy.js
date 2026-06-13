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
    })



    it("doit empêcher l'utilisateur d'ajouter un produit avec un stock négatif au panier", () => {
        // Accès au produit 3 avec stock négatif
        cy.visit("http://localhost:4200/#/products/3")
        cy.url().should("include", "/products/3")

        cy.get('[data-cy="detail-product-add"]')
            .click()

        // Vérifier que l'utilisateur reste sur la fiche produit
        cy.url().should("include", "/products/3")

    })


    it("doit empêcher l'utilisateur d'ajouter plus de 20 produits au panier", () => {
        cy.intercept("GET", "http://localhost:8081/orders").as("getOrders")

        cy.visit("http://localhost:4200/#/products/10")
        cy.url().should("include", "/products/10")

        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("21")
            .should("have.value", "21")

        cy.get('[data-cy="detail-product-add"]')
            .click()

        cy.get('[data-cy="nav-link-cart"]')
            .click()

        cy.wait("@getOrders")

        cy.get("body").should("not.contain", "Aurore boréale")
    })

    it("doit empêcher l'utilisateur d'ajouter une quantité négative au panier", () => {

        // Accès au produit 5
        cy.visit("http://localhost:4200/#/products/5")
        cy.url().should("include", "/products/5")

        // Saisir une quantité négative
        cy.get('[data-cy="detail-product-quantity"]')
            .clear()
            .type("-1")
            .should("have.value", "-1")

        // tenter l'ajout au panier
        cy.get('[data-cy="detail-product-add"]')
            .click()

        // aller vérifier le panier
        cy.get('[data-cy="nav-link-cart"]')
            .click()

        // vérifier que le produit n'a pas été ajouté
        cy.get("body").then(($body) => {
            expect($body.text()).not.to.contain("Poussière de lune")
        })
    })

    it("doit ajouter un produit et vérifier que le contenu du panier correspond à l'ajout", () => {

        cy.visit("http://localhost:4200/#/products/5")
        cy.url().should("include", "/products/5")

        cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")

        cy.get('[data-cy="detail-product-add"]')
            .click()
        cy.url().should("include", "/cart")

        //vérification de l'ajout du produit au panier
        cy.get('[data-cy="cart-line-quantity"]')
            .should("be.visible")
            .and("have.value", "1")

        cy.get('[data-cy="cart-line-name"]')
            .should("be.visible")
            .and("contain", "Poussière de lune")

        cy.get('[data-cy="cart-line-description"]')
            .should("be.visible")

        cy.get('[data-cy="cart-line-total"]')
            .first()
            .should("be.visible")


        cy.get('[data-cy="cart-line-image"]')
            .should("be.visible")


        cy.get('[data-cy="cart-line-delete"]').should("be.visible")


    })

    it("doit ajouter un produit au panier via l'API et vérifier le contenu du panier", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/login",
            body: {
                username: "test2@test.fr",
                password: "testtest"
            }
        }).then((loginResponse) => {
            const token = loginResponse.body.token

            cy.request({
                method: "POST",
                url: "http://localhost:8081/orders/add",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    product: 7,
                    quantity: 1
                }
            })

            cy.request({
                method: "GET",
                url: "http://localhost:8081/orders",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((ordersResponse) => {
                const productLine = ordersResponse.body.orderLines.find((line) => {
                    return line.product.id === 7
                })

                expect(productLine).to.exist
                expect(productLine.quantity).to.eq(1)
            })
        })
    })


})


