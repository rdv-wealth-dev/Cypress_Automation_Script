const { mongoconfig, login } = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig')// Adjust the path as necessary


describe('Asset Report and Mutual Fund Report', () => {
    let liInsuranceValue = [];
    let rowsData = [];

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test
    });

    // Test_Case 3: Life Insurance Report Test
    it('validate the Life Insurance Data', () => {
        login();

        // For the Life Insurance section in the report
        cy.get('#liSectionHead_8733 > .m-tab').click();

        // Extract the data from the web page (Life Insurance section)
        cy.get('#liSectionData_8733 > .panel-body')
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
                            case 0: DataObject.SchemeType  = cellText; break;
                            case 1: DataObject.SchemeName  = cellText; break;
                            case 2: DataObject.PolicyNumber  = cellText; break;
                            case 3: DataObject.Premium  = cellText; break;
                            case 4: DataObject.LastPremDate  = cellText; break;
                            case 5: DataObject.TotalInvested  = cellText; break;
                            case 6: DataObject.RiskCoverage  = cellText; break;
                            case 7: DataObject.PaymentMode   = cellText; break;
                            case 8: DataObject.StartDate   = cellText; break;
                            case 9: DataObject.MaturityDate    = cellText; break;
                            
                        }
                    });
                    liInsuranceValue.push(DataObject);
            });

        // Log the rowsData for debugging
        cy.log('Rows data:', liInsuranceValue);  // Log the data from the web for inspection

        //Validate the web report data
        liInsuranceValue.forEach((row, index) => {
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

    // // Test_Case : Mysql Test for Life Insurance Report
    it('Validate the Connection For MySQL & Validate the Life Insurance Data Against web Data', () => {
        // Use dynamic table
        cy.task('testMySQLConnection', {
            tableName: dbConfig.config.tableName11,
            whereCondition: dbConfig.config.whereCondition11
        }).then((result) => {
            expect(result.success).to.be.true;

            if (result.data && result.data.length > 0) {
                let matchedRecords = [];
                let mismatchedRecords = [];
                cy.log('Data found in the table.', result.data);

                 //Sort the Life Insurance array before iterating, if you want to sort by SchemeName
                 liInsuranceValue.sort((a, b) => {
                    if (a.PolicyNumber < b.PolicyNumber) return -1;
                    if (a.PolicyNumber > b.PolicyNumber) return 1;
                    return 0;
                });
                cy.log('Rows data 2:', liInsuranceValue);
                // Iterate through each row in the MySQL result
                result.data.forEach((row, index) => {
                    cy.log('Row data from MySQL:', row);
    
                    let rowsData = liInsuranceValue[index]; // Get corresponding data from allMutualFundValues
                    
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