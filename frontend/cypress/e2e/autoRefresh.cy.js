describe("Auto refresh on adding and modifying companies and contact journeys", () => {
    afterEach(() => {
        cy.refreshDb();
    })

    it("should auto refresh after starting new contact journey with Company 43", () => {
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`)

        cy.getByTestId("items-per-page-50")
            .click();

        cy.getByTestId("journey-table")
            .children("tr")
            .first()
            .children('td')
            .first()
            .contains("Company 01")
            .then(async () => {
                const jwtToken = window.localStorage.getItem("accessToken");

                await new Promise(r => setTimeout(r, 1000));

                await cy.request({
                    method: "POST", url: `http://localhost:8080/api/journeys`, headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    body: {
                        user: "c13f6b7a-af82-409d-8910-c71f82ee8aa7",
                        company: "05bb06fe-37a6-493e-8925-1f63992ddf23",
                        campaign: "3646865f-dbfd-4823-9641-5b5c1d74f85b"
                    }
                })

                cy.getByTestId("journey-table")
                    .children("tr")
                    .eq(42)
                    .children('td')
                    .first()
                    .contains("Company 43")

            })
    })

    it("should auto refresh after adding Company 00", () => {
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`)

        cy.getByTestId("company-table")
            .children("tr")
            .first()
            .children('td')
            .first()
            .contains("Company 01")
            .then(async () => {
                const jwtToken = window.localStorage.getItem("accessToken");

                await new Promise(r => setTimeout(r, 1000));

                await cy.request({
                    method: "POST", url: `http://localhost:8080/api/companies`, headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    body: {
                        name: "Company 00",
                        phone: "123456789",
                        email: "email@emgai.com"
                    }
                })

                cy.getByTestId("company-table")
                    .children("tr")
                    .first()
                    .children('td')
                    .first()
                    .contains("Company 00")
            })
    })

    it("should auto refresh after modifying Company 01", () => {
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies/19327774-cc15-4fa4-9456-d26ea6809dd3`)

        cy.getByTestId("cypress-company-name")
            .should("have.value", "Company 01")
        cy.getByTestId("cypress-company-email")
            .should("have.value", "test@email.com")
        cy.getByTestId("cypress-company-phone")
            .should("have.value", "")
        cy.getByTestId("cypress-company-website")
            .should("have.value", "test.com")
        cy.getByTestId("cypress-company-city")
            .should("have.value", "City")
        cy.getByTestId("cypress-company-street")
            .should("have.value", "Street")
        cy.getByTestId("cypress-company-street-number")
            .should("have.value", "5")
        cy.getByTestId("cypress-company-postal-code")
            .should("have.value", "69-420")
            .then(async () => {
                const jwtToken = window.localStorage.getItem("accessToken");

                await new Promise(r => setTimeout(r, 1000));

                await cy.request({
                    method: "PUT", url: `http://localhost:8080/api/companies/19327774-cc15-4fa4-9456-d26ea6809dd3`,
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    body: {
                        name: "IAESTE",
                        address: {
                            "street": "Reymonta",
                            "city": "Krakow",
                            "streetNumber": "69",
                            "postalCode": "30-132"
                        },
                        phone: "+481235543543",
                        fax: "+4843243242",
                        www: "iaeste.pl",
                        email: "company@email.com",
                        categories: [
                            "330602a4-d6e9-44d6-90f6-b12c6e888825"
                        ]
                    }
                })

                cy.getByTestId("cypress-company-name")
                    .should("have.value", "IAESTE")
                cy.getByTestId("cypress-company-email")
                    .should("have.value", "company@email.com")
                cy.getByTestId("cypress-company-phone")
                    .should("have.value", "+481235543543")
                cy.getByTestId("cypress-company-website")
                    .should("have.value", "iaeste.pl")
                cy.getByTestId("cypress-company-city")
                    .should("have.value", "Krakow")
                cy.getByTestId("cypress-company-street")
                    .should("have.value", "Reymonta")
                cy.getByTestId("cypress-company-street-number")
                    .should("have.value", "69")
                cy.getByTestId("cypress-company-postal-code")
                    .should("have.value", "30-132")

            });
    })

    it("should auto refresh after modifying journey", () => {
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6`)

        cy.getByTestId("cypress-journey-comments")
            .children()
            .should("have.length", 0)
        cy.getByTestId("cypress-journey-tab-header")
            .should("not.contain", "Zakończony")
        cy.getByTestId("cypress-journey-events")
            .children()
            .should("have.length", 1)
            .then(async () => {
                const jwtToken = window.localStorage.getItem("accessToken");

                await new Promise(r => setTimeout(r, 1000));

                await cy.request({
                    method: "POST",
                    url: `http://localhost:8080/api/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6/events`,
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    body: {
                        "user": "c13f6b7a-af82-409d-8910-c71f82ee8aa7",
                        "contactJourney": "04ef0a68-51dc-45d8-8e69-9df65b8e01b6",
                        "description": "They are not interested",
                        "contactStatus": "NOT_INTERESTED"
                    }
                })

                cy.getByTestId("cypress-journey-events")
                    .children()
                    .should("have.length", 2);

            })
            .then(async () => {
                const jwtToken = window.localStorage.getItem("accessToken");

                await new Promise(r => setTimeout(r, 1000));

                await cy.request({
                    method: "POST",
                    url: `http://localhost:8080/api/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6/comments`,
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    body: {
                        "comment": "It's not going well",
                        "user": "c13f6b7a-af82-409d-8910-c71f82ee8aa7"
                    }
                })

                cy.getByTestId("cypress-journey-comments")
                    .children()
                    .should("have.length", 1);

            })
            .then(async () => {
                const jwtToken = window.localStorage.getItem("accessToken");

                await new Promise(r => setTimeout(r, 1000));

                await cy.request({
                    method: "PUT",
                    url: `http://localhost:8080/api/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6/finish`,
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                })

                cy.getByTestId("cypress-journey-tab-header")
                    .should("contain", "Zakończony")
            });
    })
})