describe('Login', () => {
    const username = "administrator@szakal.org"
    const password = "administrator"

    it('passes', () => {
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
            .click();
        cy.getByTestId("user-avatar")
            .should("exist")
        cy.getByTestId("user-avatar")
            .children("div")
            .contains("Admin Admin")
    })
})