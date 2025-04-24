
import '../../support/commands';

describe('Between Date XIRR Report', () => {

  beforeEach(() => {
    cy.loginWithSession(); // restores or creates session
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  const baseUrl = "https://wealthelite.in/MutualFund/pl/between-date-xirr";
  const clientName = 'Abhishek Singh Parihar';
  const familyName = 'Abhishek Singh Parihar';
  const fromDate = '2020-01-01';
  const toDate = '2025-04-16';

  // ✅ Test Case 1 — Client, All Funds, Manually
  it('TC_001: Generate report with Client, All Funds, Manually', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('all');
    cy.get('#manually').check({ force: true });


    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();
    
    // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  // ✅ Test Case 2 — Client, Equity, Manually
  it('TC_002: Generate report with Client, Equity Funds, Manually', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('Equity');
    cy.get('#manually').check({ force: true });


    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  // ✅ Test Case 3 — Client, Debt, Manually
  it('TC_003: Generate report with Client, Debt Funds, Manually', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('Debt');
    cy.get('#manually').check({ force: true });


    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();
     
    // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  // ✅ Test Case 4 — Client, Hybrid, Manually
  it('TC_004: Generate report with Client, Hybrid Funds, Manually', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('Hybrid');
    cy.get('#manually').check({ force: true });


    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();
     
    // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  // ✅ Test Case 5 — Client, Sole Oriented, Manually
  it('TC_005: Generate report with Client, Sole Oriented Funds, Manually', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('sol oriented');
    cy.get('#manually').check({ force: true });


    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();
     
    // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  // ✅ Test Case 6 — Client, Other Funds, Sensex
  it('TC_006: Generate report with Client, Other Funds, Sensex', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('others');
    cy.get('#graph').check({ force: true });

    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();
    
    // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  // ✅ Test Case 7 — Family, All Funds, Manually
  it('TC_007: Generate report with Family, All Funds, Manually', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Family');
    cy.wait(2000);
    cy.get('#loadClient').contains(familyName).click();
    cy.wait(3000);

    cy.get('#fromDate').clear().type(`${fromDate}{esc}`);
    cy.get('#toDate').clear().type(`${toDate}{esc}`);

    cy.get('select[name="ftype"]').select('all');
    cy.get('#manually').check({ force: true });

    cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@xirr-report-data').its('response.statusCode').should('eq', 200);
    cy.get('.summery-inner-contaner').should('be.visible');

    // Optional: if you have family details or title you can check it here
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', familyName);
  });

});



//Extra Codes for future usage
// // import '../../support/commands';
// // describe('Asset Report and Mutual Fund Report', () => {

// //     beforeEach(() => {
// //         cy.loginWithSession(); // restores or creates session
// //     });

// //     Cypress.on('uncaught:exception', (err, runnable) => {
// //         return false; // Prevent Cypress from failing the test
// //     });

// //     // Test Case 1: ✅  Report with Client, All Funds, Manually
// //     it('Generate report with Client, All Funds Manually', () => {

// //         //for visit the url whichever you want after the login
// //         cy.visit("https://wealthelite.in/MutualFund/pl/between-date-xirr");

// //         //Select the client
// //         cy.get('select[name="selectViewBy"]').select('Client');

// //         // Select the Client Name
// //         cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
// //         cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
// //         cy.wait(3000);

// //         cy.get('#fromDate')
// //             .clear()
// //             .type('2020-01-01{esc}');

// //         //Select To Date
// //         cy.get('#toDate')
// //             .clear()
// //             .type('2025-04-16').click();

// //         //Select Fund Type
// //         cy.get('select[name="ftype"]').select('all');

// //         // ✅ Intercept and trigger report generation
// //         cy.intercept('POST', '/MutualFund/pl/xirr-report-data').as('xirr-report-data');

// //         cy.get('#btn_web').click();

// //         // ✅ Confirm report request was successful
// //         cy.wait('@xirr-report-data').then((interception) => {
// //             expect(interception.response.statusCode).to.eq(200);
// //         });
        
// //         // ✅ Confirm report Should be visible for Client
// //         cy.get('.summery-inner-contaner')
// //             .should('be.visible');

// //         // ✅ validate if report table or result appears/// Validate client name in result
// //         cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)')
// //             .should('be.visible')
// //             .and('contain', 'Abhishek Singh Parihar');

// //     });
// // });