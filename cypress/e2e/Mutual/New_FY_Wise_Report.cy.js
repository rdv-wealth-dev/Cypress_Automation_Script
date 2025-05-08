import { Client } from 'pg';
import '../../support/commands';

describe(' New FY Wise Report ', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/financial-year/financial-year-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

    // ✅ TC_001: Client | FY Year | Fund Type All |
    it('TC_001: Client View, FY Year &  All Fund types Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('input[name="dateOption"][value="1"]').check({ force: true });

        cy.get('select[name="fyYear"]').select('2021-2022');

        cy.get('input[name="vfunds"][value="1"]').check({ force: true });

        cy.wait(3000);
        // cy.get("#all_schm").click();
        // cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/financial-year/financial-year-report').as('financial-year-report');

        cy.get('#btn_web').click();

        cy.wait('@financial-year-report').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
    });

    // ✅ TC_002: Family | FY Year 2024=2025 | Fund Type All |
    it('TC_002: Family View, FY Year &  All Fund types Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Family');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('input[name="dateOption"][value="1"]').check({ force: true });

        cy.get('select[name="fyYear"]').select('2024-2025');

        cy.get('input[name="vfunds"][value="1"]').check({ force: true });

        cy.wait(3000);
        // cy.get("#all_schm").click();
        // cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/financial-year/financial-year-report').as('financial-year-report');

        cy.get('#btn_web').click();

        cy.wait('@financial-year-report').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);
    });

    // ✅ TC_003: Client | FY Year 2023=2024 | Fund Type Selected  |
    it('TC_003: Client View, FY Year &  All Fund types Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the  Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('input[name="dateOption"][value="2"]').check({ force: true });

        cy.get('#startDate').clear().type('2021-06-01{esc}');
        cy.get('#endDate').clear().type('2021-09-30{esc}');

        cy.get('input[name="vfunds"][value="2"]').check({ force: true });
        cy.wait(2000);
        cy.get("#all_schm").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/financial-year/financial-year-report').as('financial-year-report');

        cy.get('#btn_web').click();

        cy.wait('@financial-year-report').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
    });


    // ✅ TC_003: Family | FY Year 2023=2024 | Fund Type Selected  |
    it('TC_003: Family View, FY Year &  All Fund types Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Family');
        // Select the  Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('input[name="dateOption"][value="1"]').check({ force: true });

        cy.get('select[name="fyYear"]').select('2024-2025');

        cy.get('input[name="vfunds"][value="2"]').check({ force: true });
        cy.wait(2000);
        cy.get("#schm_3").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/financial-year/financial-year-report').as('financial-year-report');

        cy.get('#btn_web').click();

        cy.wait('@financial-year-report').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);
    });
});
