
import '../../support/commands';

describe('Between Date XIRR Report', () => {

    beforeEach(() => {
        cy.loginWithSession(); // restores or creates session
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    const baseUrl = "https://wealthelite.in/MutualFund/portfolio/new-transaction";
    const clientName = 'Abhishek Singh Parihar';
    const familyName = 'Abhishek Singh Parihar';
   

    // ✅ Test Case 1 — Client + Selected+ All Fund Types + All AMCs + All ARN + All Transaction Types
    it('TC_001: Generate report withClient + Selected+ All Fund Types + All AMCs + All ARN + All Transaction Types', () => {
        cy.visit(baseUrl);

        cy.get('#startDate').clear().type('2022-01-20{esc}');
        cy.get('#endDate').clear().type('2025-04-20{esc}');

        cy.get('select[name="selectViewBy"]').select('Client');
    
        cy.get('#searchClient').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);
         
        //Select Fund Types
        cy.get('.nc-funds-type-toogle-select-show').click();
        cy.get('#fundType_all').check({ force: true });

        //Select Transaction Type
        cy.get('.nc-trans-type-toogle-select-show').click();
        cy.get('#transType_allTrans').check({ force: true }).click();

        cy.intercept('POST', '/MutualFund/portfolio/show-new-transaction').as('show-new-transaction');
        cy.get('#ncTtFilter').invoke('attr', 'style', 'display: none');
        
        cy.wait(1000);
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@show-new-transaction').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > div:nth-child(1) > div > div').should('contain', clientName);



    });

    // ✅ Test Case 2 —Client+ Selected Date + Selected Fund Types + Selected AMCs+ Selected ARN + Selected Transaction Types
    it('TC_002: Generate report withAll Client+ Selected Date + Selected Fund Types + Selected AMCs+ Selected ARN + Selected Transaction Types', () => {
        cy.visit(baseUrl);

        cy.get('#startDate').clear().type('2025-02-20{esc}');
        cy.get('#endDate').clear().type('2025-04-20{esc}');

        cy.get('select[name="selectViewBy"]').select('Client');
       // cy.get('#showAllOption').check({ force: true }); // for checkbox or radio

    
        cy.get('#searchClient').clear().type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);
         
        //Select Fund Types
        cy.get('.nc-funds-type-toogle-select-show').click();
        cy.get('#ELSS').check({ force: true });


        cy.get('#filterForm > div > div:nth-child(11) > div > input').click();
        cy.get('[type="checkbox"][value="SIP Purchase"]').check({force:true});
        cy.get('#filterForm > div > div.col-6.mb-2 > label').click();


        cy.intercept('POST', '/MutualFund/portfolio/show-new-transaction').as('show-new-transaction');
    
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@show-new-transaction').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > div:nth-child(1) > div > div').should('contain', clientName);

    });

    // ✅ Test Case 3 — Family + Selected+ All Fund Types + All AMCs + All ARN + All Transaction Types
    it('TC_003: Generate report Family + Selected + All Fund Types + All AMCs + All ARN + All Transaction Types', () => {
        cy.visit(baseUrl);

        cy.get('#startDate').clear().type('2022-01-20{esc}');
        cy.get('#endDate').clear().type('2025-04-20{esc}');

        cy.get('select[name="selectViewBy"]').select('Family');
    
        cy.get('#searchClient').type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);
         
        //Select Fund Types
        cy.get('.nc-funds-type-toogle-select-show').click();
        cy.get('#fundType_all').check({ force: true });

        //Select Transaction Type
        cy.get('.nc-trans-type-toogle-select-show').click();
        cy.get('#transType_allTrans').check({ force: true }).click();

        cy.intercept('POST', '/MutualFund/portfolio/show-new-transaction').as('show-new-transaction');
        cy.get('#ncTtFilter').invoke('attr', 'style', 'display: none');
        
        cy.wait(1000);
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@show-new-transaction').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > div:nth-child(1) > div > div').should('contain', familyName);



    });

     // ✅ Test Case 4 Family+ Selected Date + Selected Fund Types + Selected AMCs+ Selected ARN + Selected Transaction Types
     it('TC_004: Generate report withAll Family + Selected Date + Selected Fund Types + Selected AMCs+ Selected ARN + Selected Transaction Types', () => {
        cy.visit(baseUrl);

        cy.get('#startDate').clear().type('2022-02-20{esc}');
        cy.get('#endDate').clear().type('2025-04-20{esc}');

        cy.get('select[name="selectViewBy"]').select('Client');
       // cy.get('#showAllOption').check({ force: true }); // for checkbox or radio

    
        cy.get('#searchClient').type('Abhishek Singh Parihar');
        cy.get('#loadClient').should('be.visible');
        cy.get('#loadClient li')
            .contains('Abhishek Singh Parihar')
            .click();
        cy.wait(2000);
         
        //Select Fund Types
        cy.get('.nc-funds-type-toogle-select-show').click();
        cy.get('#ELSS').check({ force: true });


        cy.get('#filterForm > div > div:nth-child(11) > div > input').click();
        cy.get('[type="checkbox"][value="SIP Purchase"]').check({force:true});
        cy.get('#filterForm > div > div.col-6.mb-2 > label').click();


        cy.intercept('POST', '/MutualFund/portfolio/show-new-transaction').as('show-new-transaction');
    
        cy.get('#btn_web').click();

        // Validate the API And the Reports Should be visible 
        cy.wait('@show-new-transaction').its('response.statusCode').should('eq', 200);

        cy.get('#second-content > div:nth-child(1) > div > div').should('contain', familyName);

    });
});