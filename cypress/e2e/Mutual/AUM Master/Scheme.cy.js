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
        cy.get('#main-content-wrapper > div > div > div:nth-child(2) > div > a').should('be.visible').click();

        // Select dates 
        cy.get('select#aumReportDate').select('2024-08-18');
    
        // Click on Show button
        cy.get('#btn_web').click();
        cy.wait(6000);  // Wait for the page to load

        // Define regex patterns for currency and percentage
        const percentagePattern = /^\d+(\.\d+)?%$/; // e.g., 202.70%
        const currencyPattern = /^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/; // e.g., 40,85,810.04

        cy.get('#datatable_wrapper tbody', { timeout: 10000 }).should('exist'); 
        // Wait for the table rows to be present and have content
        cy.get('#datatable_wrapper tbody tr')
            .should('have.length.greaterThan', 0)  // Ensure there is at least one row
            .then(($rows) => {
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

                        // 1Yr Validation (Column 4)
                        cy.wrap(cells).eq(3).invoke('text').then((text) => {
                            const cleanedText = text.trim();
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(percentagePattern);
                            }
                        });

                        // 3Yr Validation (Column 5)
                        cy.wrap(cells).eq(4).invoke('text').then((text) => {
                            const cleanedText = text.trim();
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(percentagePattern);
                            }
                        });

                        // 5Yr Validation (Column 6)
                        cy.wrap(cells).eq(5).invoke('text').then((text) => {
                            const cleanedText = text.trim();
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(percentagePattern);
                            }
                        });

                        // SI Validation (Column 7) - Currency Validation
                        cy.wrap(cells).eq(6).invoke('text').then((text) => {
                            const cleanedText = text.trim().replace(/[^\d.,]/g, '');
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(currencyPattern);
                            }
                        });

                        // Investment Validation (Column 8)
                        cy.wrap(cells).eq(7).invoke('text').then((text) => {
                            const cleanedText = text.trim().replace(/,/g, '');
                            if (cleanedText !== '') {
                                const isCurrency = !isNaN(parseFloat(cleanedText)) && isFinite(cleanedText);
                                expect(isCurrency, `Expected currency format but got '${cleanedText}'`).to.be.true;
                            }
                        });

                        // Div.Paid Validation (Column 9) - Currency Validation
                        cy.wrap(cells).eq(8).invoke('text').then((text) => {
                            const cleanedText = text.trim().replace(/[^\d.,]/g, '');
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(currencyPattern);
                            }
                        });

                        // Div.Reinv Validation (Column 10) - Currency Validation
                        cy.wrap(cells).eq(9).invoke('text').then((text) => {
                            const cleanedText = text.trim().replace(/[^\d.,]/g, '');
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(currencyPattern);
                            }
                        });

                        // AUM Validation (Column 11) - Currency Validation
                        cy.wrap(cells).eq(10).invoke('text').then((text) => {
                            const cleanedText = text.trim().replace(/[^\d.,]/g, '');
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(currencyPattern);
                            }
                        });

                        // Abs.Return Validation (Column 12) - Percentage Validation
                        cy.wrap(cells).eq(11).invoke('text').then((text) => {
                            const cleanedText = text.trim();
                            if (cleanedText !== '') {
                                expect(cleanedText).to.match(percentagePattern);
                            }
                        });
                    } else {
                        cy.log(`Row ${rowIndex} has no cells.`);
                    }
                });
            });
    });
});
