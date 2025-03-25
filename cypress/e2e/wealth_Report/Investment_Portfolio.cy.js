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


  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  //Test_Case 1: Mutual Fund Report Test
  it('validate the Mutual Fund Data(allMutualFundValues & PCodeValues) ', () => {
    login();
    // For the Mutual Fund section in the report
    cy.get('#mutualSectionHead_8733 > .m-tab').click();
    //cy.get('#liveportfoliocontent8733').click();
    // Extract data from the web page for mutual fund report
    cy.get('#liveportfoliocontent8733')
      .find('table')
      .find('tbody')
      .children('tr')
      .not('.sh-panel.dn') // Skip rows with class 'sh-panel dn'
      .each(($row) => {
        let mutualFundRowData = {};
        cy.wrap($row)
          .find('td')
          .each(($cell, cellIndex) => {
            const cellText = $cell.text().trim();
            switch (cellIndex) {
              case 0:
                // Extract SchemeName, FolioNumber, and ARNNo from the cell text
                let schemeName = $cell.find('p.show-fund-more b').text().trim();
                const folioNumber = $cell.find('p:contains("Folio") b').text().trim();
                const arnNo = $cell.find('p:contains("ARN No") b').text().trim();
                // Remove the text after (G) but keep (G) itself
                schemeName = schemeName.replace(/\(G\)(.*)$/, '(G)');
                mutualFundRowData.SchemeName = schemeName;
                mutualFundRowData.FolioNumber = folioNumber;
                mutualFundRowData.ARNNo = arnNo;
                break;
              case 1: mutualFundRowData.InvSince = cellText; break;
              case 2: mutualFundRowData.Sensex = cellText; break;
              case 3:
                // Replace comma with blank for InvCost
                const newInvCost = cellText.replace(/,/g, "");
                mutualFundRowData.InvCost = newInvCost;
                break;
              case 4: mutualFundRowData.DivR = cellText; break;
              case 5:
                // Replace comma with blank for Units
                const newUnits = cellText.replace(/,/g, "");
                mutualFundRowData.Units = newUnits;
                break;
              case 6: mutualFundRowData.PurNav = cellText; break;
              case 7: mutualFundRowData.CurNav = cellText; break;
              case 8: mutualFundRowData.NavDate = cellText; break;
              case 9:
                // Replace comma with blank for CurValue (Remove commas but keep the decimal)
                const newCurValue = cellText.replace(/,/g, "");
                mutualFundRowData.CurValue = newCurValue;
                break;
              case 10: mutualFundRowData.DivReinv = cellText; break;
              case 11: mutualFundRowData.DivPaid = cellText; break;
              case 12:
                // Replace comma with blank for Total
                const newTotal = cellText.replace(/,/g, "");
                mutualFundRowData.Total = newTotal;
                break;
              case 13:
                // Replace comma with blank for GainLoss
                const newGainLoss = cellText.replace(/,/g, "");
                mutualFundRowData.GainLoss = newGainLoss;
                break;
              case 14: mutualFundRowData.AbsRtn = cellText; break;
              case 15: mutualFundRowData.XIRR = cellText; break;
            }
          });

        allMutualFundValues.push(mutualFundRowData);
      });

    cy.then(() => {
      cy.log('MutualFund all Data :', allMutualFundValues);
    });

    // Extract Pcodes from the onclick attribute
    cy.get('#liveportfoliocontent8733')
      .find('table')
      .find('tbody')
      .children('tr')
      .each(($row) => {
        cy.wrap($row)
          .xpath("//p[contains(@class, 'show-fund-more')]")
          .each(($p) => {
            cy.wrap($p)
              .invoke('attr', 'onclick')
              .then((PCode) => {
                const regex = /showTrans\('\d+_([A-Za-z0-9]+)_\d{4}'\)/;
                const match = PCode.match(regex);
                if (match) {
                  PCodeValues.push(match[1]);
                }
              });
          });
      });

      cy.then(() => {
        // Remove duplicate values from the array
         uniquePcodeValues = [...new Set(PCodeValues)];
        cy.log('Extracted PcodeValues:', uniquePcodeValues.join(', ')); // Log all extracted values as a comma-separated list
        cy.log('Extracted PcodeValues:', uniquePcodeValues);
      });
    });

  // Test_Case 2: MongoDB Test for Mutual Fund Report
   it('Validate the Connection For MongoDB & Validate the MutualFundData Against web Data ', () => {
    const { collectionName1, whereCondition1 } = mongoconfig;
    cy.log('MongoDB Config:', collectionName1, whereCondition1);
    whereCondition1.sCode.$in = uniquePcodeValues;
    cy.log('MongoDB new Config:', collectionName1, whereCondition1);
    cy.task('testMongoConnection', {
      collectionName: collectionName1,
      whereCondition: JSON.stringify(whereCondition1),
    }).then((result) => {
      cy.log('MongoDB Result:', JSON.stringify(result));
      cy.log('MutualFund all Data :', allMutualFundValues);
      // Perform assertions and matching logic with allMutualFundValues
      if (result && result.success !== undefined && result.message !== undefined) {
        expect(result.success, result.message).to.be.true;

        if (result.success) {
          // Continue with your assertion logic
          let matchedRecords = [];
          let mismatchedRecords = [];
          allMutualFundValues.sort((a, b) => {
            if (a.SchemeName < b.SchemeName) return -1;
            if (a.SchemeName > b.SchemeName) return 1;
            return a.FolioNumber < b.FolioNumber ? -1 : 1; // secondary sort on FolioNumber
          });
          result.data.sort((a, b) => {
            if (a.fundDesc < b.fundDesc) return -1;
            if (a.fundDesc > b.fundDesc) return 1;
            return a.folio < b.folio ? -1 : 1; // secondary sort on FolioNumber
          });
          let isMatch;
          let row = {};
          let tableData = {};

          for (let index = 0; index < result.data.length; index++) {
            row = result.data[index];
            tableData = allMutualFundValues[index];

            if (tableData.SchemeName === row.fundDesc && tableData.FolioNumber === row.folio) {
              isMatch = true;
            } else {
              isMatch = false;
            }
            if (isMatch) {
              matchedRecords.push(row); // Store matched data
            } else {
              mismatchedRecords.push(row); // Store mismatched data
            }
          }
          cy.log('Matched Records:', matchedRecords);
          cy.log('Mismatched Records:', mismatchedRecords);
        }
      } else {
        cy.log('Invalid result object:', JSON.stringify(result));
        throw new Error('Invalid result object');
      }
    });
  });

// Test_Case 3: Equity Report Test
  it('validate the Equity Data', () => {
    login();

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
            if (webRow.CompanyName === row.CompanyName && webRow.Quantity === row.Quantity) {
              cy.log(`Matching row found: ${webRow.CompanyName} - ${webRow.Quantity}`);

              // Explicitly validate each field
              cy.wrap(webRow.CompanyName).should('equal', row.CompanyName);
              cy.wrap(webRow.Quantity).should('equal', row.Quantity);
              cy.wrap(webRow.AvgRate).should('equal', row.AvgRate);
              cy.wrap(webRow.InvestedAmount).should('equal', row.InvestedAmount);
              cy.wrap(webRow.CurrentRate).should('equal', row.CurrentRate);
              cy.wrap(webRow.Valuation).should('equal', row.Valuation);
              cy.wrap(webRow.AbsReturn).should('equal', row.AbsReturn);
              cy.wrap(webRow.XIRR).should('equal', row.XIRR);
            }
          });
        });
      } else {
        cy.log('No data found in the eq_holding table.');
      }
    });
  });

  //Test_case 5: Post Office Test
  it('validate the Post Office Data', () => {
   login();

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
            if (schemeRow.SchemeName === row.SchemeName) {
              cy.log(`Matching scheme row found: ${schemeRow.SchemeName}`);


              // Web Data vs MySQL Data
              cy.wrap(schemeRow.SchemeName).should('equal', row.SchemeName);
              cy.wrap(schemeRow.AccountNumber).should('equal', row.AccountNumber);
              cy.wrap(schemeRow.SchemeType).should('equal', row.SchemeType);
              cy.wrap(schemeRow.IssueDate).should('equal', row.IssueDate);
              cy.wrap(schemeRow.Investment).should('equal', row.Investment);
              cy.wrap(schemeRow.Term).should('equal', row.Term);
              cy.wrap(schemeRow.Interest).should('equal', row.Interest);
              cy.wrap(schemeRow.CurrentValue).should('equal', row.CurrentValue);
              cy.wrap(schemeRow.MaturityDate).should('equal', row.MaturityDate);
              cy.wrap(schemeRow.MaturityAmount).should('equal', row.MaturityAmount);
            }
          });
        });
      } else {
        cy.log('No data found in the investment_schemes table.');
      }
    });
  });

//Test_case 7: FD & Bond Test
it('validate the FD & Bond Data', () => {
  login();

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
            if (fdBondRow.SchemeName === row.SchemeName && fdBondRow.FolioFDNo === row.FolioFDNo) {
              cy.log(`Matching FD/Bond row found: ${fdBondRow.SchemeName} - ${fdBondRow.FolioFDNo}`);

              // Web Data vs MySQL Data
              cy.wrap(fdBondRow.SchemeName).should('equal', row.SchemeName);
              cy.wrap(fdBondRow.FolioFDNo).should('equal', row.FolioFDNo);
              cy.wrap(fdBondRow.NameOfIssuer).should('equal', row.NameOfIssuer);
              cy.wrap(fdBondRow.IssueDate).should('equal', row.IssueDate);
              cy.wrap(fdBondRow.Investment).should('equal', row.Investment);
              cy.wrap(fdBondRow.Tenure).should('equal', row.Tenure);
              cy.wrap(fdBondRow.Interest).should('equal', row.Interest);
              cy.wrap(fdBondRow.CurrentValue).should('equal', row.CurrentValue);
              cy.wrap(fdBondRow.MaturityDate).should('equal', row.MaturityDate);
              cy.wrap(fdBondRow.MaturityAmount).should('equal', row.MaturityAmount);
            }
          });
        });
      } else {
        cy.log('No data found in the fd_bond_report table.');
      }
    });
  });

//Test_case 9: Commodity Test 
it('validate the Commodity Data', () => {
  login();

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
            if (commodityRow.CompanyName === row.CompanyName && commodityRow.Quantity === row.Quantity) {
              cy.log(`Matching commodity row found: ${commodityRow.CompanyName} - ${commodityRow.Quantity}`);

              // Explicitly validate each field
              cy.wrap(commodityRow.CompanyName).should('equal', row.CompanyName);
              cy.wrap(commodityRow.Quantity).should('equal', row.Quantity);
              cy.wrap(commodityRow.AvgRate).should('equal', row.AvgRate);
              cy.wrap(commodityRow.InvestedAmount).should('equal', row.InvestedAmount);
              cy.wrap(commodityRow.CurrentRatePerGram).should('equal', row.CurrentRatePerGram);
              cy.wrap(commodityRow.Valuation).should('equal', row.Valuation);
              cy.wrap(commodityRow.AbsReturn).should('equal', row.AbsReturn);
              cy.wrap(commodityRow.XIRR).should('equal', row.XIRR);
            }
          });
        });
      } else {
        cy.log('No data found in the commodity_holding table.');
      }
    });
  });

//Test_case 11: Real Estate Test 
it('validate the Real Estate Data', () => {
  login();

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
            if (propertyRow.PropertyName === row.PropertyName) {
              cy.log(`Matching property row found: ${propertyRow.PropertyName}`);

              // Explicitly validate each field
              cy.wrap(propertyRow.PropertyType).should('equal', row.PropertyType);
              cy.wrap(propertyRow.PropertyName).should('equal', row.PropertyName);
              cy.wrap(propertyRow.Area).should('equal', row.Area);
              cy.wrap(propertyRow.AvgRate).should('equal', row.AvgRate);
              cy.wrap(propertyRow.InvestedAmount).should('equal', row.InvestedAmount);
              cy.wrap(propertyRow.CurrentRate).should('equal', row.CurrentRate);
              cy.wrap(propertyRow.Valuation).should('equal', row.Valuation);
              cy.wrap(propertyRow.AbsReturn).should('equal', row.AbsReturn);
              cy.wrap(propertyRow.XIRR).should('equal', row.XIRR);
            }
          });
        });
      } else {
        cy.log('No data found in the property_holding table.');
      }
    });
  });

  // Test_Case 13: PMSAsset Report Test
  it('validate the PMS Asset Data(PMSAssetData)', () => {
    login();

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
                  if (assetRow.AssetName === row.AssetName && assetRow.FolioNumber === row.FolioNumber) {
                    cy.log(`Matching asset row found: ${assetRow.AssetName} - ${assetRow.FolioNumber}`);
    
                    // Explicitly validate each field from the MongoDB result
                    cy.wrap(assetRow.AssetType).should('equal', row.AssetType);
                    cy.wrap(assetRow.AssetName).should('equal', row.AssetName);
                    cy.wrap(assetRow.FolioNumber).should('equal', row.FolioNumber);
                    cy.wrap(assetRow.TransactionDate).should('equal', row.TransactionDate);
                    cy.wrap(assetRow.CurrentValueDate).should('equal', row.CurrentValueDate);
                    cy.wrap(assetRow.PurchaseAmount).should('equal', row.PurchaseAmount);
                    cy.wrap(assetRow.CurrentValue).should('equal', row.CurrentValue);
                    cy.wrap(assetRow.ProfitLoss).should('equal', row.ProfitLoss);
                    cy.wrap(assetRow.AbsReturn).should('equal', row.AbsReturn);
                    cy.wrap(assetRow.XIRR).should('equal', row.XIRR);
                  }
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