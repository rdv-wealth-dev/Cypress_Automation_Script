import '../../support/commands';

describe('Validate the P&L Report ', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/capital-gain/show-reliased-capital-gain-xirr-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

    // ✅ TC_001: Client | Both | All | Selected Fund All | 
    it('TC_001: Client View, Both Asset Types, All FY, Selected Fund All Report', () => {
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
    
        cy.get('select[name="financialYear"]').select('All');
        cy.wait(2000);
        cy.get("#all_schm").click();
        cy.get('.modal-footer button.btn-success').contains('Submit').click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-xirr-report-new').as('show-reliased-capital-gain-xirr-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-xirr-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
        cy.contains('a', 'Realised Funds XIRR').should('be.visible');

    });

    // ✅ TC_002: Client | Equity | 2024-2025 | Selected Fund Any | 
    it('TC_002: Client View, Equity Asset Types, FY-2024-2025, Selected Fund Any Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(3000);

        cy.get('select[name="assetType"]').select('Equity');
    
        cy.get('select[name="financialYear"]').select('2024-2025');
        cy.wait(2000);
        cy.get("#schm_2").click();
        cy.get('.modal-footer button.btn-success').contains('Submit').click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-xirr-report-new').as('show-reliased-capital-gain-xirr-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-xirr-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
        cy.contains('a', 'Realised Funds XIRR').should('be.visible');

    });

    // ✅ TC_003: Client | Debt | 2024-2025 | Selected Fund Any | 
    it('TC_003: Client View, Equity Asset Types, FY-2024-2025, Selected Fund Any Report', () => {
        cy.visit(baseUrl);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Select the Client Name
        cy.get('input[name="searchClient"]').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient')
            .should('be.visible')
            .contains('li', 'Abhishek Singh Parihar')
            .click();
        cy.wait(1000);

        cy.get('select[name="assetType"]').select('Equity');
    
        cy.get('select[name="financialYear"]').select('2024-2025');
        cy.wait(2000);
        cy.get('[id="vfunds"]').check({force:true});
        cy.get("#schm_1").click();
        cy.get('.modal-footer button.btn-success').contains('Submit').click();
        cy.wait(1000);
        cy.get('.modal-backdrop').invoke('remove');
        cy.wait(500);

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-xirr-report-new').as('show-reliased-capital-gain-xirr-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-xirr-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
        cy.contains('a', 'Realised Funds XIRR').should('be.visible');

    });

     // ✅ TC_004: Client | Both | Beetween Date | Selected Fund All | 
     it('TC_004: Client View, Both Asset Types,  Beetween Date, Selected Fund All Report', () => {
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
        cy.get('input[id="radio2"]').check({force:true});
    
        cy.get('#fromDate').clear().type('2024-04-18{esc}');
        cy.get('#toDate').clear().type('2025-04-18{esc}');

        cy.get('input[id="vfunds"]').check({ force: true });
        cy.wait(2000);
        cy.get("#all_schm").click();
        cy.get('.modal-footer button.btn-success').contains('Submit').click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-xirr-report-new').as('show-reliased-capital-gain-xirr-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-xirr-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
        cy.contains('a', 'Realised Funds XIRR').should('be.visible');

    });


      //✅ TC_005: Family | Both | Beetween Date | Selected Fund All | 
     it('TC_005: Family View, Both Asset Types,  Beetween Date, Selected Fund All Report', () => {
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
        cy.get('input[id="radio2"]').check({force:true});
    
        cy.get('#fromDate').clear().type('2024-04-18{esc}');
        cy.get('#toDate').clear().type('2025-04-18{esc}');

        cy.get('input[id="vfunds"]').check({ force: true });
        cy.wait(2000);
        cy.get("#all_schm").click();
        cy.get('.modal-footer button.btn-success').contains('Submit').click();

        cy.intercept('POST', '/MutualFund/capital-gain/show-reliased-capital-gain-xirr-report-new').as('show-reliased-capital-gain-xirr-report-new');

        cy.get('#btn_web').click();

        cy.wait('@show-reliased-capital-gain-xirr-report-new').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', familyName);
       

    });
});

