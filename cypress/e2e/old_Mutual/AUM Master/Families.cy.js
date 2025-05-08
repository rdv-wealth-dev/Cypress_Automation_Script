describe('Past Performance Dashboard', () => {
    beforeEach(() => {
        cy.visit('https://staging.wealthelite.in/arn-login'); 
        cy.get('input[name="username"]').type('redmoneyindore', { force: true });
        cy.get('input[name="password"]').type('Redvision2024_new', { force: true });
        cy.get('button[type="submit"]').click();
        cy.get('#mutual__NavItem').click();
        
        // Ensure the element is visible before clicking it
        cy.get('#main-content-wrapper > div > div > div:nth-child(8) > a').should('be.visible').click();
    });

    it('Validate the Report of AUM By Schemes', () => {
        cy.get('#main-content-wrapper > div > div > div:nth-child(6) > div > a').should('be.visible').click();

        // Select dates 
        cy.get('#aumReportDate').select('2024-08-18');
    
        // Click on Show button
        cy.get('#btn_web').click();
        cy.wait(6000);  // Wait for the page to load

        // Define regex patterns for currency and percentage
        const percentagePattern = /^\d+(\.\d+)?%$/; // e.g., 202.70%
        const currencyPattern = /^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/; // e.g., 40,85,810.04

        // Use cy.find() to ensure table exists and rows are loaded
        cy.get('#example.table tbody', { timeout: 20000 }).should('exist').and('be.visible');
        
        // Use cy.get() with specific row selector to make sure table rows are rendered
        cy.get('#example.table tbody tr', { timeout: 20000 }).should('have.length.greaterThan', 0).then(($rows) => {
            // Log the number of rows to help with debugging
            cy.log(`Number of rows found: ${$rows.length}`);

            // Iterate through rows
            cy.wrap($rows).each(($row, rowIndex) => {
                const cells = $row.find('td');

                if (cells.length > 0) {
                    // Scheme Name Validation (Column 1)
                    cy.wrap(cells).eq(0).invoke('text').should('not.be.empty');

                    // 3Mth Validation (Column 2)
                    cy.wrap(cells).eq(1).invoke('text').then((text) => {
                        const cleanedText = text.trim();
                        if (cleanedText !== '') {
                            expect(cleanedText).to.match(percentagePattern);
                        }
                    });

                    // 6Mth Validation (Column 3)
                    cy.wrap(cells).eq(2).invoke('text').then((text) => {
                        const cleanedText = text.trim();
                        if (cleanedText !== '') {
                            expect(cleanedText).to.match(percentagePattern);
                        }
                    });

                    // Continue for other columns (1Yr, 3Yr, 5Yr, etc.)
                    // Repeating the same pattern for all the other columns.
                    
                    // Investment Validation (Column 7) for currency format
                    cy.wrap(cells).eq(7).invoke('text').then((text) => {
                        const cleanedText = text.trim().replace(/,/g, '');
                        if (cleanedText !== '') {
                            const isCurrency = !isNaN(parseFloat(cleanedText)) && isFinite(cleanedText);
                            expect(isCurrency, `Expected currency format but got '${cleanedText}'`).to.be.true;
                        }
                    });
                } else {
                    cy.log(`Row ${rowIndex} has no cells.`);
                }
            });
        });
    });
});
