describe('Mutual Fund Dashboard', () => {
    beforeEach(() => {
        cy.visit('https://staging.wealthelite.in/arn-login');
        cy.get('input[name="username"]').type('redmoneyindore', { force: true });
        cy.get('input[name="password"]').type('Red@123', { force: true });
        cy.get('button[type="submit"]').click();
        cy.wait(5000);
        cy.get('#mutual__NavItem').click();
        cy.get('#main-content-wrapper > div > div > div:nth-child(10) > a').click();
        // Select an Financial year
       // cy.get('#noOfMonth').contains('12').click();
 // This is correct if it's one of many clickable elements with the text '12'

        // Click on Show button
        cy.get('#aumGrowthFilter > div > div.col-12.col-sm-12.col-md-12.mt-2.mb-3 > button').click();
        cy.wait(15000);

        //cy.get('button[type="button"]').click();
    });

    it('Validate the AUM Growth reports should not be empty', () => {
        // Wait for the table to be loaded
        //cy.get('#monthlyexample_wrapper #monthlyexample ').should('be.visible');
         
        cy.get('#monthlyexample_wrapper #monthlyexample ').within(() => { 
            // Validate each row
            cy.get('tbody tr').each(($row, index) => {
                cy.wrap($row).within(() => {

                    // Validate Month (you can also check if the format is correct)
                    cy.get('td').eq(1).invoke('text').then((month) => {
                        expect(month.trim()).to.match(/^[A-Za-z]{3}, \d{4}$/); // Match format like 'Jul, 2024'
                    });

                    // Validate AUM (it should be a valid number with commas)
                    cy.get('td').eq(2).invoke('text').then((aum) => {
                        console.log('AUM:', aum); // Log the AUM value to inspect it
                        expect(aum.trim()).to.match(/^\d{1,2}(?:,\d{2}){1,2}(?:,\d{3})*(?:\.\d+)?$/); // Match the format like '14,97,50,490.07'
            
                    });
                    
                    
                });
            });
        });
    });
});
