import { faker } from '@faker-js/faker';

describe('UI Test Automation', () => {
  it('TC1: Verify you can navigate to Payees page using the navigation menu', () => {
    // visit the client page
    cy.forceVisit('https://www.demo.bnz.co.nz/client/'); // access the url
    cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/');

    // navigate to payees page
    cy.get('button').contains('Menu').should('be.visible').click();
    cy.get('a[class*="Button Button"]').contains('Payees').should('be.visible').click();

    // assert page
    cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/payees');
    cy.get('h1[class="CustomPage-heading"]').should('contain', 'Payees');
  });

  it('TC2: Verify you can add new payee in the Payees page', () => {
    let fullName = faker.name.fullName();

    // visit the payees page
    cy.forceVisit('https://www.demo.bnz.co.nz/client/payees');
    cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/payees');

    // api to intercept after posting the new account
    cy.intercept('POST', 'https://www.demo.bnz.co.nz/ib/api/payees').as('payees.details');

    // initiate the form
    cy.get('button[class*="Button Button"]').contains('Add').should('be.visible').click();
    cy.get('form[id="apm-form"').should('be.visible');

    // fill the information
    cy.typeValidate('input[id="ComboboxInput-apm-name"]', fullName);
    cy.typeValidate('[data-rv-value="account.bankCode"]', '01');
    cy.typeValidate('input[id="apm-branch"]', '0001');
    cy.typeValidate('input[id="apm-account"]', '0000001');
    cy.typeValidate('input[id="apm-suffix"]', '001');

    cy.typeValidate('input[id="apm-that-particulars"]', 'AucklandCoun');
    cy.typeValidate('input[id="apm-that-code"]', '662');

    // submit and wait for page to be posted
    cy.get('button[class*="js-submit Button Button"]').contains('Add').should('be.visible').and('be.enabled').click();
    cy.wait('@payees.details');

    // assert payee created
    cy.get(`div[id*="js-payee-item"]:has(p:contains("${fullName}")) p`).should('contain', fullName);
  });

  it('TC3: Verify payee name is a required field', () => {
    let fullName = faker.name.fullName();

    // visit the payees page
    cy.forceVisit('https://www.demo.bnz.co.nz/client/payees');
    cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/payees');

    // initiate the form
    cy.get('button[class*="Button Button"]').contains('Add').should('be.visible').click();
    cy.get('form[id="apm-form"').should('be.visible');

    // submit and wait for page to be posted
    cy.get('button[class*="js-submit Button Button"]').contains('Add').should('be.visible').and('be.enabled').click();
    cy.get('button[class*="js-submit Button Button"]').contains('Add').should('be.visible').and('be.enabled').click();

    // validate error
    cy.get('div[class="error-header"]').should('contain', 'A problem was found. Please correct the field highlighted below.');
    cy.get('div[class="row payee-selector-row no-bottom-border row-error"]').should('be.visible');
    cy.get('input[id="ComboboxInput-apm-name"]').should('have.attr', 'aria-label', 'Payee Name is a required field. Please complete to continue.');

    // fill the information and assert no errors
    cy.typeValidate('input[id="ComboboxInput-apm-name"]', fullName);
    cy.get('div[class="error-header"]').should('not.exist');
    cy.get('div[class="row payee-selector-row no-bottom-border row-error"]').should('not.exist');
    cy.get('input[id="ComboboxInput-apm-name"]').should(
      'not.have.attr',
      'aria-label',
      'Payee Name is a required field. Please complete to continue.'
    );
  });

  it('TC4: Verify that payees can be sorted by name', () => {
    let fullName = faker.name.fullName();

    // visit the payees page
    cy.forceVisit('https://www.demo.bnz.co.nz/client/payees');
    cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/payees');

    // api to intercept after posting the new account
    cy.intercept('POST', 'https://www.demo.bnz.co.nz/ib/api/payees').as('payees.details');

    // initiate the form
    cy.get('button[class*="Button Button"]').contains('Add').should('be.visible').click();
    cy.get('form[id="apm-form"').should('be.visible');

    // fill the information
    cy.typeValidate('input[id="ComboboxInput-apm-name"]', fullName);
    cy.typeValidate('[data-rv-value="account.bankCode"]', '01');
    cy.typeValidate('input[id="apm-branch"]', '0001');
    cy.typeValidate('input[id="apm-account"]', '0000001');
    cy.typeValidate('input[id="apm-suffix"]', '001');

    cy.typeValidate('input[id="apm-that-particulars"]', 'AucklandCoun');
    cy.typeValidate('input[id="apm-that-code"]', '662');

    // submit and wait for page to be posted
    cy.get('button[class*="js-submit Button Button"]').contains('Add').should('be.visible').and('be.enabled').click();
    cy.wait('@payees.details');

    // assert payee created
    cy.get(`div[id*="js-payee-item"]:has(p:contains("${fullName}")) p`).should('contain', fullName);

    // assert sort in ascending order
    cy.get('ul[class="List List--border"] li').then((items) => {
      const unsortedItems = items.map((index, html) => Cypress.$(html).text()).get();
      const sortedItems = unsortedItems.slice().sort();
      expect(unsortedItems, 'Items are sorted').to.deep.equal(sortedItems);
    });

    // click descending order
    cy.get('h3[class*="js-payee-name-column"]').click();
    cy.get('h3[class*="js-payee-name-column"]').within(() => {
      cy.get('svg').should('have.attr', 'class', 'Icon IconChevronUpSolid ');
    });

    // assert sort in descending
    cy.get('ul[class="List List--border"] li').then((items) => {
      const unsortedItems = items.map((index, html) => Cypress.$(html).text()).get();
      let sortedItems = unsortedItems.slice().sort();
      sortedItems = sortedItems.reverse();
      expect(unsortedItems, 'Items are sorted').to.deep.equal(sortedItems);
    });
  });

  Cypress._.times(3, (i) => {
    it(`[${i + 1}/3] TC5: Navigate to Payments page`, { retries: { runMode: 2, openMode: 2 } }, () => {
      cy.intercept('POST', '/ib/api/accounts/*/payments').as('posted.payments');

      // visit the client page
      cy.forceVisit('https://www.demo.bnz.co.nz/client/'); // access the url
      cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/');

      // navigate to payees page
      cy.get('button').contains('Menu').should('be.visible').click();
      cy.get('button[class*="Button Button"]').contains('Pay or transfer').should('be.visible').click();

      // assert page
      cy.url().should('equal', 'https://www.demo.bnz.co.nz/client/payments');
      cy.get('div[class*="ReactModal__Content"][role="dialog"]')
        .should('be.visible')
        .within(() => {
          // select everyday account
          cy.get('button').contains('Choose account').should('be.visible').click();
          cy.get('ul[class*="list"]')
            .should('be.visible')
            .within(() => {
              cy.get('li button:has(p:contains("Everyday")) p[class*="balance"]')
                .invoke('text')
                .then((r) => Cypress.env('everydayAccount', r.replace('$', '').replace(' Avl.', '').replace(',', '')));
              cy.get('li button:has(p:contains("Everyday"))').click();
            });

          // select bills account
          cy.get('button').contains('Choose account, payee, or someone new').should('be.visible').click();
          cy.get('ul[class*="tabList"]')
            .should('be.visible')
            .within(() => {
              cy.get('li:contains("Accounts")').click();
            });

          cy.get('ul[class*="list"]')
            .should('be.visible')
            .within(() => {
              cy.get('li button:has(p:contains("Bills")) p[class*="balance"]')
                .invoke('text')
                .then((r) => Cypress.env('billsAccount', r.replace('$', '').replace(' Avl.', '').replace(',')));
              cy.get('li button:has(p:contains("Bills"))').click();
            });

          cy.typeValidate('input[data-monitoring-label="Transfer Form Amount"]', '500');
          cy.wait('@posted.payments');
        })
        .then(() => {
          cy.get('span').contains('Transfer successful').should('be.visible');

          // assert everyday account value
          cy.get('div[class="account-info"]:has(h3:contains("Everyday")) span[class="account-balance"]')
            .invoke('text')
            .then((updatedValue) => {
              cy.expect(parseFloat(updatedValue.replace(',', ''))).to.equals(parseFloat(Cypress.env('everydayAccount')) - 500);
            });

          // assert everyday bill value
          cy.get('div[class="account-info"]:has(h3:contains("Bills")) span[class="account-balance"]')
            .invoke('text')
            .then((updatedValue) => {
              cy.expect(parseFloat(updatedValue.replace(',', ''))).to.equals(parseFloat(Cypress.env('billsAccount')) + 500);
            });
        });
    });
  });
});
