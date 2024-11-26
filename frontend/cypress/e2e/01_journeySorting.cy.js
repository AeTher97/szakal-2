it('Sort journeys', function () {
    cy.login();
    cy.viewport(1500, 900)
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys`)

    cy.getByTestId("items-per-page-50")
        .click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 01")

    cy.getByTestId("journeys-sort-by-company-name").click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .first()
        .contains("Company 42")

    cy.getByTestId("journeys-sort-by-user-name").click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .eq(1)
        .contains("Admin Admin")

    cy.getByTestId("journeys-sort-by-user-name").click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .eq(1)
        .contains("Test One")

    cy.getByTestId("journeys-sort-by-start-date").click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .eq(2)
        .contains("7.11.2024")

    cy.getByTestId("journeys-sort-by-start-date").click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .eq(2)
        .contains("9.11.2024")

    cy.getByTestId("journeys-sort-by-last-interaction-date").click();

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .eq(3)
        .contains("7.11.2024")

    cy.getByTestId("journeys-sort-by-last-interaction-date").click()

    cy.getByTestId("journey-table")
        .children("tr")
        .first()
        .children('td')
        .eq(3)
        .contains("26.11.2024")

    cy.getByTestId("journeys-sort-by-status").click()

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(0)
        .children('td')
        .children().eq(4).contains("Barter");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(1)
        .children('td')
        .children().eq(4).contains("Firma ma się skontaktować");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(2)
        .children('td')
        .children().eq(4).contains("Inna forma współpracy");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(3)
        .children('td')
        .children().eq(4).contains("Mam się skontaktować z firmą");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(4)
        .children('td')
        .children().eq(4).contains("Nie można się połączyć");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(5)
        .children('td')
        .children().eq(4).contains("Nieodebrany");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(6)
        .children('td')
        .children().eq(4).contains("Niezainteresowana");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(7)
        .children('td')
        .children().eq(4).contains("Oczekiwanie na odpowiedź");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(8)
        .children('td')
        .children().eq(4).contains("Praktyka");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(9)
        .children('td')
        .children().eq(4).contains("Przypisana");

    cy.getByTestId("journeys-sort-by-status").click()

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(0)
        .children('td')
        .children().eq(4).contains("Zadzwonić w przyszłym roku");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(1)
        .children('td')
        .children().eq(4).contains("Zadzwonić później");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(2)
        .children('td')
        .children().eq(4).contains("Szkolenie");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(3)
        .children('td')
        .children().eq(4).contains("Sponsor");

    cy.getByTestId("journey-table")
        .children("tr")
        .eq(4)
        .children('td')
        .children().eq(4).contains("Przypisana");
})