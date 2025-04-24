
import '../../support/commands';

describe('Between Date XIRR Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/allocation/allocation-report-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

    // ✅ Test Case 1 — Client, All Funds, Manually
    it('TC_001: Generate report with Client, All Funds, Manually', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');


        cy.get('input[name="clientShowType"][value="1"]').check({ force: true });
        // Select the  Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.intercept('POST', '/MutualFund/allocation/allocation-fund-report').as('allocation-fund-report');
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@allocation-fund-report').its('response.statusCode').should('eq', 200);
        cy.get('#monthlyexample > tbody > tr > td.text-left.sorting_1')
            .should('be.visible')
            .and('contain', clientName);
    });

    // ✅ Test Case 2 — For All Clients 
    it('TC_002: Generate report for All Clients', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');

        cy.get('input[name="clientShowType"][value="2"]').check({ force: true });

        cy.intercept('POST', '/MutualFund/allocation/allocation-fund-report').as('allocation-fund-report');
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@allocation-fund-report').its('response.statusCode').should('eq', 200);
        cy.get('#monthlyexample')
            .should('be.visible')
            .and('contain', 'Valuation Wise Allocation');
    });

    // ✅ Test Case 3 — Family, All Funds, Manually
    it('TC_003: Generate report with Family, All Funds, Manually', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');


        cy.get('input[name="clientShowType"][value="1"]').check({ force: true });
        // Select the  Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.intercept('POST', '/MutualFund/allocation/allocation-fund-report').as('allocation-fund-report');

        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@allocation-fund-report').its('response.statusCode').should('eq', 200);
        cy.get('#monthlyexample > tbody > tr > td.text-left.sorting_1')
            .should('be.visible')
            .and('contain', familyName);
    });

    // ✅ Test Case 4 — For All Families 
    it('TC_004: Generate report for All Clients', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Family');

        cy.get('input[name="clientShowType"][value="2"]').check({ force: true });

        cy.intercept('POST', '/MutualFund/allocation/allocation-fund-report').as('allocation-fund-report');
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@allocation-fund-report').its('response.statusCode').should('eq', 200);
        cy.get('#monthlyexample')
            .should('be.visible')
            .and('contain', 'Valuation Wise Allocation');
    });
});



