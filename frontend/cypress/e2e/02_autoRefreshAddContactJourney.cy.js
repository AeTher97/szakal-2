it('Add company auto refresh', function () {
    cy.refreshDb()
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