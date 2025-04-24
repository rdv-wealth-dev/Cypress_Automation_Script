
import '../../support/commands';

describe('Between Date XIRR Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/transaction/transaction-report-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';
    const fromDate = '2023-06-08';
    const toDate = '2025-04-21';

    // ✅ Test Case 1 — Client, Default Date
    it('TC_001: Generate report with Client, Default Date', () => {
        cy.visit(baseUrl);

        // cy.get('#fromDate')
        //     .invoke('val', '2023-06-08') // set value to April 1, 2024
        //     .trigger('change');

        // cy.get('#toDate')
        //     .invoke('val', '2025-04-21')
        //     .trigger('change');

        cy.get('select[name="selectViewBy"]').select('Client');
    
        cy.get('#searchClient').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.intercept('POST', '**/transaction/transaction-report').as('transaction-report');
        cy.contains('button', 'Show').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@transaction-report').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > :nth-child(1) > .col-12 > .card').should('contain', clientName);

    });

    // ✅ Test Case 2 — Family, Selected Date
    it('TC_002: Generate report with Family,Selected Date', () => {
        cy.visit(baseUrl);

        cy.get('#fromDate')
            .invoke('val', '2023-06-08') 
            .trigger('change');

        cy.get('#toDate')
            .invoke('val', '2025-04-21')
            .trigger('change');

        cy.get('select[name="selectViewBy"]').select('Family');
    
        cy.get('#searchClient').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.intercept('POST', '**/transaction/transaction-report').as('transaction-report');
        cy.contains('button', 'Show').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@transaction-report').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > :nth-child(1) > .col-12 > .card').should('contain', familyName);

    });

    // ✅ Test Case 3 — Client, Selected Date
    it('TC_003: Generate report with Client,Selected Date', () => {
        cy.visit(baseUrl);

        cy.get('#fromDate')
            .invoke('val', '2023-06-08') // set value to April 1, 2024
            .trigger('change');

        cy.get('#toDate')
            .invoke('val', '2025-04-21')
            .trigger('change');

        cy.get('select[name="selectViewBy"]').select('Client');
    
        cy.get('#searchClient').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.intercept('POST', '**/transaction/transaction-report').as('transaction-report');
        cy.contains('button', 'Show').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@transaction-report').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > :nth-child(1) > .col-12 > .card').should('contain', clientName);

    });
});