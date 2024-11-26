# Cypress testing
Cypress is a javascript dependency that allows for automated testing in browser (similarly to Selenium).
It can by open by running `npx Cypress open` in the frontend directory.

It is the most beneficial from the application standpoint to add end-to-end tests that verify all the software layers.
End-to-end tests for Szakal are defined in [e2e](../cypress/e2e). I strongly encourage any contributors to add end-to-end
tests when working on any features. Docs about how to write tests in Cypress are available
[here](https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test).