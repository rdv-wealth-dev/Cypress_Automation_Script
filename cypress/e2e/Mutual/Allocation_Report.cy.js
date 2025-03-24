describe('Mutual Fund Dashboard', () => {
    beforeEach(() => {
        cy.visit('https://staging.wealthelite.in/arn-login'); 
        cy.get('input[name="username"]').type('redmoneyindore', { force: true });
        cy.get('input[name="password"]').type('Red@123', { force: true });
        cy.get('button[type="submit"]').click();
        cy.get('#mutual__NavItem').click();
        cy.get('#main-content-wrapper > div > div > div:nth-child(12)  > a').click();
    });
  
    it('Validate the Allocation reports should not to be empty', () => {

        // Select valuation as on
        cy.get('#valuationDate.form-control').select(2);

        // Select branch
        cy.get('#branch').select('All');
    
        // Select advisor
        cy.get('#advisor').select('All');
    
        // Select view by option
        cy.get('select[name="selectViewBy"]').select('Client');

        // Search by Name/PAN/Folio or All 
        cy.get('#showAllOption').check({ force: true });

        // Click on Show button
        cy.get('button[id="btn_web"]').eq(0).click();
        cy.wait(4000);

        // Locate the table and iterate over each row and cell
        cy.get('#monthlyexample.table').within(() => {
            // Loop through each row in the tbody
            cy.get('tbody tr').each(($row) => {
                // Loop through each cell in the current row
                cy.wrap($row).find('td').each(($cell) => {
                    // Check that the cell contains data or is exactly '0.0'
                    cy.wrap($cell).invoke('text').then((text) => {
                        // Trim whitespace and check if it’s either non-empty or '0.0'
                        const cellValue = text.trim();
                        expect(cellValue === '0.0' || cellValue.length > 0).to.be.true;
                    });
                });
            });
        });
    });
});

  