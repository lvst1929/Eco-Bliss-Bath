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
            expect(response.body).to.have.property("code", 401)
            expect(response.body).to.have.property("message", "JWT Token not found")

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

        }).then((response) => {

            expect(response.status).to.eq(401)
            expect(response.body).to.have.property("code", 401)
            expect(response.body).to.have.property("message", "Invalid credentials.")

        })


    })

})


it("doit retourner la fiche du produit", () => {
    cy.request({
        method: "GET",
        url: "http://localhost:8081/products/3"

    }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property("id", 3)
        expect(response.body).to.have.property("name", "Sentiments printaniers")
        expect(response.body).to.have.property("availableStock", -8)
        expect(response.body).to.have.property("price", 60)
        expect(response.body).to.have.property("picture", "https://cdn.pixabay.com/photo/2020/02/08/10/35/soap-4829708_960_720.jpg")
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
                expect(response.body).to.have.property("token")
                expect(response.body.token).to.not.be.empty
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
            expect(response.body).to.have.property("id")
            expect(response.body).to.have.property("firstname")
            expect(response.body).to.have.property("lastname")
            expect(response.body).to.have.property("orderLines")
            expect(response.body.orderLines).to.be.an("array")
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

            //vérif de la structure du panier
            expect(response.body).to.have.property("id")
            expect(response.body).to.have.property("firstname")
            expect(response.body).to.have.property("lastname")
            expect(response.body).to.have.property("orderLines")

            // Vérif que orderLines est un tableau
            expect(response.body.orderLines).to.be.an("array")

            // Vérif du produit ajouté
            expect(response.body.orderLines[0].product)
                .to.have.property("id", 3)

            // Vérif de la quantité ajoutée
            expect(response.body.orderLines[0])
                .to.have.property("quantity", 2)
        })

    })

    it("doit empêcher l'ajout d'un produit en rupture de stock", () => {
        cy.request({
            method: "PUT",
            url: "http://localhost:8081/orders/add",
            body: {
                "product": 3,
                "quantity": 18
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
            expect(response.body).to.have.property("id")
            expect(response.body).to.have.property("title", "string")
            expect(response.body).to.have.property("comment", "string")
            expect(response.body).to.have.property("rating", 5)

            //vérifier que l’avis créé doit appartenir à test2@test.fr
            expect(response.body).to.have.property("author")
            expect(response.body.author)
                .to.have.property("email", "test2@test.fr")

        })
    })

})
