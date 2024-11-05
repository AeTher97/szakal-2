it('Sort companies', function () {
    cy.login();
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`)


    cy.getByTestId("company-table")
        .children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 01")

    cy.getByTestId("companies-sort-by-name").click();

    cy.getByTestId("company-table")
        .children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 51")
})