
import '../../support/commands';

describe('Between Date XIRR Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/systematic-investment/new-sip-and-stp-filters";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';
    const fromDate = '2020-01-01';
    const toDate = '2025-04-16';

    // ✅ Test Case 1 — Client, All ARN, All SIP
    it('TC_001: Generate report with Client,All ARN, All SIP', () => {
        cy.visit(baseUrl);

        cy.get('#fromDate')
            .invoke('val', '2024-04-01') // set value to April 1, 2024
            .trigger('change');

        cy.get('#toDate')
            .invoke('val', '2025-03-31')
            .trigger('change');

        cy.get('select[name="arnNo"]').select('all');

        cy.get('select[name="reportType"]').select('ClientWise');
        cy.get('label[for="viewallSip"]').click();


        cy.intercept('POST', '/MutualFund/systematic-investment/new-sip-report').as('new-sip-report');
        cy.get('#submitReportHere').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@new-sip-report').its('response.statusCode').should('eq', 200);

        // Example: validate the label for March 2025 exists
        cy.get('.report-page-session')
            .contains('Client Wise SIP Report')
            .should('exist');
         
    });

     // ✅ Test Case 2 — Client, All ARN, Freedom SIP
     it('TC_002: Generate report with Client,All ARN, Freedom SIP', () => {
        cy.visit(baseUrl);

        cy.get('#fromDate')
            .invoke('val', '2024-04-01') // set value to April 1, 2024
            .trigger('change');

        cy.get('#toDate')
            .invoke('val', '2025-03-31')
            .trigger('change');

        cy.get('select[name="arnNo"]').select('all');

        cy.get('select[name="reportType"]').select('ClientWise');
        cy.get('label[for="viewfreedomsip"]').click();


        cy.intercept('POST', '/MutualFund/systematic-investment/new-sip-report').as('new-sip-report');
        cy.get('#submitReportHere').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@new-sip-report').its('response.statusCode').should('eq', 200);

        // Example: validate the label for March 2025 exists
        cy.get('.report-page-session')
            .contains('Client Wise FREEDOM SIP Report')
            .should('exist');
         
    });

     // ✅ Test Case 3 — Client, All ARN, All STP
     it('TC_003: Generate report with Client,All ARN, ALL STP', () => {
        cy.visit(baseUrl);

        cy.get('#fromDate')
            .invoke('val', '2024-04-01') // set value to April 1, 2024
            .trigger('change');

        cy.get('#toDate')
            .invoke('val', '2025-03-31')
            .trigger('change');

        cy.get('select[name="arnNo"]').select('all');

        cy.get('select[name="reportType"]').select('ClientWise');
        cy.get('label[for="viewallstp"]').click();


        cy.intercept('POST', '/MutualFund/systematic-investment/new-sip-report').as('new-sip-report');
        cy.get('#submitReportHere').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@new-sip-report').its('response.statusCode').should('eq', 200);

        // Example: validate the label for March 2025 exists
        cy.get('.report-page-session')
            .contains('Client Wise STP Report')
            .should('exist');
         

    });

     // ✅ Test Case 4 — Client, All ARN, All SWP
     it('TC_004: Generate report with Client,All ARN, All SWP', () => {
        cy.visit(baseUrl);

        cy.get('#fromDate')
            .invoke('val', '2024-04-01') // set value to April 1, 2024
            .trigger('change');

        cy.get('#toDate')
            .invoke('val', '2025-03-31')
            .trigger('change');

        cy.get('select[name="arnNo"]').select('all');

        cy.get('select[name="reportType"]').select('ClientWise');
        cy.get('label[for="viewallswp"]').click();


        cy.intercept('POST', '/MutualFund/systematic-investment/new-sip-report').as('new-sip-report');
        cy.get('#submitReportHere').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@new-sip-report').its('response.statusCode').should('eq', 200);

        // Example: validate the label for March 2025 exists
        cy.get('.report-page-session')
            .contains('Client Wise SWP Report')
            .should('exist');
         
    });
});