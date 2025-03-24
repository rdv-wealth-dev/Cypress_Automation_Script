const { mongoconfig, login } = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig')// Adjust the path as necessary


describe('Asset Report and Mutual Fund Report', () => {
    let AccidentalValue = [];
   

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    // Test_Case 3: Accidental (GI Policy) Report Test
    it('validate the Accidental Data', () => {
        login();

        // For the Acccidental section in the report
        cy.get('#accSectionHead_8733 > .m-tab').click();

        // Extract the data from the web page (accidental section)
        cy.get('#accSectionData_8733 > .panel-body')
            .find('table')
            .find('tbody')
            .children('tr')
            //.filter(':even')
            //.filter('[showhide="show"]')
            .each(($row, index) => {
                let DataObject = {};
                cy.wrap($row)
                    .find('td')
                    .each(($cell, cellIndex) => {
                        const cellText = $cell.text().trim();

                        switch (cellIndex) {
                            case 0: DataObject.CompanyName = cellText; break;
                            case 1: DataObject.PolicyNumber = cellText; break;
                            case 2: DataObject.SchemeName = cellText; break;
                            case 3: DataObject.PremiumAmt = cellText; break;
                            case 4: DataObject.RiskCoverage = cellText; break;
                            case 5: DataObject.StartDate = cellText; break;
                            case 6: DataObject.RenewalDate = cellText; break;
                        }
                    });
                    AccidentalValue.push(DataObject);
            });

        // Log the rowsData for debugging
        cy.log('Rows data:', AccidentalValue);  // Log the data from the web for inspection

        //Validate the web report data
        AccidentalValue.forEach((row, index) => {
            cy.log(`Validating row ${index + 1}: ${JSON.stringify(row)}`);

            // Assertions for each field in row data
            cy.wrap(row).should('have.property', 'CompanyName').and('not.be.empty');
            cy.wrap(row).should('have.property', 'PolicyNumber').and('not.be.empty');
            cy.wrap(row).should('have.property', 'SchemeName').and('not.be.empty');
            cy.wrap(row).should('have.property', 'PremiumAmt').and('not.be.empty');
            cy.wrap(row).should('have.property', 'RiskCoverage').and('not.be.empty');
            cy.wrap(row).should('have.property', 'StartDate').and('not.be.empty');
            cy.wrap(row).should('have.property', 'RenewalDate').and('not.be.empty');
        });
    });

    // // Test_Case : Mysql Test for Accidental Report
    it('Validate the Connection For MySQL & Validate the Accidental Data Against Web Data', () => {
        // Use dynamic table
        cy.task('testMySQLConnection', {
            tableName: dbConfig.config.tableName7,
            whereCondition: dbConfig.config.whereCondition7
        }).then((result) => {
            expect(result.success).to.be.true;
    
            if (result.data && result.data.length > 0) {
                let matchedRecords = [];
                let mismatchedRecords = [];
                cy.log('Data found in the table.', result.data);
    
                // Iterate through each row in the MySQL result
                result.data.forEach((row, index) => {
                    cy.log('Row data from MySQL:', row);
    
                    // Assuming `allMutualFundValues` is an array with data to compare
                    let rowsData = AccidentalValue[index]; // Get corresponding data from allMutualFundValues
                    
                    let isMatch = false; // Initialize match flag
    
                    // Compare SchemeName and FolioNumber between the rows
                    if (rowsData && rowsData.SchemeName === row.schemeName && rowsData.PolicyNumber === row.policyNumber) {
                        isMatch = true;
                    }
    
                    // Push the result to matched or mismatched records
                    if (isMatch) {
                        matchedRecords.push(row); // Store matched data
                    } else {
                        mismatchedRecords.push(row); // Store mismatched data
                    }
                });
    
                // Log matched and mismatched records
                cy.log('Matched Records:', matchedRecords);
                cy.log('Mismatched Records:', mismatchedRecords);
    
            } else {
                cy.log('No data found in the eq_holding table.');
            }
        });
    });
});