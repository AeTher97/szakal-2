describe('Search users', () => {
    beforeEach(() => {
        cy.refreshDb();
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/users`);
    });

    it("should search for users named Admin", () => {
        cy.getByTestId("search-name").type("Admin{enter}");
        cy.getByTestId("users-table").should('contain', 'Admin Admin');
        cy.getByTestId("users-table").should('not.contain', 'Test One');
        cy.getByTestId("search-name").clear().type("{enter}");
    });

    it("should search for users with Caller role", () => {
        cy.getByTestId("search-role").click();
        cy.get('[data-testid="role-option-Caller"]').click();
        cy.getByTestId("users-table").should('contain', 'Test One');
        cy.getByTestId("users-table").should('not.contain', 'Admin Admin');
    });
});