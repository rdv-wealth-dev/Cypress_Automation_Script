describe('Mutual Fund Dashboard', () => {
    beforeEach(() => {
        cy.visit('https://staging.wealthelite.in/arn-login'); 
            cy.get('input[name="username"]').type('redmoneyindore', { force: true });
            cy.get('input[name="password"]').type('Red@123',{ force: true });
            cy.get('button[type="submit"]').click();
            cy.get('#mutual__NavItem').click();
            cy.get('#main-content-wrapper > div > div > div:nth-child(3) > a').click();
    });

    it('should select branch, advisor, and view By and search by Name/PAN/Folio', () => {
    
        //cy.get('#valuationDate').clear().type('2024-10-23');
        // Select branch
        cy.get('#branch').select('All');
    
        // Select advisor
        cy.get('#advisor').select('All');
    
        // Select view by option
        cy.get('select[name="selectViewBy"]').select('Client');
    
        // Search by Name/PAN/Folio
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        //cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
        
        cy.get('#loadClient > li:nth-child(1)').contains('Abhishek Singh Parihar').click();
        // Finally submit or trigger the report/valuation
        cy.get('#btn_web').click(); 
        cy.wait(4000);
         //validate client Name
         cy.get('#profitLossExport > div > div > div > ul > li:nth-child(1) > span:nth-child(2)').should('be.visible');
        //validate the Date
        cy.get('#profitLossExport > div > div > div > ul > li:nth-child(1) > span:nth-child(5)').should('be.visible');
        // Total Purchase value
        cy.get('#plPurchase_8733').scrollIntoView().should('be.visible');
        // validate in Switch Inn
        cy.get('#second-content > div > div.col-12.col-sm-12.col-lg-12.mb-2 > div > div > div:nth-child(2) > div').should('be.visible');
        //validate Redemption
        cy.get('#second-content > div > div.col-12.col-sm-12.col-lg-12.mb-2 > div > div > div:nth-child(3) > div').should('be.visible');
         // validate in Switch out
         cy.get('#plSwitchOut_8733').should('be.visible');
        //Net Investment
        cy.get('#plNetGain_8733').should('be.visible');
        //  validate current value
        cy.get('#plCurVal_8733').should('be.visible');
        //  validate gain & Loss
        cy.get('#plGainLoss_8733').should('be.visible');
        //  XIRR
        cy.get('#plXirr_8733').should('be.visible');
    
    
        
            // Validate the presence of the pie chart by checking its container
            cy.get('#\\38 733_assetHoldingPL').should('be.visible');
            

    ;

      });
    
    });