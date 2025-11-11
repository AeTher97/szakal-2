// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (searchForAvatar = true,
                               username = "administrator@szakal.org",
                               password = "administrator",
                               name = "Admin Admin") => {

    cy.visit(`http://${Cypress.env("baseUrl")}`)
    localStorage.setItem("declinedNotifications", "true")

    cy.getByTestId("cypress-login-email")
        .should("exist")
        .type(username);
    cy.getByTestId("cypress-login-password")
        .should("exist")
        .type(password);
    cy.getByTestId("cypress-login-button")
        .should("exist")
        .click()
    cy.url().should("contain", "/secure");
    if (searchForAvatar) {
        cy.getByTestId("user-avatar")
            .should("exist")
        cy.getByTestId("user-avatar")
            .children("div")
            .contains(name)
    }
})

Cypress.Commands.add("getByTestId", (id) => {
    return cy.get(`[data-testid="${id}"]`, {timeout: 10000});
})

Cypress.Commands.add("clickSelectField", (fieldId, optionSuffix, searchButtonId) => {
    const field = cy.getByTestId(fieldId);
    const option = cy.getByTestId(`${fieldId}-${optionSuffix}`);

    field.click();
    option.click();

    if (searchButtonId) {
        const searchButton = cy.getByTestId(searchButtonId);
        searchButton.click();
    }
})

Cypress.Commands.add("refreshDb", () => {
    cy.log("Refreshing database")
    cy.exec('cd .. && bash reload-database.sh', {failOnNonZeroExit: false})
        .then(result => {
            if (result.code) {
                throw new Error(`Execution of refreshDb failed
                  Exit code: ${result.code}
                  Stdout:\n${result.stdout}
                  Stderr:\n${result.stderr}`);
            }
        })
})