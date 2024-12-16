describe('AddCompanyDialog Validation', () => {
    beforeEach(() => {
        cy.login(); // Assuming you have a custom command for logging in
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`);
        cy.getByTestId('add-company-button').click(); // Open the AddCompanyDialog
    });

    it('should show validation errors for empty required fields', () => {
        cy.get('form').first().submit();
        cy.getByTestId('name-error').should('contain', 'This field is required');
    });

    it('should show validation error for very long company name', () => {
        const longCompanyName = 'A'.repeat(256);
        cy.getByTestId('name-input').type(longCompanyName);
        cy.get('form').first().submit();
        cy.getByTestId('name-error').should('contain', 'Maksymalna liczba znaków to 255');
    });
});