it('Add company auto refresh', function () {
    cy.refreshDb()
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