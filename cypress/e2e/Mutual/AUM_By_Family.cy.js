import '../../support/commands';

describe('AUM Report', () => {

  beforeEach(() => {
    cy.loginWithSession(); // restores or creates session
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  const baseUrl = "https://wealthelite.in/MutualFund/aum-master/family-aum";
  const clientName = 'Abhishek Singh Parihar';
  const familyName = 'Abhishek Singh Parihar';


  // ✅ Test Case 1 — Date: Default, ARN: All
  it('TC_01:Generate AUM Report by Families with default date and all ARN', () => {
   
    cy.visit(baseUrl);
    cy.intercept('POST', '/MutualFund/aum-master/aum-all-family').as('aum-all-family');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@aum-all-family').its('response.statusCode').should('eq', 200);

    cy.get('#familyWiseAumTable_wrapper').should('be.visible');
  });

  
  // ✅ Test Case 2 — Date: Selected, ARN: Selected
  it('TC_021:Generate AUM Reports by Families with selected date and selected ARN', () => {
     
    cy.visit(baseUrl);
    cy.get('#aumReportDate').select('2025-04-16');

    cy.get('#arnNo')
    .select('ARN-69442')
    .should('have.value', 'ARN-69442');
  

    cy.intercept('POST', '/MutualFund/aum-master/aum-all-family').as('aum-all-family');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@aum-all-family').its('response.statusCode').should('eq', 200);

    cy.get('#familyWiseAumTable_wrapper').should('be.visible');
  });

   // ✅ Test Case 3 — Date: Selected, ARN: All,Include Non Family Member AUM
   it('TC_03:Generate AUM Report  by Families with selected date and all ARN and Include Non Family Member AUM', () => {
     
    cy.visit(baseUrl);
    cy.get('#aumReportDate').select('2025-04-16');
   
    cy.intercept('POST', '/MutualFund/aum-master/aum-all-family').as('aum-all-family');
    cy.get('#btn_web').click();

     // Validate the API And the Reports Should be visible 
    cy.wait('@aum-all-family').its('response.statusCode').should('eq', 200);

    cy.get('#familyWiseAumTable_wrapper').should('be.visible');
  });
  
});