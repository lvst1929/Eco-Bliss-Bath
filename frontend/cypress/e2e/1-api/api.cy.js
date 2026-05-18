//pour les requêtes nécessitant une connexion préalable utiliser beforeEach
//séparer les requêtes avec et sans authentification
//préparer les assertions "vérifications"

describe("Appels API sans authentification", () => {
    it("doit refuser l'accès au panier sans connexion", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.eq(401)

        })
    })

    it("doit retourner 401 pour un user inconnu", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/login",
            failOnStatusCode: false,
            body: {
                username: "fauxuser@faux.fr",
                password: "fauxuser",
            }

        })

    })

    it("doit refuser l'accès au panier sans connexion", () => {

        cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.eq(401)

        })

    })


    it("doit retourner la fiche du produit", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:8081/products/3"

        }).then((response) => {
            expect(response.status).to.eq(200)

        })
    })
})

describe("appels API avec authentification", () => {
    let token
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/login",
            body: {
                username: "test2@test.fr",
                password: "testtest"
            }
        })
            .then((response) => {
                token = response.body.token
                expect(response.status).to.eq(200)
            })

    })


    it("doit retourner la liste des produits qui sont dans le panier", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    })


    it("doit ajouter un produit disponible au panier", () => {
        cy.request({
            method: "PUT",
            url: "http://localhost:8081/orders/add",
            body: {
                "product": 3,
                "quantity": 2
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        }).then((response) => {
            expect(response.status).to.eq(200)
        })

    })

    it("doit empêcher l'ajout d'un produit en rupture de stock", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/orders/add",
            body: {
                "product": 3,
                "quantity": 3
            },
            headers: {
                Authorization: `Bearer ${token}`
            },
            failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.eq(405)

        })
    })



    it("doit ajouter un avis", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/reviews",
            body:
            {
                "title": "string",
                "comment": "string",
                "rating": 5
            },
            headers: {
                Authorization: `Bearer ${token}`
            }

        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    })

})
