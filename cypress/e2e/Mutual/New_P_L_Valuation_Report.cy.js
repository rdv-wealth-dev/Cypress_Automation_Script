
import '../../support/commands';
describe('New P_L Valuation Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    // Test Case 1: Live Funds+ All Funds
    it('should generate a report for Live Funds+ All Funds by client', () => {

        //for visit the url whichever you want after the login
        cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

        //Select the client
        cy.get('select[name="selectViewBy"]').select('Client');
        //Select The Date
        cy.get('#valuationDate')
            .clear()
            .type('2025-04-15').click();

         // Select the Client Name
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
        cy.wait(3000);

        // View Fund: All Funds
        cy.get('input#allFundView[type="radio"]').check({ force: true });

        // Check Fund Type Wise
        cy.get('#fundTypeWise').check();

        // Intercept and click
        cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
        cy.intercept('POST', '/MutualFund/portfolio/save-graph-data').as('save-graph-data');

        cy.get('#btn_web').click();

        cy.wait('@showPLReport').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.wait('@save-graph-data').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });


    });


    // Test Case 2: All Funds + All Funds 
    it('should generate a report for All Funds + All Funds by client', () => {

        cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

        cy.get('select[name="selectViewBy"]').select('Client');

        cy.get('#valuationDate')
            .clear()
            .type('2025-04-15').click();

        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
        cy.wait(3000);

        // Select Report Type: All Funds
        cy.get('input[name="reportType"][value="all"]', { timeout: 10000 })
            .check({ force: true });

        // Intercept and click
        cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
        cy.intercept('POST', '/MutualFund/portfolio/save-graph-data').as('save-graph-data');

        cy.get('#btn_web').click();

        cy.wait('@showPLReport').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.wait('@save-graph-data').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

    // Test Case 3: All Funds + Realised Fund
    it('should generate a report for All Funds + Realised Fund by client', () => {

        cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

        cy.get('select[name="selectViewBy"]').select('Client');

        cy.get('#valuationDate')
            .clear()
            .type('2025-04-15').click();

        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
        cy.wait(3000);

        // Select Report Type: All Funds
        cy.get('input[name="reportType"][value="all"]', { timeout: 10000 })
            .check({ force: true });

     // Intercept and click
     cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
     cy.intercept('POST', '/MutualFund/portfolio/save-graph-data').as('save-graph-data');

     cy.get('#btn_web').click();

     cy.wait('@showPLReport').then((interception) => {
         expect(interception.response.statusCode).to.eq(200);
     });

     cy.wait('@save-graph-data').then((interception) => {
         expect(interception.response.statusCode).to.eq(200);
     });
    });


    // Test Case 4: All Funds + All Funds + Summery
    it('should generate a report for All Funds + All Funds + Summery by client', () => {

        cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

        cy.get('select[name="selectViewBy"]').select('Client');

        cy.get('#valuationDate')
            .clear()
            .type('2025-04-15').click();

        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
        cy.wait(3000);

        // Select Report Type: All Funds
        cy.get('input[name="reportType"][value="all"]', { timeout: 10000 })
            .check({ force: true });

        // Intercept and click
        cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
        cy.intercept('POST', '/MutualFund/portfolio/save-graph-data').as('save-graph-data');

        cy.get('#btn_web').click();

        cy.wait('@showPLReport').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.wait('@save-graph-data').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

    // Test Case 5: All Funds + All Funds + Graphs
    it('should generate a report for All Funds + All Funds + Graphs by client', () => {

        cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

        cy.get('select[name="selectViewBy"]').select('Client');

        cy.get('#valuationDate')
            .clear()
            .type('2025-04-15').click();

        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
        cy.wait(3000);

        // Select Report Type: All Funds
        cy.get('input[name="reportType"][value="all"]', { timeout: 10000 })
            .check({ force: true });

        // Intercept and click
        cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
        cy.get('#btn_web').click();

        cy.wait('@showPLReport').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

      // Test Case 6: All Funds + All Funds (Family)
      it('should generate a report for All Funds + All Funds by Family', () => {

        cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

        cy.get('select[name="selectViewBy"]').select('Family');

        cy.get('#valuationDate')
            .clear()
            .type('2025-04-15').click();

        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
        cy.wait(3000);

        // Select Report Type: All Funds
        cy.get('input[name="reportType"][value="all"]', { timeout: 10000 })
            .check({ force: true });

        // Intercept and click
        cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
        cy.intercept('POST', '/MutualFund/portfolio/save-graph-data').as('save-graph-data');

        cy.get('#btn_web').click();

        cy.wait('@showPLReport').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.wait('@save-graph-data').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });


 // Test Case 4: All Funds + All Funds + Summery
 it('should generate a report for All Funds + All Funds + Summery by Family', () => {

    cy.visit("https://wealthelite.in/MutualFund/pl/profit-loss");

    cy.get('select[name="selectViewBy"]').select('Family');

    cy.get('#valuationDate')
        .clear()
        .type('2025-04-15').click();

    cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
    cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
    cy.wait(3000);

    // Select Report Type: All Funds
    cy.get('input[name="reportType"][value="all"]', { timeout: 10000 })
        .check({ force: true });

    // Intercept and click
    cy.intercept('POST', '/MutualFund/pl/show-pl-report').as('showPLReport');
    cy.intercept('POST', '/MutualFund/portfolio/save-graph-data').as('save-graph-data');

    cy.get('#btn_web').click();

    cy.wait('@showPLReport').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    });

    cy.wait('@save-graph-data').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    });
});

});