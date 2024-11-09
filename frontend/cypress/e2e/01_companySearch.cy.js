it('Search companies', function () {
    cy.login();
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/companies`)
    cy.getByTestId("items-per-page-50")
        .click();

    const searchButtonId = "company-search-category-button";
    const nameField = cy.getByTestId("company-search-name");
    const alumniDescriptionField = cy.getByTestId("company-search-alumni-description");
    const alumniCommitteeField = cy.getByTestId("company-search-alumni-committee");
    const campaignField = cy.getByTestId("company-search-campaign");

    nameField.type("Company 05{enter}")

    cy.getByTestId("company-table").children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 05")

    nameField.clear().type("{enter}")

    alumniCommitteeField.type("AGH{enter}")

    checkCompaniesLength(1)

    cy.getByTestId("company-table").children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 03")

    alumniCommitteeField.clear().type("{enter}")

    alumniDescriptionField.type("MIS{enter}")

    checkCompaniesLength(1)

    cy.getByTestId("company-table").children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 03")

    alumniDescriptionField.clear().type("{enter}")

    campaignField.type("Test Campaign{enter}")

    checkCompaniesLength(42)

    cy.getByTestId("company-table").children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 01")

    campaignField.clear().type("{enter}")


    cy.clickSelectField("company-search-category", "Category 1", searchButtonId);
    checkCompaniesLength(3)
    cy.clickSelectField("company-search-category", "Wszystkie", searchButtonId);


    cy.clickSelectField("company-search-status", "taken", searchButtonId)
    checkCompaniesLength(42)
    cy.clickSelectField("company-search-status", "all", searchButtonId)


    cy.clickSelectField("company-search-status", "free", searchButtonId)
    checkCompaniesLength(9)
    cy.clickSelectField("company-search-status", "all", searchButtonId)


    cy.clickSelectField("company-search-has-alumni", "yes", searchButtonId)
    checkCompaniesLength(2)
    cy.clickSelectField("company-search-has-alumni", "all", searchButtonId)

    nameField.type("Company 03")
    alumniCommitteeField.type("AGH")
    alumniDescriptionField.type("MIS")
    campaignField.type("Test Campaign")
    cy.clickSelectField("company-search-category", "Category 1", searchButtonId);
    cy.clickSelectField("company-search-status", "taken", searchButtonId)
    cy.clickSelectField("company-search-has-alumni", "yes", searchButtonId)

    checkCompaniesLength(1)
    cy.getByTestId("company-table").children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 03")


})

const checkCompaniesLength = (length) => {
    cy.getByTestId("company-table")
        .children()
        .should("have.length", length);
}