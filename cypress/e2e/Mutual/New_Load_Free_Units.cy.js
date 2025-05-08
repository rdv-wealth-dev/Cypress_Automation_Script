import '../../support/commands';

describe('New Load Free Units  Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/load-free-unit/load-free-unit-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

// ✅ TC_001: Select Type: client Wise,Transaction Type: All Load free unit Report
it('TC_001: Select Type: client Wise,Transaction Type: All Load free unit Report', () => {
        cy.visit(baseUrl);
        cy.wait(2000);

        cy.get('select[name="selectViewBy"]').select('Client');
         // Select the Client Name
         cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
         cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
         cy.wait(2000);

         cy.get('select[name="transactionType"]').select('ALL');

         cy.get('#all_schm').check();
         cy.wait(1000);
         cy.get('#selected-funds-model .modal-footer button').click();
        cy.wait(1000);

        cy.intercept('POST', '/MutualFund/load-free-unit/load-free-unit-report').as('load-free-unit-report');

        cy.get('form[action="load-free-unit-report"] button#btn_web').click();

        cy.wait('@load-free-unit-report').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
    });

// ✅ TC_002: Select Type: Family Wise,Transaction Type: Load Applicable, Load free unit Report
it('TC_002: Select Type: Family Wise,Transaction Type: Load Applicable, Load free unit Report', () => {
    cy.visit(baseUrl);
    cy.wait(2000);

    cy.get('select[name="selectViewBy"]').select('Family');
     // Select the Family Name
     cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
     cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
     cy.wait(2000);

     cy.get('select[name="transactionType"]').select('Load Applicable');

     cy.get('#all_schm').check();
     cy.wait(1000);
     cy.get('#selected-funds-model .modal-footer button').click();
    cy.wait(1000);

    cy.intercept('POST', '/MutualFund/load-free-unit/load-free-unit-report').as('load-free-unit-report');

    cy.get('form[action="load-free-unit-report"] button#btn_web').click();

    cy.wait('@load-free-unit-report').its('response.statusCode').should('eq', 200);

    cy.get('.report-result-panel').should('contain', familyName);
});


// ✅ TC_003: Select Type: client Wise,Transaction Type: Load Free, Load free unit Report
it('TC_003: Select Type: client Wise,Transaction Type: Load Free, Load free unit Report', () => {
        cy.visit(baseUrl);
        cy.wait(2000);

        cy.get('select[name="selectViewBy"]').select('Client');
         // Select the Client Name
         cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
         cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
         cy.wait(2000);

         cy.get('select[name="transactionType"]').select('Load Free');

         cy.get('#all_schm').check();
         cy.wait(1000);
         cy.get('#selected-funds-model .modal-footer button').click();
        cy.wait(1000);

        cy.intercept('POST', '/MutualFund/load-free-unit/load-free-unit-report').as('load-free-unit-report');

        cy.get('form[action="load-free-unit-report"] button#btn_web').click();

        cy.wait('@load-free-unit-report').its('response.statusCode').should('eq', 200);

        cy.get('.report-result-panel').should('contain', clientName);
    });


// ✅ TC_004: Select Type: Family Wise,Transaction Type:Lock in Units, Load free unit Report
it('TC_004: Select Type: Family Wise,Transaction Type:Lock in Units, Load free unit Report', () => {
    cy.visit(baseUrl);
    cy.wait(2000);

    cy.get('select[name="selectViewBy"]').select('Family');
     // Select the Family Name
     cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
     cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
     cy.wait(2000);

     cy.get('select[name="transactionType"]').select('Lock In Units');

     cy.get('#all_schm').check();
     cy.wait(1000);
     cy.get('#selected-funds-model .modal-footer button').click();
    cy.wait(1000);

    cy.intercept('POST', '/MutualFund/load-free-unit/load-free-unit-report').as('load-free-unit-report');

    cy.get('form[action="load-free-unit-report"] button#btn_web').click();

    cy.wait('@load-free-unit-report').its('response.statusCode').should('eq', 200);

    cy.get('.report-result-panel').should('contain', familyName);
});

});

