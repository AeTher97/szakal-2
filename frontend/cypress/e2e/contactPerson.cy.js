describe('Add, Edit and Remove Contact Person also check for this Person events', () => {
    beforeEach(() => {
        cy.refreshDb();
        cy.login();
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`);
    });

    it('should add, edit, and then remove a contact person', () => {
        cy.getByTestId("company-table").contains("Company 01").click();

        // Add contact person
        cy.getByTestId('add-contact-person-button').click();
        cy.getByTestId('contact-person-name-input').type('John Doe{enter}');
        cy.getByTestId('contact-person-list').should('contain', 'John Doe');

        // Edit contact person
        cy.contains('[data-testid="contact-person-list"]', 'John Doe')
            .find('[data-testid="edit-contact-person-button"]')
            .click();
        cy.getByTestId('contact-person-name-input').clear().type('Jane Doe{enter}');
        cy.getByTestId('contact-person-list').should('contain', 'Jane Doe');

        // Remove contact person
        cy.contains('[data-testid="contact-person-list"]', 'Jane Doe')
            .find('[data-testid="delete-contact-person-button"]')
            .click();
        cy.get('button').contains('Tak').click();

        // Check if the contact person was removed
        cy.getByTestId('contact-person-list').should('not.contain', 'John Doe');
        cy.getByTestId('contact-person-list').should('not.contain', 'Jane Doe');
    });

    it('should add a contact person, add them to a journey event, delete the contact person, and verify removal from events', () => {
        cy.getByTestId("company-table").contains("Company 01").click();

        // Add contact person
        cy.getByTestId('add-contact-person-button').click();
        cy.getByTestId('contact-person-name-input').type('John Doe{enter}');
        cy.getByTestId('contact-person-list').should('contain', 'John Doe');

        // Add contact event
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`);
        cy.getByTestId("journey-table").contains("Company 01").click();
        cy.getByTestId('event-type').click();
        cy.get('li').contains('Barter').click();
        cy.getByTestId('event-contact-person').click();
        cy.get('li').contains('John Doe').click();
        cy.getByTestId('event-description').type('Test event');
        cy.getByTestId('event-add-button').click();

        //Delete contact Person
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`);
        cy.getByTestId("company-table").contains("Company 01").click();
        cy.contains('[data-testid="contact-person-list"]', 'John Doe')
            .find('[data-testid="delete-contact-person-button"]')
            .click();
        cy.get('button').contains('Tak').click();
        cy.getByTestId('contact-person-list').should('not.contain', 'John Doe');

        // Check if the contact person was removed from the event
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`);
        cy.getByTestId("journey-table").contains("Company 01").click();
        cy.get('body').contains('John Doe').should('not.exist');
    });
});