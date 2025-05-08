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

    it('Validate the Report of AUM By Advisor', () => {
        cy.get('#main-content-wrapper > div > div > div:nth-child(4) > div > a').should('be.visible').click();
        // Select dates 
        cy.get('#aumReportDate').select('2024-08-18');
        // Click on Show button
        cy.get('#btn_web').click();
        cy.wait(6000);  // Wait for the page to load

        cy.get('#example tbody tr').each(($row, rowIndex) => {
            const cells = $row.find('td'); // Find all td cells in the current row

            cy.wrap(cells).each((cell, cellIndex) => {
                const cellText = Cypress.$(cell).text().trim();
                console.log("cell Index : ", cellIndex);

                switch (cellIndex) {
                    case 0: // Advisor Name (Column 1)
                    let name = cellText ? cellText.trim() : '';  // Handle null or undefined cellText
                    console.log(`Trimmed name: "${name}"`); // Log the name for debugging
        
                    // Define the updated regex patterns for validating the advisor name format
                    const advisorNamePattern = /^(?:[A-Za-z0-9/\s-]+ \[[A-Za-z0-9-]+\]|\[[A-Za-z0-9-]+\]|\w+ \[[A-Za-z0-9-]+\]|\[ARN-(\d+)?\])$/;
        
                    // Check if the name matches the expected pattern
                    if (advisorNamePattern.test(name)) { 
                        console.log(`Valid advisor name: ${name}`);
                        // Optionally, assert the validity
                        expect(name).to.match(advisorNamePattern);
                    } else {
                        console.error(`Invalid advisor name: ${name}`);
                        // Optionally, you could fail the test here
                        assert.fail(`Invalid advisor name format: ${name}`);
                    }
                    break;

                    case 1: // Investment (Column 2)
                        // Check if the Investment value is present (not empty)
                        if (cellText.trim() !== '') {
                            // Ensure the Investment is a valid positive number (without specific currency format validation)
                            const investmentValue = parseFloat(cellText.replace(/,/g, ''));
                            expect(investmentValue).to.be.greaterThan(0);  // Investment should be greater than 0
                        } else {
                            // If there's no value (empty or null), you can handle it based on your requirements
                            expect(cellText).to.equal('');  // Assert that the cell is empty if no investment exists
                        }
                        break;

                    case 2: // Div.Paid (Column 3)
                        // Check if Div.Paid value is present and not empty
                        if (cellText.trim() !== '') {
                            // You can add additional checks if needed
                        } else {
                            // If it's empty (and shouldn't be), handle accordingly
                            expect(cellText).to.equal('');  // Assert that it's empty if Div.Paid is missing
                        }
                        break;

                    case 3: // Div.Reinv (Column 4)
                        // Check if Div.Reinv value is present and not empty
                        if (cellText.trim() !== '') {
                            // You can add additional checks if needed
                        } else {
                            // If it's empty (and shouldn't be), handle accordingly
                            expect(cellText).to.equal('');  // Assert that it's empty if Div.Reinv is missing
                        }
                        break;

                    case 4: // AUM (Column 5)
                        // Check if the AUM value is present (not empty)
                        if (cellText.trim() !== '') {
                            // Ensure the AUM is a valid positive number (without specific currency format validation)
                            const aumValue = parseFloat(cellText.replace(/,/g, '')); // Remove commas and convert to number
                            expect(aumValue).to.be.greaterThan(0);  // AUM should be greater than 0
                        } else {
                            // If there's no value (empty or null), you can handle it based on your requirements
                            expect(cellText).to.equal('');  // Assert that the cell is empty if no AUM exists
                        }
                        break;

                    case 5: // Abs.Return (Column 6)
                        // Validate that Abs.Return is a valid decimal number
                        if (cellText.trim() !== '') {
                            expect(cellText).to.match(/^\d+(\.\d+)?$/);  // Example: 11.10 or 5.50
                            const returnValue = parseFloat(cellText);
                            expect(returnValue).to.be.at.least(0);  // Return should not be negative
                        } else {
                            expect(cellText).to.equal('');  // Assert that the cell is empty if Abs.Return is missing
                        }
                        break;

                    default:
                        break;
                }
            });
        });
    });
});
