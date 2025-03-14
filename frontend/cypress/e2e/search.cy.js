describe("Search through list of companies and contact journeys", () => {

    const checkCompaniesLength = (length) => {
        cy.getByTestId("company-table")
            .children()
            .should("have.length", length);
    }

    const checkJourneysLength = (length) => {
        cy.getByTestId("journey-table")
            .children()
            .should("have.length", length);
    }

    it("should search through list of companies", () => {
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

    it("should search through list of journeys", () => {
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
})