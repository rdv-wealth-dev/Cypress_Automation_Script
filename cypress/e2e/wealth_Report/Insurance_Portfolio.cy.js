const {mongoconfig,login} = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig')// Adjust the path as necessary


describe('Asset Report and Mutual Fund Report', () => {
  let rowsData = [];
  let AccidentalValue = [];
  let mediclaimValue = [];
  let vehicleValue = [];
  let otherValue = [];
  let liInsuranceValue = [];

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

//Test_case 15: Accidental (GI Policy) Report Test
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
  
  //Test_Case 16: Mysql Test for Accidental Report
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
  
      // Test_Case 17: Mediclaim (GI Policy) Report Test
      it('validate the Mediclaim Data', () => {
        login();
  
        // For the Mediclaim section in the report
        cy.get('#medSectionHead_8733 > .m-tab').click();
  
        // Extract the data from the web page (Mediclaim section)
        cy.get('#medSectionData_8733 > .panel-body')
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
                            case 4: DataObject.RiskCovrage = cellText; break;
                            case 5: DataObject.StartDate = cellText; break;
                            case 6: DataObject.RenewalDate = cellText; break;
                        }
                    });
                mediclaimValue.push(DataObject);
            });
  
        // Log the mediclaimValue for debugging
        cy.log('Rows data:', mediclaimValue);  // Log the data from the web for inspection
  
        //Validate the web report data
        mediclaimValue.forEach((row, index) => {
            cy.log(`Validating row ${index + 1}: ${JSON.stringify(row)}`);
  
            // Assertions for each field in row data
            cy.wrap(row).should('have.property', 'CompanyName').and('not.be.empty');
            cy.wrap(row).should('have.property', 'PolicyNumber').and('not.be.empty');
            cy.wrap(row).should('have.property', 'SchemeName').and('not.be.empty');
            cy.wrap(row).should('have.property', 'PremiumAmt').and('not.be.empty');
            cy.wrap(row).should('have.property', 'RiskCovrage').and('not.be.empty');
            cy.wrap(row).should('have.property', 'StartDate').and('not.be.empty');
            cy.wrap(row).should('have.property', 'RenewalDate').and('not.be.empty');
  
        });
      });
  
        // Test_Case 18: Mysql Test for mediclaim Report
          it('Validate the Connection For MySQL & Validate the Mediclaim Data Against Web Data', () => {
              // Use dynamic table
              cy.task('testMySQLConnection', {
                  tableName: dbConfig.config.tableName9,
                  whereCondition: dbConfig.config.whereCondition9
              }).then((result) => {
                  expect(result.success).to.be.true;
      
                  if (result.data && result.data.length > 0) {
                      let matchedRecords = [];
                      let mismatchedRecords = [];
                      cy.log('Data found in the table.', result.data);
      
                      // Sort the mediclaimValue array before iterating, if you want to sort by SchemeName
                      mediclaimValue.sort((a, b) => {
                          if (a.SchemeName < b.SchemeName) return -1;
                          if (a.SchemeName > b.SchemeName) return 1;
                          return 0;
                      });
      
                      // Iterate through each row in the MySQL result
                      result.data.forEach((row, index) => {
                          cy.log('Row data from MySQL:', row);
      
                          // Get corresponding data from mediclaimValue (after sorting)
                          let rowsData = mediclaimValue[index];
      
                          let isMatch = false; // Initialize match flag
      
                          // Compare SchemeName and PolicyNumber between the rows
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
  
       // Test_Case 19: Vehicle (GI Policy) Report Test
       it('validate the Vehicle Data', () => {
        login();
  
        // For the Acccidental section in the report
        cy.get('#vehicleSectionHead_8733 > .m-tab').click();
  
        // Extract the data from the web page (accidental section)
        cy.get('#vehicleSectionData_8733 > .panel-body')
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
                            case 2: DataObject.VehicleName = cellText; break;
                            case 3: DataObject.VehicleNumber = cellText; break;
                            case 4: DataObject.PremiumAmt = cellText; break;
                            case 5: DataObject.InsuredValue = cellText; break;
                            case 6: DataObject.StartDate = cellText; break;
                            case 7: DataObject.RenewalDate = cellText; break;
                        }
                    });
                    vehicleValue.push(DataObject);
            });
  
        // Log the rowsData for debugging
        cy.log('Rows data:', vehicleValue);  // Log the data from the web for inspection
  
        //Validate the web report data
        vehicleValue.forEach((row, index) => {
            cy.log(`Validating row ${index + 1}: ${JSON.stringify(row)}`);
  
            // Assertions for each field in row data
            cy.wrap(row).should('have.property', 'CompanyName').and('not.be.empty');
            cy.wrap(row).should('have.property', 'PolicyNumber').and('not.be.empty');
            cy.wrap(row).should('have.property', 'VehicleName').and('not.be.empty');
            cy.wrap(row).should('have.property', 'VehicleNumber').and('not.be.empty');
            cy.wrap(row).should('have.property', 'PremiumAmt').and('not.be.empty');
            cy.wrap(row).should('have.property', 'InsuredValue').and('not.be.empty');
            cy.wrap(row).should('have.property', 'StartDate').and('not.be.empty');
            cy.wrap(row).should('have.property', 'RenewalDate').and('not.be.empty');
  
        });
    });    
  
     // Test_Case 20: Mysql Test for Vehicle Report
        it('Validate the Connection For MySQL & Validate the Vehicle Data Against web Data', () => {
            // Use dynamic table
            cy.task('testMySQLConnection', {
                tableName: dbConfig.config.tableName8,
                whereCondition: dbConfig.config.whereCondition8
            }).then((result) => {
                expect(result.success).to.be.true;
    
                if (result.data && result.data.length > 0) {
                    let matchedRecords = [];
                    let mismatchedRecords = [];
                    cy.log('Data found in the table.', result.data);
    
                     // Sort the mediclaimValue array before iterating, if you want to sort by SchemeName
                    //  vehicleValue.sort((a, b) => {
                    //     if (a.VehicleName < b.VehicleName) return -1;
                    //     if (a.VehicleName > b.VehicleName) return 1;
                    //     return 0;
                    // });
        
                    // Iterate through each row in the MySQL result
                    result.data.forEach((row, index) => {
                        cy.log('Row data from MySQL:', row);
        
                        let rowsData = vehicleValue[index]; // Get corresponding data from allMutualFundValues
                        
                        let isMatch = false; // Initialize match flag
                       
                            // Compare SchemeName and FolioNumber between the rows
                            if (rowsData && rowsData.VehicleName === row.vehicleName && rowsData.PolicyNumber === row.policyNumber) {
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
  
  // Test_Case 21: Other (GI Policy) Report Test
  it('validate the Other Data', () => {
    login();
  
    // For the Other section in the report
    cy.get('#otherSectionHead_8733 > .m-tab').click();
  
    // Extract the data from the web page (Other section)
    cy.get('#otherSectionData_8733 > .panel-body')
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
                        case 4: DataObject.RiskCovrage = cellText; break;
                        case 5: DataObject.StartDate = cellText; break;
                        case 6: DataObject.RenewalDate = cellText; break;
                    }
                });
            otherValue.push(DataObject);
        });
  
    // Log the rowsData for debugging
    cy.log('Rows data:', otherValue);  // Log the data from the web for inspection
  
    //Validate the web report data
    otherValue.forEach((row, index) => {
        cy.log(`Validating row ${index + 1}: ${JSON.stringify(row)}`);
  
        // Assertions for each field in row data
        cy.wrap(row).should('have.property', 'CompanyName').and('not.be.empty');
        cy.wrap(row).should('have.property', 'PolicyNumber').and('not.be.empty');
        cy.wrap(row).should('have.property', 'SchemeName').and('not.be.empty');
        cy.wrap(row).should('have.property', 'PremiumAmt').and('not.be.empty');
        cy.wrap(row).should('have.property', 'RiskCovrage').and('not.be.empty');
        cy.wrap(row).should('have.property', 'StartDate').and('not.be.empty');
        cy.wrap(row).should('have.property', 'RenewalDate').and('not.be.empty');
  
    });
  });
  
   // // Test_Case 22: Mysql Test for Other Report
      it('Validate the Connection For MySQL & Validate the Other Data Against web Data', () => {
          // Use dynamic table
          cy.task('testMySQLConnection', {
              tableName: dbConfig.config.tableName10,
              whereCondition: dbConfig.config.whereCondition10
          }).then((result) => {
              expect(result.success).to.be.true;
  
              if (result.data && result.data.length > 0) {
                  let matchedRecords = [];
                  let mismatchedRecords = [];
                  cy.log('Data found in the table.', result.data);
  
                  // Sort the mediclaimValue array before iterating, if you want to sort by SchemeName
                  otherValue.sort((a, b) => {
                      if (a.SchemeName < b.SchemeName) return -1;
                      if (a.SchemeName > b.SchemeName) return 1;
                      return 0;
                  });
  
                  // Iterate through each row in the MySQL result
                  result.data.forEach((row, index) => {
                      cy.log('Row data from MySQL:', row);
  
                      // Get corresponding data from mediclaimValue (after sorting)
                      let rowsData = otherValue[index];
  
                      let isMatch = false; // Initialize match flag
  
                      // Compare SchemeName and PolicyNumber between the rows
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
      
  
      // Test_Case 23: Life Insurance Report Test
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
  
    // // Test_Case 24: Mysql Test for Life Insurance Report
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