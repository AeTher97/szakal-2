describe("Validate that release notes are displayed on Szakal open", () => {

    it("should display release notes on homepage", () => {
        localStorage.setItem("releaseNotesVersion", "enabled");

        cy.login(false);
        cy.visit(`http://${Cypress.env("baseUrl")}/secure/home`);

        cy.getByTestId("release-notes-dialog").contains("Szakal")
    })
})