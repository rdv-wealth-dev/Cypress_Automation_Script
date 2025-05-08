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

    it('Validate the Report of AUM By Asset Allocation', () => {
        cy.get('#main-content-wrapper > div > div > div:nth-child(5) > div > a').should('be.visible').click();

        // Select dates 
        cy.get('#aumReportDate').select('2024-08-18');

        // Click on Show button
        cy.get('#btn_web').click();
        cy.wait(6000);  // Wait for the page to load

        // Define regex patterns for currency and percentage
        const currencyPattern = /^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/; // e.g., 40,85,810.04 or 1000.00
        const percentagePattern = /^\d+(\.\d+)?%$/; // e.g., 202.70%

        // Wait for the table rows to be present and have content
        cy.get('#example_wrapper tbody tr')
            .should('have.length.greaterThan', 0)  // Ensure there is at least one row
            .then(($rows) => {
                console.log('Number of rows found:', $rows.length);  // Debug: Log the number of rows

                // Iterate through each row
                cy.wrap($rows).each(($row, rowIndex) => {
                    const cells = $row.find('td');
                    console.log("Row Data : ",cells);  // Debug: Log the number of cells in each row

                    if (cells.length > 0) {
                        // Asset class
                        cy.wrap(cells).eq(0).invoke('text').should('not.be.empty');

                        // Investment column validation
                        cy.wrap(cells).eq(2).invoke('text').then((text) => {
                            console.log("Asset class",text);
                            
                            const cleanedText = text.trim().replace(/[^\d.,]/g, ''); // Removes non-numeric characters
                            // console.log(`Cleaned Investment Value: '${cleanedText}'`); // Log to see the exact format
                            
                            // Directly check if cleanedText is not empty
                            if (cleanedText === '') {
                                cy.log(`Row ${rowIndex} - Investment cell is empty, skipping validation.`);
                                return; // Skip further validation if the cell is empty
                            }

                            // Proceed with currency pattern validation if not empty
                            expect(cleanedText).to.match(currencyPattern); // Investment
                        });

                        // Other column validations...
                        // Same for Div.Reinv, AUM, Abs.Return, AMC Weightage, etc.
                    } else {
                        console.warn(`Row ${rowIndex} has no cells.`);
                    }
                });
            });
    });
});
