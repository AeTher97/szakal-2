it('Change journeys per page', function () {
    cy.login();
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`)

    cy.getByTestId("journey-table")
        .children()
        .should("have.length", 10);

    cy.getByTestId("pagination-pages-container")
        .children()
        .should("have.length", 5);

    cy.getByTestId("items-per-page-20")
        .click();

    cy.getByTestId("journey-table")
        .children()
        .should("have.length", 20);

    cy.getByTestId("pagination-pages-container")
        .children()
        .should("have.length", 3);

    cy.getByTestId("items-per-page-50")
        .click();

    cy.getByTestId("journey-table")
        .children()
        .should("have.length", 42);

    cy.get('[data-testid="pagination-pages-container"]')
        .should("not.exist");

})