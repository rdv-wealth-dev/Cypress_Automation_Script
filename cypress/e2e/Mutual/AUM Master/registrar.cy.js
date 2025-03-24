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

    it('Validates the table data for each column', () => {
        // Define regex patterns for currency and percentage formats
        const currencyPattern = /^\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/; // Matches values like 4,97,19,138.45
        const percentagePattern = /^\d+(\.\d+)?%$/; // Matches values like 122.91%

        // Define the expected values for each row
        const expectedData = [
            {
                registrar: 'CAMS',
                investment: '4,97,19,138.45',
                divPaid: '17,31,409.86',
                divReinv: '31,010.00',
                aum: '10,90,98,817.96',
                absReturn: '122.91%',
                amcWeightage: '73.93%',
            },
            {
                registrar: 'KARVY',
                investment: '86,46,986.35',
                divPaid: '5,01,508.23',
                divReinv: '16,660.00',
                aum: '3,84,67,741.70',
                absReturn: '350.67%',
                amcWeightage: '26.07%',
            },
            {
                registrar: 'Total:',
                investment: '5,83,66,124.80',
                divPaid: '22,32,918.09',
                divReinv: '47,670.00',
                aum: '14,75,66,559.66',
                absReturn: '156.65%',
                amcWeightage: '100%',
            }
        ];

        cy.get('table#example.table tbody', { timeout: 10000 }).should('be.visible');
        

        // Iterate through each row and validate
        cy.get('table#example').each(($row, rowIndex) => {
            // Get the cells for each row
            const cells = $row.find('td');

            // Validate the number of columns (7 columns per row)
            expect(cells.length).to.eq(7, `Row ${rowIndex + 1} should have 7 columns`);

            // Validate data for each cell
            cy.wrap(cells).eq(0).invoke('text').should('equal', expectedData[rowIndex].registrar);
            cy.wrap(cells).eq(1).invoke('text').should('match', currencyPattern).and('equal', expectedData[rowIndex].investment);
            cy.wrap(cells).eq(2).invoke('text').should('match', currencyPattern).and('equal', expectedData[rowIndex].divPaid);
            cy.wrap(cells).eq(3).invoke('text').should('match', currencyPattern).and('equal', expectedData[rowIndex].divReinv);
            cy.wrap(cells).eq(4).invoke('text').should('match', currencyPattern).and('equal', expectedData[rowIndex].aum);
            cy.wrap(cells).eq(5).invoke('text').should('match', percentagePattern).and('equal', expectedData[rowIndex].absReturn);
            cy.wrap(cells).eq(6).invoke('text').should('match', percentagePattern).and('equal', expectedData[rowIndex].amcWeightage);
        });
    });
});
