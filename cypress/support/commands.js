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

Cypress.Commands.add("login", (username, password) => {
  cy.get("#sign-username").type(username);
  cy.wait(1000);
  cy.get("#sign-password").type(password);
  cy.get(".modal-footer").contains("Sign up").click();
  //cy.wait(2000);
});

Cypress.Commands.add("login2", (username, password) => {
  cy.get("#loginusername").type(username);
  cy.wait(1000);
  cy.get("#loginpassword").type(password);
  cy.get(".modal-footer").contains("Log in").click();
  cy.wait(4000);
});
Cypress.Commands.add("varriableAcces", (valeur) => {
  cy.wrap(valeur).as("wrapvaleur");
  cy.log(valeur);
});
