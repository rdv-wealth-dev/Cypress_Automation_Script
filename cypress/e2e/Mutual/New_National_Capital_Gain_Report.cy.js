import '../../support/commands';

describe('Validate the P&L Report ', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/capital-gain/show-notional-capital-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

    // ✅ TC_001: Client | Both  |Both  | Summary
    it('TC_001: Client View, Both Asset Types, Both Txn Periods, Summary Report', () => {
        cy.visit(baseUrl);
        cy.wait(3000);
        cy.get('#regimeTaxationProcess').invoke("modal", "hide");
        cy.wait(1000);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.get('select[name="fundType"]').select('Both');
        cy.get('select[name="trnsPeriod"]').select('Both');

        cy.get('select[name="reportViewType"]').select('Summary');

        cy.wait(2000);
        cy.get("#all_schm").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-notional-capital-gain').as('show-notional-capital-gain');

        cy.get('#btn_web').click();

        cy.wait('@show-notional-capital-gain').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
      
    });

    // ✅ TC_002: Family | Short term  |Equity  | Details
    it('TC_002: Family View, Equity Asset Types, Short term  Txn Periods, Details Report', () => {
        cy.visit(baseUrl);
        cy.wait(3000);
        cy.get('#regimeTaxationProcess').invoke("modal", "hide");
        cy.wait(1000);
        cy.get('select[name="selectViewBy"]').select('Family');
        // Select the Family Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.get('select[name="fundType"]').select('Equity');
        cy.get('select[name="trnsPeriod"]').select('Short Term');

        cy.get('select[name="reportViewType"]').select('Details');

        cy.wait(2000);
        cy.get('input[name="schm_1"]').check({ force: true });
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-notional-capital-gain').as('show-notional-capital-gain');

        cy.get('#btn_web').click();

        cy.wait('@show-notional-capital-gain').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);
        cy.get('.report-page-tab > :nth-child(1) > :nth-child(1) > .nav-link').should('be.visible');
      
    });

  // ✅ TC_003: Client | Both  |Long term  | Details
    it('TC_003: Client View, Both Asset Types, Long term  Txn Periods, Details Report', () => {
        cy.visit(baseUrl);
        cy.wait(3000);
        cy.get('#regimeTaxationProcess').invoke("modal", "hide");
        cy.wait(1000);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.get('select[name="fundType"]').select('Both');
        cy.get('select[name="trnsPeriod"]').select('longTerm');

        cy.get('select[name="reportViewType"]').select('Details');

        cy.wait(2000);
        cy.get("#all_schm").click();
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-notional-capital-gain').as('show-notional-capital-gain');

        cy.get('#btn_web').click();

        cy.wait('@show-notional-capital-gain').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
      
    });


     // ✅ TC_004: Family | Short term  |Both  | Summery
    it('TC_004: Family View, Equity Asset Types, Short term  Txn Periods, Summery Report', () => {
        cy.visit(baseUrl);
        cy.wait(3000);
        cy.get('#regimeTaxationProcess').invoke("modal", "hide");
        cy.wait(1000);
        cy.get('select[name="selectViewBy"]').select('Family');
        // Select the Family Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(2000);

        cy.get('select[name="fundType"]').select('Both');
        cy.get('select[name="trnsPeriod"]').select('Short Term');

        cy.get('select[name="reportViewType"]').select('Summary');

        cy.wait(2000);
        cy.get('input[name="schm_1"]').check({ force: true });
        cy.get("#selected-funds-model .modal-footer button").click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-notional-capital-gain').as('show-notional-capital-gain');

        cy.get('#btn_web').click();

        cy.wait('@show-notional-capital-gain').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);
        cy.get('.report-page-tab > :nth-child(1) > :nth-child(1) > .nav-link').should('be.visible');
      
    });
});
