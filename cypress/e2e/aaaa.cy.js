const {mongoconfig,login} = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig')// Adjust the path as necessary


describe('Asset Report and Mutual Fund Report', () => {
  let allMutualFundValues = [];
  let PCodeValues = [];
  let uniquePcodeValues = [];
  let rowsData = []; 
  let PMSAssetData = [];
  let schemeData = []; 
  let accData = []; 
  let accString = '';
  let fdBondData = [];
  let fdBondAccData = [];
  let fdBondAccString = '';
  let commodityData = []; 
  let propertyData = [];

  before(() => {
    // Login once before all tests
    login();
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  // Test_Case 3: Equity Report Test
  it('validate the Equity Data', () => {
    // For the Equity section in the report
    cy.get('#equitySectionHead_8733 > .m-tab').click();
    // Extract the data from the web page (Equity section)
    cy.get('#equitySectionData_8733 > .panel-body')
      .find('table')
      .find('tbody')
      .children('tr')
      .filter(':even')
      .filter('[showhide="show"]')
      .each(($row, index) => {
        let rowDataObject = {};
        cy.wrap($row)
          .find('td')
          .each(($cell, cellIndex) => {
            const cellText = $cell.text().trim();

            switch (cellIndex) {
              case 1: rowDataObject.CompanyName = cellText; break;
              case 2: rowDataObject.Exchange = cellText; break;
              case 3: rowDataObject.Quantity = cellText; break;
              case 4: rowDataObject.AvgRate = cellText; break;
              case 5: rowDataObject.InvestedAmount = cellText; break;
              case 6: rowDataObject.CurrentRate = cellText; break;
              case 7: rowDataObject.Valuation = cellText; break;
              case 8: rowDataObject.AbsReturn = cellText; break;
              case 9: rowDataObject.XIRR = cellText; break;
            }
          });
        rowsData.push(rowDataObject);  
      });

    // Log the rowsData for debugging
    cy.log('Rows data:', rowsData);  // Log the data from the web for inspection

    //Validate the web report data
    rowsData.forEach((row, index) => {
      cy.log(`Validating row ${index + 1}: ${JSON.stringify(row)}`);

      // Assertions for each field in row data
      cy.wrap(row).should('have.property', 'CompanyName').and('not.be.empty');
      cy.wrap(row).should('have.property', 'Exchange').and('not.be.empty');
      cy.wrap(row).should('have.property', 'Quantity').and('not.be.empty');
      cy.wrap(row).should('have.property', 'AvgRate').and('not.be.empty');
      cy.wrap(row).should('have.property', 'InvestedAmount').and('not.be.empty');
      cy.wrap(row).should('have.property', 'CurrentRate').and('not.be.empty');
      cy.wrap(row).should('have.property', 'Valuation').and('not.be.empty');
      cy.wrap(row).should('have.property', 'AbsReturn').and('not.be.empty');
      cy.wrap(row).should('have.property', 'XIRR').and('not.be.empty');
    });
  });

  // Test_Case 4: Mysql Test for Equity Report
it('Validate the Connection For MySQL & Validate the Equity Data Against web Data ', () => {
    // Use dynamic table
    cy.task('testMySQLConnection', { 
      tableName: dbConfig.config.tableName2, 
      whereCondition: dbConfig.config.whereCondition2
    }).then((result) => {
      expect(result.success).to.be.true;
      cy.log(result.message);

      if (result.data && result.data.length > 0) {
        result.data.forEach(row => {
          cy.log(`Row data from MySQL: ${JSON.stringify(row)}`);

           // Validate the extracted equity data against MySQL data
          rowsData.forEach(webRow => {
            const isMatch = webRow.CompanyName === row.CompanyName && webRow.Quantity === row.Quantity;
            if (isMatch) {
              matchedRecords.push(row);
            } else {
              mismatchedRecords.push(row);
            }
          });

          // Print formatted matched records
          cy.log('\n=== EQUITY MATCHED RECORDS ===');
          cy.log(`Total Matched: ${matchedRecords.length}`);
          matchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Company: ${record.CompanyName}`);
            cy.log(`Quantity: ${record.Quantity}`);
            cy.log(`Valuation: ${record.Valuation}`);
          });

          // Print formatted mismatched records
          cy.log('\n=== EQUITY MISMATCHED RECORDS ===');
          cy.log(`Total Mismatched: ${mismatchedRecords.length}`);
          mismatchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Company: ${record.CompanyName}`);
            cy.log(`Quantity: ${record.Quantity}`);
            cy.log(`Valuation: ${record.Valuation}`);
            cy.log('Mismatch Details:');
            const webData = rowsData.find(
              web => web.CompanyName === record.CompanyName && web.Quantity === record.Quantity
            );
            if (webData) {
              cy.log(`- Web Quantity: ${webData.Quantity} vs DB Quantity: ${record.Quantity}`);
              cy.log(`- Web Valuation: ${webData.Valuation} vs DB Valuation: ${record.Valuation}`);
            } else {
              cy.log('- No matching web data found');
            }
          });
          });
        });
      } else {
        cy.log('No data found in the eq_holding table.');
      }
    });
  });

  //Test_case 5: Post Office Test
  it('validate the Post Office Data', () => {

    // For the Postal section in the report
    cy.get('#poSectionHead_8733 > .m-tab').click();
    // Extract data from the web page
    cy.get('#poSectionData_8733 > .panel-body')
      .find('table')
      .find('tbody')
      .children('tr')
      //.filter(':even')
      //.filter('[showhide="show"]')
      .each(($row, index) => {
        let schemeRowData1 = {};
        cy.wrap($row)
          .find('td')
          .each(($cell, cellIndex) => {
            const cellText = $cell.text().trim();

            switch (cellIndex) {
              case 0: schemeRowData1.SchemeName = cellText; break;
              case 1: schemeRowData1.AccountNumber = cellText; break;
              case 2: schemeRowData1.SchemeType = cellText; break;
              case 3: schemeRowData1.IssueDate = cellText; break;
              case 4: schemeRowData1.Investment = cellText; break;
              case 5: schemeRowData1.Term = cellText; break;
              case 6: schemeRowData1.Interest = cellText; break;
              case 7: schemeRowData1.CurrentValue = cellText; break;
              case 8: schemeRowData1.MaturityDate = cellText; break;
              case 9: schemeRowData1.MaturityAmount = cellText; break;
            }
          });
        schemeData.push(schemeRowData1);  
      })
      .then(() => {
        // Now, after all rows are processed, populate accData
        accData = schemeData.map(row => row.AccountNumber);
        accString = accData.map(item => `'${item}'`).join(', ');;

        cy.log('Investment scheme data:', schemeData);  // Log the data from the web for inspection
        cy.log('Investment scheme AccountNumber:', accData); // Log all AccountNumbers separately
      });

    // Validate the web report data
    schemeData.forEach((row, index) => {
      cy.log(`Validating scheme row ${index + 1}: ${JSON.stringify(row)}`);

      // Assertions for each field in row data
      cy.wrap(row).should('have.property', 'SchemeName').and('not.be.empty');
      cy.wrap(row).should('have.property', 'AccountNumber').and('not.be.empty');
      cy.wrap(row).should('have.property', 'SchemeType').and('not.be.empty');
      cy.wrap(row).should('have.property', 'IssueDate').and('not.be.empty');
      cy.wrap(row).should('have.property', 'Investment').and('not.be.empty');
      cy.wrap(row).should('have.property', 'Term').and('not.be.empty');
      cy.wrap(row).should('have.property', 'Interest').and('not.be.empty');
      cy.wrap(row).should('have.property', 'CurrentValue').and('not.be.empty');
      cy.wrap(row).should('have.property', 'MaturityDate').and('not.be.empty');
      cy.wrap(row).should('have.property', 'MaturityAmount').and('not.be.empty');
    });
  });

  // Test_Case 6: Mysql Test for Post office Report
 it('Validate the Connection For MySQL & Validate the Post Office Data Against web Data', () => {
    cy.log("first",dbConfig.config.whereCondition3);

    // Connect to MySQL and fetch the data
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName3,
      whereCondition: dbConfig.config.whereCondition3
    }).then((result) => {
      cy.log("sec",result);

      expect(result.success).to.be.true;
      cy.log(result.message);

      if (result.data && result.data.length > 0) {
        result.data.forEach(row => {
          cy.log(`Row data from MySQL: ${JSON.stringify(row)}`);

          // Compare each scheme from the web (scraped data) with the corresponding row from MySQL
          schemeData.forEach(schemeRow => {
            const isMatch = schemeRow.SchemeName === row.SchemeName;
            if (isMatch) {
              matchedRecords.push(row);
            } else {
              mismatchedRecords.push(row);
            }
          });

          // Print formatted matched records
          cy.log('\n=== POST OFFICE MATCHED RECORDS ===');
          cy.log(`Total Matched: ${matchedRecords.length}`);
          matchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Scheme: ${record.SchemeName}`);
            cy.log(`Account: ${record.AccountNumber}`);
            cy.log(`Current Value: ${record.CurrentValue}`);
          });

          // Print formatted mismatched records
          cy.log('\n=== POST OFFICE MISMATCHED RECORDS ===');
          cy.log(`Total Mismatched: ${mismatchedRecords.length}`);
          mismatchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Scheme: ${record.SchemeName}`);
            cy.log(`Account: ${record.AccountNumber}`);
            cy.log(`Current Value: ${record.CurrentValue}`);
            cy.log('Mismatch Details:');
            const webData = schemeData.find(
              web => web.SchemeName === record.SchemeName
            );
            if (webData) {
              cy.log(`- Web Account: ${webData.AccountNumber} vs DB Account: ${record.AccountNumber}`);
              cy.log(`- Web Current Value: ${webData.CurrentValue} vs DB Current Value: ${record.CurrentValue}`);
            } else {
              cy.log('- No matching web data found');
            }
          });
          });
        });
      } else {
        cy.log('No data found in the investment_schemes table.');
      }
    });
  });

//Test_case 7: FD & Bond Test
it('validate the FD & Bond Data', () => {

  // For the Postal section in the report
  cy.get('#fdSectionHead_8733 > .m-tab').click();

  // Extract data from the web page
  cy.get('#fdSectionData_8733 > .panel-body')
    .find('table')
    .find('tbody')
    .children('tr')
    //.filter(':even')
    //.filter('[showhide="show"]')
    .each(($row) => {
      let fdBondRowData = {};
      cy.wrap($row)
        .find('td')
        .each(($cell, cellIndex) => {
          const cellText = $cell.text().trim();
          switch (cellIndex) {
            case 0: fdBondRowData.SchemeName = cellText; break;
            case 1: fdBondRowData.FolioFDNo = cellText; break;
            case 2: fdBondRowData.NameOfIssuer = cellText; break;
            case 3: fdBondRowData.IssueDate = cellText; break;
            case 4: fdBondRowData.Investment = cellText; break;
            case 5: fdBondRowData.Tenure = cellText; break;
            case 6: fdBondRowData.Interest = cellText; break;
            case 7: fdBondRowData.CurrentValue = cellText; break;
            case 8: fdBondRowData.MaturityDate = cellText; break;
            case 9: fdBondRowData.MaturityAmount = cellText; break;
          }
        });
      fdBondData.push(fdBondRowData);
    })
    .then(() => {
      fdBondAccData = fdBondData.map(row => row.FolioFDNo);
      fdBondAccString = fdBondAccData.map(item => `'${item}'`).join(', ');

      cy.log('FD/Bond data:', fdBondData);
      cy.log('FD/Bond FolioFDNo:', fdBondAccData);
    });

  // Validate the FD/Bond report data
  fdBondData.forEach((row, index) => {
    cy.log(`Validating FD/Bond row ${index + 1}: ${JSON.stringify(row)}`);

    // Assertions for each field in row data
    cy.wrap(row).should('have.property', 'SchemeName').and('not.be.empty');
    cy.wrap(row).should('have.property', 'FolioFDNo').and('not.be.empty');
    cy.wrap(row).should('have.property', 'NameOfIssuer').and('not.be.empty');
    cy.wrap(row).should('have.property', 'IssueDate').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Investment').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Tenure').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Interest').and('not.be.empty');
    cy.wrap(row).should('have.property', 'CurrentValue').and('not.be.empty');
    cy.wrap(row).should('have.property', 'MaturityDate').and('not.be.empty');
    cy.wrap(row).should('have.property', 'MaturityAmount').and('not.be.empty');
  });
});

 // Test_Case 8: Mysql Test for FD & Bond Report
it('Validate the Connection For MySQL & Validate the FD & Bond Data Against web Data', () => {
    cy.log("first",dbConfig.config.whereCondition4);

    // Connect to MySQL and fetch the data
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName4,
      whereCondition: dbConfig.config.whereCondition4
    }).then((result) => {
      cy.log(result);

      expect(result.success).to.be.true;
      cy.log(result.message);

      if (result.data && result.data.length > 0) {
        result.data.forEach(row => {
          cy.log(`Row data from MySQL: ${JSON.stringify(row)}`);

          fdBondData.forEach(fdBondRow => {
            const isMatch = fdBondRow.SchemeName === row.SchemeName && fdBondRow.FolioFDNo === row.FolioFDNo;
            if (isMatch) {
              matchedRecords.push(row);
            } else {
              mismatchedRecords.push(row);
            }
          });

          // Print formatted matched records
          cy.log('\n=== FD/BOND MATCHED RECORDS ===');
          cy.log(`Total Matched: ${matchedRecords.length}`);
          matchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Scheme: ${record.SchemeName}`);
            cy.log(`Folio: ${record.FolioFDNo}`);
            cy.log(`Current Value: ${record.CurrentValue}`);
          });

          // Print formatted mismatched records
          cy.log('\n=== FD/BOND MISMATCHED RECORDS ===');
          cy.log(`Total Mismatched: ${mismatchedRecords.length}`);
          mismatchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Scheme: ${record.SchemeName}`);
            cy.log(`Folio: ${record.FolioFDNo}`);
            cy.log(`Current Value: ${record.CurrentValue}`);
            cy.log('Mismatch Details:');
            const webData = fdBondData.find(
              web => web.SchemeName === record.SchemeName && web.FolioFDNo === record.FolioFDNo
            );
            if (webData) {
              cy.log(`- Web Folio: ${webData.FolioFDNo} vs DB Folio: ${record.FolioFDNo}`);
              cy.log(`- Web Current Value: ${webData.CurrentValue} vs DB Current Value: ${record.CurrentValue}`);
            } else {
              cy.log('- No matching web data found');
            }
          });
          });
        });
      } else {
        cy.log('No data found in the fd_bond_report table.');
      }
    });
  });

//Test_case 9: Commodity Test 
it('validate the Commodity Data', () => {

  // For the Commodity section in the report
  cy.get('#commSectionHead_8733 > .m-tab').click();

  // Extract data from the web page for commodity_holding
  cy.get('#commSectionData_8733 > .panel-body')
    .find('table')
    .find('tbody')
    .children('tr')
    .filter(':even')
    .filter('[showhide="show"]')
    .each(($row, index) => {
      let commodityRowData = {};
      cy.wrap($row)
        .find('td')
        .each(($cell, cellIndex) => {
          const cellText = $cell.text().trim();

          switch (cellIndex) {
            case 0: commodityRowData.CompanyName = cellText; break;
            case 1: commodityRowData.Quantity = cellText; break;
            case 2: commodityRowData.AvgRate = cellText; break;
            case 3: commodityRowData.InvestedAmount = cellText; break;
            case 4: commodityRowData.CurrentRatePerGram = cellText; break;
            case 5: commodityRowData.Valuation = cellText; break;
            case 6: commodityRowData.AbsReturn = cellText; break;
            case 7: commodityRowData.XIRR = cellText; break;
          }
        });
      commodityData.push(commodityRowData);  
    });

  // Log the commodityData for debugging
  cy.log('Commodity data:', commodityData);  // Log the data from the web for inspection

  // Validate the web report data
  commodityData.forEach((row, index) => {
    cy.log(`Validating commodity row ${index + 1}: ${JSON.stringify(row)}`);

    // Assertions for each field in row data
    cy.wrap(row).should('have.property', 'CompanyName').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Quantity').and('not.be.empty');
    cy.wrap(row).should('have.property', 'AvgRate').and('not.be.empty');
    cy.wrap(row).should('have.property', 'InvestedAmount').and('not.be.empty');
    cy.wrap(row).should('have.property', 'CurrentRatePerGram').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Valuation').and('not.be.empty');
    cy.wrap(row).should('have.property', 'AbsReturn').and('not.be.empty');
    cy.wrap(row).should('have.property', 'XIRR').and('not.be.empty');
  });
});

// Test_Case 10: Mysql Test for commodity Report
  it('Validate the Connection For MySQL & Validate the Commodity Data Against web Data', () => {
    // Use dynamic table
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName5, 
      whereCondition: dbConfig.config.whereCondition5 
    }).then((result) => {
      expect(result.success).to.be.true;
      cy.log(result.message);

      if (result.data && result.data.length > 0) {
        result.data.forEach(row => {
          cy.log(`Row data from MySQL: ${JSON.stringify(row)}`);

          // Validate the extracted commodity data against MySQL data
          commodityData.forEach(commodityRow => {
            const isMatch = commodityRow.CompanyName === row.CompanyName && commodityRow.Quantity === row.Quantity;
            if (isMatch) {
              matchedRecords.push(row);
            } else {
              mismatchedRecords.push(row);
            }
          });

          // Print formatted matched records
          cy.log('\n=== COMMODITY MATCHED RECORDS ===');
          cy.log(`Total Matched: ${matchedRecords.length}`);
          matchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Company: ${record.CompanyName}`);
            cy.log(`Quantity: ${record.Quantity}`);
            cy.log(`Valuation: ${record.Valuation}`);
          });

          // Print formatted mismatched records
          cy.log('\n=== COMMODITY MISMATCHED RECORDS ===');
          cy.log(`Total Mismatched: ${mismatchedRecords.length}`);
          mismatchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Company: ${record.CompanyName}`);
            cy.log(`Quantity: ${record.Quantity}`);
            cy.log(`Valuation: ${record.Valuation}`);
            cy.log('Mismatch Details:');
            const webData = commodityData.find(
              web => web.CompanyName === record.CompanyName && web.Quantity === record.Quantity
            );
            if (webData) {
              cy.log(`- Web Quantity: ${webData.Quantity} vs DB Quantity: ${record.Quantity}`);
              cy.log(`- Web Valuation: ${webData.Valuation} vs DB Valuation: ${record.Valuation}`);
            } else {
              cy.log('- No matching web data found');
            }
          });
          });
        });
      } else {
        cy.log('No data found in the commodity_holding table.');
      }
    });
  });

//Test_case 11: Real Estate Test 
it('validate the Real Estate Data', () => {

  // For the Property section in the report
  cy.get('#realEstateSectionHead_8733 > .m-tab').click();

  // Extract data from the web page for property_holding
  cy.get('#realEstateSectionData_8733 > .panel-body')
    .find('table')
    .find('tbody')
    .children('tr')
    .filter(':even')
   // .filter('[showhide="show"]')
    .each(($row, index) => {
      let propertyRowData = {};
      cy.wrap($row)
        .find('td')
        .each(($cell, cellIndex) => {
          const cellText = $cell.text().trim();

          switch (cellIndex) {
            case 0: propertyRowData.PropertyType = cellText; break;
            case 1: propertyRowData.PropertyName = cellText; break;
            case 2: propertyRowData.Area = cellText; break;
            case 3: propertyRowData.AvgRate = cellText; break;
            case 4: propertyRowData.InvestedAmount = cellText; break;
            case 5: propertyRowData.CurrentRate = cellText; break;
            case 6: propertyRowData.Valuation = cellText; break;
            case 7: propertyRowData.AbsReturn = cellText; break;
            case 8: propertyRowData.XIRR = cellText; break;
          }
        });
      propertyData.push(propertyRowData);  // Push the row data into propertyData array
    });

  // Log the propertyData for debugging
  cy.log('Property data:', propertyData);  // Log the data from the web for inspection

  // Validate the web report data
  propertyData.forEach((row, index) => {
    cy.log(`Validating property row ${index + 1}: ${JSON.stringify(row)}`);

    // Assertions for each field in row data
    cy.wrap(row).should('have.property', 'PropertyType').and('not.be.empty');
    cy.wrap(row).should('have.property', 'PropertyName').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Area').and('not.be.empty');
    cy.wrap(row).should('have.property', 'AvgRate').and('not.be.empty');
    cy.wrap(row).should('have.property', 'InvestedAmount').and('not.be.empty');
    cy.wrap(row).should('have.property', 'CurrentRate').and('not.be.empty');
    cy.wrap(row).should('have.property', 'Valuation').and('not.be.empty');
    cy.wrap(row).should('have.property', 'AbsReturn').and('not.be.empty');
    cy.wrap(row).should('have.property', 'XIRR').and('not.be.empty');
  });
});

// Test_Case 12: Mysql Test for Real Estate Report
it('Validate the Connection For MySQL & Validate the Real Estate Data Against web Data', () => {
    // Use dynamic table name 
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName6, 
      whereCondition: dbConfig.config.whereCondition6 
    }).then((result) => {
      expect(result.success).to.be.true;
      cy.log(result.message);

      if (result.data && result.data.length > 0) {
        result.data.forEach(row => {
          cy.log(`Row data from MySQL: ${JSON.stringify(row)}`);

          // Validate the extracted property data against MySQL data
          propertyData.forEach(propertyRow => {
            const isMatch = propertyRow.PropertyName === row.PropertyName;
            if (isMatch) {
              matchedRecords.push(row);
            } else {
              mismatchedRecords.push(row);
            }
          });

          // Print formatted matched records
          cy.log('\n=== REAL ESTATE MATCHED RECORDS ===');
          cy.log(`Total Matched: ${matchedRecords.length}`);
          matchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Property: ${record.PropertyName}`);
            cy.log(`Area: ${record.Area}`);
            cy.log(`Valuation: ${record.Valuation}`);
          });

          // Print formatted mismatched records
          cy.log('\n=== REAL ESTATE MISMATCHED RECORDS ===');
          cy.log(`Total Mismatched: ${mismatchedRecords.length}`);
          mismatchedRecords.forEach((record, index) => {
            cy.log(`\nRecord ${index + 1}:`);
            cy.log(`Property: ${record.PropertyName}`);
            cy.log(`Area: ${record.Area}`);
            cy.log(`Valuation: ${record.Valuation}`);
            cy.log('Mismatch Details:');
            const webData = propertyData.find(
              web => web.PropertyName === record.PropertyName
            );
            if (webData) {
              cy.log(`- Web Area: ${webData.Area} vs DB Area: ${record.Area}`);
              cy.log(`- Web Valuation: ${webData.Valuation} vs DB Valuation: ${record.Valuation}`);
            } else {
              cy.log('- No matching web data found');
            }
          });
          });
        });
      } else {
        cy.log('No data found in the property_holding table.');
      }
    });
  });

  // Test_Case 13: PMSAsset Report Test
  it('validate the PMS Asset Data(PMSAssetData)', () => {

    // For the Asset section in the report
    cy.get('#PMSSectionHead_8733 > .m-tab').click();

    // Extract data from the web page for asset_report
    cy.get('#PMSSectionData_8733 > .panel-body')
      .find('table')
      .find('tbody')
      .children('#parentRow_8733_1_1')
      .each(($row) => {
        let assetRowData = {};
        cy.wrap($row)
          .find('td')
          .each(($cell, cellIndex) => {
            const cellText = $cell.text().trim();
            switch (cellIndex) {
              case 0: assetRowData.AssetType = cellText; break;
              case 1: assetRowData.AssetName = cellText; break;
              case 2: assetRowData.FolioNumber = cellText; break;
              case 3: assetRowData.TransactionDate = cellText; break;
              case 4: assetRowData.CurrentValueDate = cellText; break;
              case 5: assetRowData.PurchaseAmount = cellText; break;
              case 6: assetRowData.CurrentValue = cellText; break;
              case 7: assetRowData.ProfitLoss = cellText; break;
              case 8: assetRowData.AbsReturn = cellText; break;
              case 9: assetRowData.XIRR = cellText; break;
            }
          });
        PMSAssetData.push(assetRowData);
        cy.log('PMSAssetData: ',PMSAssetData)
      });

    // Validate the web report data
    PMSAssetData.forEach((row, index) => {
      cy.log(`Validating asset row ${index + 1}: ${JSON.stringify(row)}`);
      cy.wrap(row).should('have.property', 'AssetType').and('not.be.empty');
      cy.wrap(row).should('have.property', 'AssetName').and('not.be.empty');
      cy.wrap(row).should('have.property', 'FolioNumber').and('not.be.empty');
      cy.wrap(row).should('have.property', 'TransactionDate').and('not.be.empty');
      cy.wrap(row).should('have.property', 'CurrentValueDate').and('not.be.empty');
      cy.wrap(row).should('have.property', 'PurchaseAmount').and('not.be.empty');
      cy.wrap(row).should('have.property', 'CurrentValue').and('not.be.empty');
      cy.wrap(row).should('have.property', 'ProfitLoss').and('not.be.empty');
      cy.wrap(row).should('have.property', 'AbsReturn').and('not.be.empty');
      cy.wrap(row).should('have.property', 'XIRR').and('not.be.empty');
    });
  });

  // Test_Case 14: MongoDB Test for PMS Asset Report
 it('Validate the Connection For MongoDB & Validate the PMSAsset Data Against web Data', () => {
     const { collectionName7, whereCondition7 } = mongoconfig;
 
     // Log the arguments to verify they are correct
     cy.log(`Collection: ${collectionName7}`);
     cy.log(`Query: ${JSON.stringify(whereCondition7)}`);
     cy.task('testMongoConnection', {
       collectionName:collectionName7 ,
       //successMsg: 'Successfully connected to MongoDB and fetched data from the collection!',
      // errorMsg: 'Failed to connect to MongoDB or fetch data from the collection.',
       whereCondition: JSON.stringify(whereCondition7),
     }).then((result) => {
       cy.log("result", result);
       cy.log('PMSAssetData: ',PMSAssetData);
 
       // Add more detailed logging to understand the result
       cy.log(`MongoDB Query Result: ${JSON.stringify(result)}`);
        if (result){
          // Check if the connection was successful
          // expect(result.success, result.message).to.be.true;
    
          if (result.success) {
            // Continue with your assertion logic
            if (result.data && result.data.length > 0) {
              result.data.forEach(row => {
                cy.log(`Row data from MongoDB: ${JSON.stringify(row)}`);
                PMSAssetData.forEach(assetRow => {
                  const isMatch = assetRow.AssetName === row.AssetName && assetRow.FolioNumber === row.FolioNumber;
                  if (isMatch) {
                    matchedRecords.push(row);
                  } else {
                    mismatchedRecords.push(row);
                  }
                });

                // Print formatted matched records
                cy.log('\n=== PMS ASSET MATCHED RECORDS ===');
                cy.log(`Total Matched: ${matchedRecords.length}`);
                matchedRecords.forEach((record, index) => {
                  cy.log(`\nRecord ${index + 1}:`);
                  cy.log(`Asset: ${record.AssetName}`);
                  cy.log(`Folio: ${record.FolioNumber}`);
                  cy.log(`Current Value: ${record.CurrentValue}`);
                });

                // Print formatted mismatched records
                cy.log('\n=== PMS ASSET MISMATCHED RECORDS ===');
                cy.log(`Total Mismatched: ${mismatchedRecords.length}`);
                mismatchedRecords.forEach((record, index) => {
                  cy.log(`\nRecord ${index + 1}:`);
                  cy.log(`Asset: ${record.AssetName}`);
                  cy.log(`Folio: ${record.FolioNumber}`);
                  cy.log(`Current Value: ${record.CurrentValue}`);
                  cy.log('Mismatch Details:');
                  const webData = PMSAssetData.find(
                    web => web.AssetName === record.AssetName && web.FolioNumber === record.FolioNumber
                  );
                  if (webData) {
                    cy.log(`- Web Folio: ${webData.FolioNumber} vs DB Folio: ${record.FolioNumber}`);
                    cy.log(`- Web Current Value: ${webData.CurrentValue} vs DB Current Value: ${record.CurrentValue}`);
                  } else {
                    cy.log('- No matching web data found');
                  }
                });
                });
              });
            } else {
              cy.log('No data found in the asset_report collection.');
            }
          }
        }
     });
   });



    });