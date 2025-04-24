import '../../support/commands';

describe('Validate the P&L Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // ✅ restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/maturity/maturity-report-filter";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';

// // ✅ TC_001: Select Type: client Wise, Fund Type:Both, All AMC, Maturity Upto Month:Jan-2025 ,All Schemes Report
// it('TC_001: Select Type: client Wise, Select Fund House: All AMC, Maturity Upto Month:Jan-2025 ,All Schemes Report', () => {
//         cy.visit(baseUrl);
//         cy.wait(2000);

//         cy.get('select[name="fundType"]').select("both");

//         cy.get('select[name="selectViewBy"]').select('Client');
//          // Select the Client Name
//          cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
//          cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
//          cy.wait(3000);

//          cy.get('select[name="month"]').select('January');
//          cy.get('select[name="year"]').select('2025');

//         cy.get('select[name="amc"]').select('All AMC');
//         cy.get('select[name="amcScheme"]').select('All Scheme');
//         cy.wait(2000);

//         cy.intercept('POST', '/MutualFund/maturity/maturity-report').as('maturity-report');

//         cy.get('#btn_web').click();

//         cy.wait('@maturity-report').its('response.statusCode').should('eq', 200);

//         cy.get(':nth-child(1) > .col-12 > .card').should('be.visible');
//     });

// // ✅ TC_002: Select Type: Family Wise, Fund Type:Equity - ELSS, All AMC, Maturity Upto Month:Jan-2025 ,All Schemes Report
// it('TC_002: Select Type: Family Wise, Fund Type:Equity - ELSS, Select Fund House: All AMC, Maturity Upto Month:Jan-2025 ,All Schemes Report', () => {
//     cy.visit(baseUrl);
//     cy.wait(2000);

//     cy.get('select[name="fundType"]').select("Equity - ELSS");

//     cy.get('select[name="selectViewBy"]').select('Family');
//      // Select the Client Name
//      cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
//      cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
//      cy.wait(3000);

//      cy.get('select[name="month"]').select('February');
//      cy.get('select[name="year"]').select('2027');

//     cy.get('select[name="amc"]').select('Aditya Birla Sun Life Mutual Fund');
//     cy.get('select[name="amcScheme"]').select('B02G');
//     cy.wait(2000);

//     cy.intercept('POST', '/MutualFund/maturity/maturity-report').as('maturity-report');

//     cy.get('#btn_web').click();

//     cy.wait('@maturity-report').its('response.statusCode').should('eq', 200);

//     cy.get(':nth-child(1) > .col-12 > .card').should('be.visible');
// });


// ✅ TC_003: Select Type: client Wise, Fund Type:Closed Ended/Both, All AMC, Maturity Upto Month:Jan-2025 ,All Schemes Report
it('TC_003: Select Type: client Wise, Fund Type:Closed Ended/Both, Select Fund House: All AMC, Maturity Upto Month:Jan-2025 ,All Schemes Report', () => {
    cy.visit(baseUrl);
    cy.wait(2000);

    cy.get('select[name="fundType"]').select("Both");

    cy.get('select[name="selectViewBy"]').select('Client');
     // Select the Client Name
     cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
     cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
     cy.wait(3000);

     cy.get('select[name="month"]').select('March');
     cy.get('select[name="year"]').select('2026');

    cy.get('select[name="amc"]').select('Nippon India Mutual Fund');
    cy.get('select[name="amcScheme"]').select('RMFTSGP');
    cy.wait(2000);

    cy.intercept('POST', '/MutualFund/maturity/maturity-report').as('maturity-report');

    cy.get('#btn_web').click();

    cy.wait('@maturity-report').its('response.statusCode').should('eq', 200);

    cy.get(':nth-child(1) > .col-12 > .card').should('be.visible');
});

 // ✅ TC_004: Select Type: Family Wise, Fund Type:Closed Ended/Both, All AMC, Maturity Upto Month:April-2026 ,All Schemes Report
it('TC_004: Select Type: Family Wise, Fund Type:Closed Ended/Both, Select Fund House: All AMC, Maturity Upto Month:April-2026 ,All Schemes Report', () => {
    cy.visit(baseUrl);
    cy.wait(2000);

    cy.get('select[name="fundType"]').select("Both");

    cy.get('select[name="selectViewBy"]').select('Family');
     // Select the Family Name
     cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
     cy.get('#loadClient > li').contains('Abhishek Singh Parihar').click();
     cy.wait(3000);

     cy.get('select[name="month"]').select('April');
     cy.get('select[name="year"]').select('2026');

    cy.get('select[name="amc"]').select('Nippon India Mutual Fund');
    cy.get('select[name="amcScheme"]').select('RMFTSGP');
    cy.wait(2000);

    cy.intercept('POST', '/MutualFund/maturity/maturity-report').as('maturity-report');

    cy.get('#btn_web').click();

    cy.wait('@maturity-report').its('response.statusCode').should('eq', 200);

    cy.get(':nth-child(1) > .col-12 > .card').should('be.visible');
});

});

