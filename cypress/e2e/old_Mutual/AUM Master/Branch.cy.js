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

    it('Validate the Report of AUM By Branch', () => {
        cy.get('#main-content-wrapper > div > div > div:nth-child(4) > div > a').should('be.visible').click();
        // Select dates 
        cy.get('#aumReportDate').select('2024-08-18');
        // Click on Show button
        cy.get('#btn_web').click();
        cy.wait(6000);  // Wait for the page to load

        // Define regex patterns for currency, percentage, and branch name
        const percentagePattern = /^\d+(\.\d+)?%$/; // e.g., 115.95%
        const currencyPattern = /^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/; // e.g., 90,58,061.89
        const branchPattern = /^[A-Za-z\s\[\]\d]+$/; // Matches Branch Name with square brackets, e.g., "unmapped[B_123]"

        cy.get('#example tbody tr').each(($row, rowIndex) => {
            const cells = $row.find('td'); // Find all td cells in the current row

            cy.wrap(cells).each((cell, cellIndex) => {
                const cellText = Cypress.$(cell).text().trim();
                console.log("cell Index : ", cellIndex);

                switch (cellIndex) {
                    case 0: // Branch Name (Column 1)
                        let branchName = cellText ? cellText.trim() : '';  // Handle null or undefined cellText
                        console.log(`Trimmed branch name: "${branchName}"`); // Log the name for debugging

                        // Check if the branch name matches the expected pattern
                        if (branchPattern.test(branchName)) {
                            console.log(`Valid branch name: ${branchName}`);
                            expect(branchName).to.match(branchPattern); // Optionally, assert the validity
                        } else {
                            console.error(`Invalid branch name: ${branchName}`);
                            assert.fail(`Invalid branch name format: ${branchName}`);
                        }
                        break;

                    case 1: // Investment (Column 2)
                        // Check if the Investment value is present (not empty)
                        if (cellText.trim() !== '') {
                            const investmentValue = parseFloat(cellText.replace(/,/g, ''));
                            expect(investmentValue).to.be.greaterThan(0);  // Investment should be greater than 0
                        } else {
                            expect(cellText).to.equal('');  // Assert that the cell is empty if no investment exists
                        }
                        break;

                    case 2: // Div.Paid (Column 3)
                        // Check if Div.Paid value is present and not empty
                        if (cellText.trim() !== '') {
                            const divPaidValue = parseFloat(cellText.replace(/,/g, ''));
                            //expect(divPaidValue).to.be.greaterThan(0);  // Div.Paid should be a positive value if present
                        } else {
                            expect(cellText).to.equal('');  // Assert that it's empty if Div.Paid is missing
                        }
                        break;

                    case 3: // Div.Reinv (Column 4)
                        // Allow Div.Reinv to be 0 (zero), but if it's not zero, ensure it is greater than 0
                        if (cellText.trim() !== '') {
                            const divReinvValue = parseFloat(cellText.replace(/,/g, ''));
                            if (divReinvValue >= 0) {
                                // Div.Reinv can be 0, or greater than 0
                                expect(divReinvValue).to.be.greaterThan(-1);  // Allow 0 or positive values
                            } else {
                                assert.fail(`Invalid Div.Reinv value: ${divReinvValue}. It cannot be negative.`);
                            }
                        } else {
                            expect(cellText).to.equal('');  // Assert that it's empty if Div.Reinv is missing
                        }
                        break;

                    case 4: // AUM (Column 5)
                        // Check if the AUM value is present (not empty)
                        if (cellText.trim() !== '') {
                            const aumValue = parseFloat(cellText.replace(/,/g, '')); // Remove commas and convert to number
                            expect(aumValue).to.be.greaterThan(0);  // AUM should be greater than 0
                        } else {
                            expect(cellText).to.equal('');  // Assert that the cell is empty if no AUM exists
                        }
                        break;

                    default:
                        break;
                }
            });
        });
    });
});
