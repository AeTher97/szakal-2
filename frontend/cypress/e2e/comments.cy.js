describe('Comments Functionality', () => {
    beforeEach(() => {
        cy.refreshDb();
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`);
    });

    it('should add a comment', () => {
        cy.getByTestId("journey-table").contains("Company 01").click();

        cy.getByTestId('add-comment-textarea').type('This is a test comment');
        cy.getByTestId('add-comment-button').click();

        cy.getByTestId('cypress-journey-comments').should('contain', 'This is a test comment');
    });

    it('should add and edit a comment', () => {
        cy.getByTestId("journey-table").contains("Company 01").click();

        cy.getByTestId('add-comment-textarea').type('This is a test comment');
        cy.getByTestId('add-comment-button').click();

        cy.getByTestId('edit-comment-link').click();
        cy.getByTestId('edit-comment-textarea').type('{selectAll}{backspace}This is an edited test comment');
        cy.getByTestId('save-comment-button').click();

        cy.getByTestId('cypress-journey-comments').should('not.contain', 'This is a test comment');
        cy.getByTestId('cypress-journey-comments').should('contain', 'This is an edited test comment');
    });
});
