import '../../support/commands';

describe('Validate the P&L Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/aum-master/monthly-mis";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

// ✅ TC_001: Select Type: client Wise, Select Fund House: All AMC, Select MIS Month: FEB-2024 Report
it('TC_001: Select Type: client Wise, Select Fund House: All AMC, Select MIS Month: FEB-2024 Report', () => {
        cy.visit(baseUrl);
        cy.wait(2000);

        cy.get('select[name="amc"]').select("All AMC");

        cy.get('select[name="misMonth"]').select('04-2024');

        cy.get('select[name="arnNo"]').select('All');

        cy.wait(2000);

        cy.intercept('POST', '/MutualFund/aum-master/monthly-mis-data').as('monthly-mis-data');

        cy.get('#btn_web').click();

        cy.wait('@monthly-mis-data').its('response.statusCode').should('eq', 200);

        cy.get('.nav > :nth-child(1) > .nav-link').should('be.visible');
    });

   // ✅ TC_002: Select Type: AMC Wise, Select Fund House: All AMC, Select MIS Month: FEB-2024 Report
   it('TC_002: Select Type: AMC Wise, Select Fund House: All AMC, Select MIS Month: FEB-2024 Report', () => {
        cy.visit(baseUrl);
        cy.wait(2000);

        cy.get('select[name="amc"]').select("All AMC");

        cy.get('select[name="misMonth"]').select('02-2024');

        cy.get('select[name="arnNo"]').select('All');

        // Select "AMC Wise"
        cy.contains('label', 'AMC Wise').click();

        cy.wait(2000);

        cy.intercept('POST', '/MutualFund/aum-master/monthly-mis-data').as('monthly-mis-data');

        cy.get('#btn_web').click();

        cy.wait('@monthly-mis-data').its('response.statusCode').should('eq', 200);

        cy.get('.nav > :nth-child(1) > .nav-link').should('be.visible');
    });


    // ✅ TC_003: Select Type: Advisors Wise, Select Fund House: All AMC, Select MIS Month: MAR-2024 Report
    it('TC_003: Select Type: Advisors Wise, Select Fund House: All AMC, Select MIS Month: MAR-2024 Report', () => {
        cy.visit(baseUrl);
        cy.wait(2000);

        cy.get('select[name="amc"]').select("All AMC");

        cy.get('select[name="misMonth"]').select('03-2024');

        cy.get('select[name="arnNo"]').select('All');

        // Select "Advisor Wise"
        cy.contains('label', 'Advisors Wise').click();
        

        cy.wait(2000);

        cy.intercept('POST', '/MutualFund/aum-master/monthly-mis-data').as('monthly-mis-data');

        cy.get('#btn_web').click();

        cy.wait('@monthly-mis-data').its('response.statusCode').should('eq', 200);

        cy.get('.nav > :nth-child(1) > .nav-link').should('be.visible');
    });

 // ✅ TC_004: Select Type: Scheme Wise, Select Fund House: All AMC, Select MIS Month: Jan-2024 Report
 it('TC_004:Select Type: Scheme Wise, Select Fund House: All AMC, Select MIS Month: Jan-2024 Report', () => {
    cy.visit(baseUrl);
    cy.wait(2000);

    cy.get('select[name="amc"]').select("All AMC");

    cy.get('select[name="misMonth"]').select('01-2024');

    cy.get('select[name="arnNo"]').select('All');

    // Select "schemewise"
    cy.contains('label', 'Scheme Wise').click();

    cy.wait(2000);

    cy.intercept('POST', '/MutualFund/aum-master/monthly-mis-data').as('monthly-mis-data');

    cy.get('#btn_web').click();

    cy.wait('@monthly-mis-data').its('response.statusCode').should('eq', 200);

    cy.get('.nav > :nth-child(1) > .nav-link').should('be.visible');
});

});

