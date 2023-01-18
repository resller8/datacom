/**
 * force visit the url when the page contains redirection
 */
Cypress.Commands.add('forceVisit', (url) => {
  cy.window().then((win) => {
    return win.open(url, '_self');
  });
});

/**
 * type text and validate
 */
Cypress.Commands.add('typeValidate', (element, text) => {
  cy.get(element).should('be.visible').type(text, { force: true }).type('{enter}').should('have.value', text);
});
