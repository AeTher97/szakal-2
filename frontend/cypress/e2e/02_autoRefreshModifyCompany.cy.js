it('Add company auto refresh', function () {
    cy.refreshDb()
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
});