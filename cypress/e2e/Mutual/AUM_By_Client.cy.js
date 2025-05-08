import '../../support/commands';

describe('AUM Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/aum-master/client-aum";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';


    // ✅ Test Case 1 — Date: Default, ARN: All
    it('TC_01:Generate AUM Report by Client with default date and all ARN', () => {

        cy.visit(baseUrl);
        cy.intercept('POST', '/MutualFund/aum-master/aum-all-clients').as('aum-all-clients');
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@aum-all-clients').its('response.statusCode').should('eq', 200);

        cy.get('#example_wrapper').should('be.visible');
    });


    // ✅ Test Case 2 — Date: Selected, ARN: Selected,(Folio Consolidation Mode)
    it('TC_021:Generate AUM Reports by ScheClient me with selected date and selected ARN & Folio Consolidation Mode', () => {

        cy.visit(baseUrl);
        cy.get('#aumReportDate').select('2025-04-13');

        cy.get('#arnNo')
            .select('ARN-69442')
            .should('have.value', 'ARN-69442');

        cy.get('[name="folioMode"][value="1"]').check({ force: true });

        cy.intercept('POST', '/MutualFund/aum-master/aum-all-clients').as('aum-all-clients');
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@aum-all-clients').its('response.statusCode').should('eq', 200);

        cy.get('#example_wrapper').should('be.visible');
    });

       // ✅ Test Case 3 — Date: Selected, ARN: All (Folio Split Mode)
       it('TC_03:Generate AUM Report  by Client with selected date and all ARN Folio Split Mode', () => {

        cy.visit(baseUrl);
        cy.get('#aumReportDate').select('2025-04-16');

    cy.get('[name="folioMode"][value="2"]').check({ force: true });

        cy.intercept('POST', '/MutualFund/aum-master/aum-all-clients').as('aum-all-clients');
        cy.get('#btn_web').click();

         // Validate the API And the Reports Should be visible 
        cy.wait('@aum-all-clients').its('response.statusCode').should('eq', 200);

        cy.get('#example_wrapper').should('be.visible');
      });

});