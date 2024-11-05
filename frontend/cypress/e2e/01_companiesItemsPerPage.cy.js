it('Change companies per page', function () {
    cy.login();
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`)

    cy.getByTestId("company-table")
        .children()
        .should("have.length", 10);

    cy.getByTestId("pagination-pages-container")
        .children()
        .should("have.length", 6);

    cy.getByTestId("items-per-page-20")
        .click();

    cy.getByTestId("company-table")
        .children()
        .should("have.length", 20);

    cy.getByTestId("pagination-pages-container")
        .children()
        .should("have.length", 3);

    cy.getByTestId("items-per-page-50")
        .click();

    cy.getByTestId("company-table")
        .children()
        .should("have.length", 50);

    cy.getByTestId("pagination-pages-container")
        .children()
        .should("have.length", 2);

})