import '../../support/commands';

describe('New AUM Growth Report' , () => {

    beforeEach(() => {
        cy.loginWithSession(); // restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/aum-growth/aum-growth-report";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';


    // ✅ Test Case 1 — Generate AUM Growth Reports (Financial Year Any)
    it('TC_01:Generate AUM Growth Reports (Financial Year Any) ', () => {
        cy.visit(baseUrl);
        cy.wait(1000);
        cy.get('#noOfMonth').select('2024-2025');

        // cy.get('.modal-body > .btn').click()

        cy.intercept('POST', '/MutualFund/aum-growth/show-aum-report-data').as('show-aum-report-data');

        cy.contains('button', 'Show').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@show-aum-report-data').its('response.statusCode').should('eq', 200);

        // Example: validate the label for March 2025 exists
        cy.get('svg text')
            .contains('Mar, 2025')
            .should('exist');
    });


    // ✅ Test Case 1 — Generate AUM Growth Reports (Last 5 years)
    it('TC_01:Generate AUM Growth Reports (Last 5 years) ', () => {
        cy.visit(baseUrl);
        cy.wait(1000);
        cy.get('#noOfMonth').select('5YEAR');

        // cy.get('.modal-body > .btn').click()

        cy.intercept('POST', '/MutualFund/aum-growth/show-aum-report-data').as('show-aum-report-data');

        cy.contains('button', 'Show').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@show-aum-report-data').its('response.statusCode').should('eq', 200);

        // Example: validate the label for March 2025 exists
        cy.get('svg text')
            .contains('AUM Growth Report Year Wise')
            .should('exist');
    });

});