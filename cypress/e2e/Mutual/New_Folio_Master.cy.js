import '../../support/commands';

describe('New Folio Master Report', () => {

  beforeEach(() => {
    cy.loginWithSession(); // restores or creates session
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  const baseUrl = "https://wealthelite.in/MutualFund/folio-master/show-folio-master-filter";
  const clientName = 'Abhishek Singh Parihar';
  const familyName = 'Abhishek Singh Parihar';


  // ✅ Test Case 1 — Client, Equity, Manually
  it('TC_01:Generate Folio Master report with Client', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);


    cy.intercept('POST', '/MutualFund/folio-master/show-folio-master-report').as('show-folio-master-report');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@show-folio-master-report').its('response.statusCode').should('eq', 200);

    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', clientName);
  });

  
 // ✅ Test Case 2 — Familywise folio Master Report
  it('TC_02: Generate Folio Master report with Family', () => {
    cy.visit(baseUrl);
    cy.get('select[name="selectViewBy"]').select('Client');

    cy.get('input[placeholder="Search client"]').type(clientName);
    cy.get('#loadClient > li').contains(clientName).click();
    cy.wait(3000);


    cy.intercept('POST', '/MutualFund/folio-master/show-folio-master-report').as('show-folio-master-report');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@show-folio-master-report').its('response.statusCode').should('eq', 200);
    
    cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)').should('contain', familyName);
  });
  
});