describe("Should change number of items in company and journey list", () => {

    it('should change number of items in company list', () => {
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

    });

    it('should change number of items in journey list', () => {
        cy.login();
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
})