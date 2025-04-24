import '../../support/commands';

describe('Validate the P&L Report ', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/capital-gain/show-reliased-capital-gain-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

    // ✅ TC_001: Client | Both | Both | All | Full Year | Summary
    it('TC_001: Client View, Both Asset Types, Both Txn Periods, All FY, Summary Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('select[name="assetType"]').select('Both');
        cy.get('select[name="transPeriod"]').select('Both');
        cy.get('select[name="financialYear"]').select('All');

        cy.get('select[name="reportViewType"]').select('Summary');

        cy.wait(3000);
        cy.get("#all_schm").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-report-new').as('show-reliased-capital-gain-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
    });

    // ✅ TC_002: Family | Equity | Short Term | 2021–2022 | Custom | Details
    it('TC_002: Family View, Equity, Short Term, FY 2021–2022, Custom Date Range, Detailed Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Family');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('select[name="assetType"]').select('Equity');
        cy.get('select[name="transPeriod"]').select('Short Term');
        cy.get('select[name="financialYear"]').select('2021-2022');

        cy.get('select[name="reportViewType"]').select('Details');
        cy.wait(3000);
        cy.get("#all_schm").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-report-new').as('show-reliased-capital-gain-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);

    });

    // ✅ TC_003: Client | Debt | Long Term | All | details
    it('TC_003: Client View, Both Asset Types, Both Txn Periods, All FY, Summary Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('select[name="assetType"]').select('Debt');
        cy.get('select[name="transPeriod"]').select('Long Term');
        cy.get('input[id="radio2"]').check({ force: true });
        cy.get('#fromDate').clear().type('2021-06-01{esc}');
        cy.get('#toDate').clear().type('2021-09-30{esc}');

        cy.get('select[name="reportViewType"]').select('Details');

        cy.wait(3000);
        cy.get("#all_schm").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-report-new').as('show-reliased-capital-gain-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
    });


     // ✅ TC_004: Family | Both | Both | All | Custom | Summery
     it('TC_004: Family View, Equity, Short Term, FY 2021–2022, Custom Date Range, Detailed Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Family');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('select[name="assetType"]').select('Both');
        cy.get('select[name="transPeriod"]').select('Short Term');
        cy.get('select[name="financialYear"]').select('2021-2022');

        cy.get('select[name="reportViewType"]').select('Summary');

        cy.wait(3000);
        cy.get('input[name="schm_1"]').check({ force: true });

        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-report-new').as('show-reliased-capital-gain-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);

    });
});
