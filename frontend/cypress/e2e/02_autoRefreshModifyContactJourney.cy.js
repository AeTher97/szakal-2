it('Add company auto refresh', function () {
    cy.refreshDb()
    cy.login();
    cy.visit(`http://${Cypress.env("baseUrl")}/secure/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6`)

    cy.getByTestId("cypress-journey-comments")
        .children()
        .should("have.length", 0)
    cy.getByTestId("cypress-journey-tab-header")
        .should("not.contain", "Zakończony")
    cy.getByTestId("cypress-journey-events")
        .children()
        .should("have.length", 1)
        .then(async () => {
            const jwtToken = window.localStorage.getItem("accessToken");

            await new Promise(r => setTimeout(r, 1000));

            await cy.request({
                method: "POST", url: `http://localhost:8080/api/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6/events`,
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: {
                    "user": "c13f6b7a-af82-409d-8910-c71f82ee8aa7",
                    "contactJourney": "04ef0a68-51dc-45d8-8e69-9df65b8e01b6",
                    "description": "They are not interested",
                    "contactStatus": "NOT_INTERESTED"
                }
            })

            cy.getByTestId("cypress-journey-events")
                .children()
                .should("have.length", 2);

        })
        .then(async () => {
            const jwtToken = window.localStorage.getItem("accessToken");

            await new Promise(r => setTimeout(r, 1000));

            await cy.request({
                method: "POST", url: `http://localhost:8080/api/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6/comments`,
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: {
                    "comment": "It's not going well",
                    "user": "c13f6b7a-af82-409d-8910-c71f82ee8aa7"
                }
            })

            cy.getByTestId("cypress-journey-comments")
                .children()
                .should("have.length", 1);

        })
        .then(async () => {
            const jwtToken = window.localStorage.getItem("accessToken");

            await new Promise(r => setTimeout(r, 1000));

            await cy.request({
                method: "PUT", url: `http://localhost:8080/api/journeys/04ef0a68-51dc-45d8-8e69-9df65b8e01b6/finish`,
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })

            cy.getByTestId("cypress-journey-tab-header")
                .should("contain", "Zakończony")
        });
});