it('Search journeys', function () {
    cy.login();
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`)
    cy.getByTestId("items-per-page-50")
        .click();

    const searchButtonId = "journey-search-button";
    const companyNameField = cy.getByTestId("journey-search-company-name");
    const statusFieldName = "journey-search-status"
    const detailedStatusFieldName = "journey-search-detailed-status"
    const userNameField = cy.getByTestId("journey-search-user-name");
    const contactEventTextField = cy.getByTestId("journey-search-contact-event-text");

    companyNameField.type("Company 05{enter}")

    cy.getByTestId("journey-table").children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 05")

    companyNameField.clear().type("{enter}")

    cy.clickSelectField(statusFieldName, "in-progress", searchButtonId);
    checkJourneysLength(40)
    cy.clickSelectField(statusFieldName, "finished", searchButtonId);
    checkJourneysLength(2)
    cy.clickSelectField(statusFieldName, "all", searchButtonId);


    cy.clickSelectField(detailedStatusFieldName, "WAITING_FOR_RESPONSE", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "CALL_LATER", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "NOT_INTERESTED", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "NOT_PICKING_UP", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "UNABLE_TO_CONNECT", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "BARTER", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "SPONSOR", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "TRAINING", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "DIFFERENT_FORM_PARTNERSHIP", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "CALL_NEXT_YEAR", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "INTERNSHIP", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "I_HAVE_TO_CONTACT_COMPANY", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "COMPANY_WILL_REACH_OUT", searchButtonId);
    checkJourneysLength(1)
    cy.clickSelectField(detailedStatusFieldName, "all", searchButtonId);

    userNameField.type("Admin Admin{enter}")

    checkJourneysLength(29)

    userNameField.clear().type("test1@szakal.org{enter}")

    checkJourneysLength(12)

    userNameField.clear();

    contactEventTextField.type("Waiting{enter}")
    checkJourneysLength(1)
    contactEventTextField.clear().type("Barter{enter}")
    checkJourneysLength(1)


    contactEventTextField.clear().type("Barter{enter}")
    userNameField.type("admin admin")
    cy.clickSelectField(detailedStatusFieldName, "BARTER", searchButtonId);
    cy.clickSelectField(statusFieldName, "in-progress", searchButtonId);
    companyNameField.type("Company 04{enter}")
    checkJourneysLength(1)


})

const checkJourneysLength = (length) => {
    cy.getByTestId("journey-table")
        .children()
        .should("have.length", length);
}