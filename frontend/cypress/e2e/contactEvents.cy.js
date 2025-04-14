describe('Contact Events Functionality', () => {
    beforeEach(() => {
        cy.refreshDb();
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`);
    });

    it('should add a contact event', () => {
        cy.getByTestId("journey-table").contains("Company 01").click();

        cy.getByTestId('event-type').click();
        cy.get('li').contains('Barter').click();
        cy.getByTestId('event-contact-person').click();
        cy.get('li').contains('Osoba kontaktowa (może być puste)').click();
        cy.getByTestId('event-description').type('Test event');
        cy.getByTestId('event-add-button').click();

        cy.get('body').should('contain', 'Test event');
    });

    it('should edit a contact event', () => {
        cy.getByTestId("journey-table").contains("Company 01").click();

        cy.getByTestId('edit-contact-event-link').click();
        cy.getByTestId('edit-contact-event-description').type('{selectAll}{backspace}Edited test event');
        cy.getByTestId('save-contact-event-link').click();

        cy.get('body').contains('Waiting').should('not.exist');
        cy.get('body').should('contain', 'Edited test event');
    });
});
