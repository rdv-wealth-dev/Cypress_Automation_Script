const { mongoconfig, login } = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig')// Adjust the path as necessary


describe('Asset Report and Mutual Fund Report', () => {
    let AccidentalValue = [];
    let rowsData = [];

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
                            case 1: DataObject.CompanyName = cellText; break;
                            case 2: DataObject.PolicyNumber = cellText; break;
                            case 3: DataObject.SchemeName = cellText; break;
                            case 4: DataObject.PremiumAmt = cellText; break;
                            case 5: DataObject.RiskCoverage = cellText; break;
                            case 6: DataObject.StartDate = cellText; break;
                            case 7: DataObject.RenewalDate = cellText; break;
                        }
                    });
                rowsData.push(DataObject);
            });

        // Log the rowsData for debugging
        cy.log('Rows data:', rowsData);  // Log the data from the web for inspection

        //Validate the web report data
        rowsData.forEach((row, index) => {
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

    // // Test_Case 4: Mysql Test for Accidental Report
    it('Validate the Connection For MySQL & Validate the Accidental Data Against web Data', () => {
      // Use dynamic table
      cy.task('testMySQLConnection', {
          tableName: dbConfig.config.tableName7,
          whereCondition: dbConfig.config.whereCondition7
      }).then((result) => {
          expect(result.success).to.be.true;
          cy.log(result.message);
  
          if (result.data && result.data.length > 0) {
              result.data.forEach((dbRow, dbIndex) => {
                  cy.log(`Row data from MySQL: ${JSON.stringify(dbRow)}`);
  
                  // Validate the extracted equity data against MySQL data
                  rowsData.forEach((webRow, webIndex) => {
                      // Adjust the mappings based on your database and UI data
                      if (
                          webRow.CompanyName === dbRow.schemeName && 
                          webRow.PolicyNumber === dbRow.CompanyName
                      ) {
                          cy.log(`Matching row found: ${webRow.CompanyName} - ${webRow.PolicyNumber}`);
  
                          // Validate each field for the given data
                          cy.wrap(webRow.CompanyName).should('equal', dbRow.CompanyName);
                          cy.wrap(webRow.PolicyNumber).should('equal', dbRow.PolicyNumber);
                          cy.wrap(webRow.SchemeName).should('equal', dbRow.SchemeName);
                          cy.wrap(webRow.PremiumAmt).should('equal', dbRow.PremiumAmt);
                          cy.wrap(webRow.RiskCoverage).should('equal', dbRow.RiskCoverage);
                          cy.wrap(webRow.StartDate).should('equal', dbRow.StartDate);
                          cy.wrap(webRow.RenewalDate).should('equal', dbRow.RenewalDate);
                      }
                  });
              });
          } else {
              cy.log('No data found in the eq_holding table.');
          }
      });
  });
  


});