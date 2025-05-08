  const { mongoconfig, login, login_Mutual } = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig'); // Adjust the path as necessary

describe('New Live MF Report', () => {
  let allMutualFundValues = [];
  let PCodeValues = [];
  let uniquePcodeValues = [];
  let Stpdata = [];
  let FolioNumber = [];
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  // // Test_Case 1: Mutual Fund Report Test
  // it('validate the Mutual Fund Data(allMutualFundValues & PCodeValues)', () => {
  //   login_Mutual();
  //   // For the Mutual Fund section in the report
  //   cy.get('#liveportfoliocontent8733')
  //     .find('table')
  //     .find('tbody')
  //     .children('tr')
  //     .not('.sh-panel.dn') // Skip rows with class 'sh-panel dn'
  //     .each(($row) => {
  //       let mutualFundRowData = {};
  //       cy.wrap($row)
  //         .find('td')
  //         .each(($cell, cellIndex) => {
  //           const cellText = $cell.text().trim();
  //           switch (cellIndex) {
  //             case 0:
  //               // Extract SchemeName, FolioNumber, and ARNNo from the cell text
  //               let schemeName = $cell.find('p.show-fund-more b').text().trim();
  //               const folioNumber = $cell.find('p:contains("Folio") b').text().trim();
  //               const arnNo = $cell.find('p:contains("ARN No") b').text().trim();
  //               // Remove the text after (G) but keep (G) itself
  //               schemeName = schemeName.replace(/\(G\)(.*)$/, '(G)');
  //               mutualFundRowData.SchemeName = schemeName;
  //               mutualFundRowData.FolioNumber = folioNumber;
  //               mutualFundRowData.ARNNo = arnNo;
  //               break;
  //             case 1: mutualFundRowData.InvSince = cellText; break;
  //             case 2: mutualFundRowData.Sensex = cellText; break;
  //             case 3:
  //               // Replace comma with blank for InvCost
  //               const newInvCost = cellText.replace(/,/g, "");
  //               mutualFundRowData.InvCost = newInvCost;
  //               break;
  //             case 4: mutualFundRowData.DivR = cellText; break;
  //             case 5:
  //               // Replace comma with blank for Units
  //               const newUnits = cellText.replace(/,/g, "");
  //               mutualFundRowData.Units = newUnits;
  //               break;
  //             case 6: mutualFundRowData.PurNav = cellText; break;
  //             case 7: mutualFundRowData.CurNav = cellText; break;
  //             case 8: mutualFundRowData.NavDate = cellText; break;
  //             case 9:
  //               // Replace comma with blank for CurValue (Remove commas but keep the decimal)
  //               const newCurValue = cellText.replace(/,/g, "");
  //               mutualFundRowData.CurValue = newCurValue;
  //               break;
  //             case 10: mutualFundRowData.DivReinv = cellText; break;
  //             case 11: mutualFundRowData.DivPaid = cellText; break;
  //             case 12:
  //               // Replace comma with blank for Total
  //               const newTotal = cellText.replace(/,/g, "");
  //               mutualFundRowData.Total = newTotal;
  //               break;
  //             case 13:
  //               // Replace comma with blank for GainLoss
  //               const newGainLoss = cellText.replace(/,/g, "");
  //               mutualFundRowData.GainLoss = newGainLoss;
  //               break;
  //             case 14: mutualFundRowData.AbsRtn = cellText; break;
  //             case 15: mutualFundRowData.XIRR = cellText; break;
  //           }
  //         });

  //       allMutualFundValues.push(mutualFundRowData);
  //     });

  //   cy.then(() => {
  //     cy.log('MutualFund all Data :', allMutualFundValues);
  //   });



  //   // Extract Pcodes from the onclick attribute
  //   cy.get('#liveportfoliocontent8733')
  //     .find('table')
  //     .find('tbody')
  //     .children('tr')
  //     .each(($row) => {
  //       cy.wrap($row)
  //         .xpath("//p[contains(@class, 'show-fund-more')]")
  //         .each(($p) => {
  //           cy.wrap($p)
  //             .invoke('attr', 'onclick')
  //             .then((PCode) => {
  //               const regex = /showTrans\('\d+_([A-Za-z0-9]+)_\d{4}'\)/;
  //               const match = PCode.match(regex);
  //               if (match) {
  //                 PCodeValues.push(match[1]);
  //               }
  //             });
  //         });
  //     });

  //   cy.then(() => {
  //     // Remove duplicate values from the array
  //      uniquePcodeValues = [...new Set(PCodeValues)];
  //     cy.log('Extracted PcodeValues:', uniquePcodeValues.join(', ')); // Log all extracted values as a comma-separated list
  //     cy.log('Extracted PcodeValues:', uniquePcodeValues);
  //   });
  // });

  // // Test_Case 2: MongoDB Test for Mutual Fund Report
  // it('Validate the Connection For MongoDB & Validate the MutualFundData Against web Data', () => {
  //   const { collectionName1, whereCondition1 } = mongoconfig;
  //   cy.log('MongoDB Config:', collectionName1, whereCondition1);
  //   whereCondition1.sCode.$in = uniquePcodeValues; 
  //   cy.task('testMongoConnection', {
  //     collectionName: collectionName1,
  //     whereCondition: JSON.stringify(whereCondition1),
  //   }).then((result) => {
  //     cy.log('MongoDB Result:', JSON.stringify(result));
  //     cy.log('MutualFund all Data :', allMutualFundValues);
  //     // Perform assertions and matching logic with allMutualFundValues
  //     if (result && result.success !== undefined && result.message !== undefined) {
  //       expect(result.success, result.message).to.be.true;

  //       if (result.success) {
  //         // Continue with your assertion logic
  //         let matchedRecords = [];
  //         let mismatchedRecords = [];
  //         allMutualFundValues.sort((a, b) => {
  //           if (a.SchemeName < b.SchemeName) return -1;
  //           if (a.SchemeName > b.SchemeName) return 1;
  //           return a.FolioNumber < b.FolioNumber ? -1 : 1; // secondary sort on FolioNumber
  //         });
  //         result.data.sort((a, b) => {
  //           if (a.fundDesc < b.fundDesc) return -1;
  //           if (a.fundDesc > b.fundDesc) return 1;
  //           return a.folio < b.folio ? -1 : 1; // secondary sort on FolioNumber
  //         });
  //         let isMatch;
  //         let row = {};
  //         let tableData = {};

  //         for (let index = 0; index < result.data.length; index++) {
  //           row = result.data[index];
  //           tableData = allMutualFundValues[index];

  //           if (tableData.SchemeName === row.fundDesc && tableData.FolioNumber === row.folio) {
  //             isMatch = true;
  //           } else {
  //             isMatch = false;
  //           }
  //           if (isMatch) {
  //             matchedRecords.push(row); // Store matched data
  //           } else {
  //             mismatchedRecords.push(row); // Store mismatched data
  //           }
  //         }
  //         cy.log('Matched Records:', matchedRecords);
  //         cy.log('Mismatched Records:', mismatchedRecords);
  //       }
  //     } else {
  //       cy.log('Invalid result object:', JSON.stringify(result));
  //       throw new Error('Invalid result object');
  //     }
  //   });
  // });

  // // Test_Case 3: Live SIP Data and Folio Number
  // it('validate the Mutual Fund Data(allMutualFundValues & PCodeValues)', () => {
  //   login_Mutual();
  //   // For the Mutual Fund section in the report
  //   cy.get('#liveportfoliotabllist8733 > :nth-child(2) > .nav-link').click();
  //   cy.wait(2000);
  //   cy.get('#sipExportData > :nth-child(1) > .col-md-12 > :nth-child(5) > .col-md-3 > .form-group > .mr-4').click();
  //   cy.wait(2000);
  //   cy.get('#reportSipData_8733_wrapper')
  //     .find('table')
  //     .find('tbody')
  //     .children('tr')
  //     //.not('.sh-panel.dn') // Skip rows with class 'sh-panel dn'
  //     .each(($row) => {
  //       let SipRowData = {};
  //       cy.wrap($row)
  //         .find('td')
  //         .each(($cell, cellIndex) => {
  //           const cellText = $cell.text().trim();
  //           switch (cellIndex) {

  //             case 2:
  //               //let schemeName = $cell.find('p.show-fund-more b').text().trim();
  //               // schemeName = schemeName.replace(/\(G\)(.*)$/, '(G)');
  //               // SipRowData.SchemeName = schemeName;
  //               SipRowData.SchemeName = cellText; // Scheme Name
  //               break;
  //             case 3:
  //               SipRowData.ActiveStatus = cellText; // "Active" or "Inactive"
  //               break;
  //             case 4:
  //               //const folioNumber = $cell.find('p:contains("Folio") b').text().trim();
  //               SipRowData.FolioNumber = cellText; // Folio Number
  //               break;
  //             case 5:
  //               SipRowData.SipFrequency = cellText; // "Once a Month", "Monthly", etc.
  //               break;
  //             case 6:
  //               SipRowData.SIPTxnNo = cellText; // Transaction Number for SIP
  //               break;
  //             case 7:
  //               SipRowData.SIPStartDate = cellText; // SIP Start Date
  //               break;
  //             case 8:
  //               SipRowData.SIPEndDate = cellText; // SIP End Date
  //               break;
  //             case 9:
  //               SipRowData.TerminationDate = cellText; // Termination Date
  //               break;
  //             case 10:
  //               SipRowData.SipDate = cellText; // SIP Date
  //               break;
  //             case 11:
  //               SipRowData.SIPRegAmount = cellText; // SIP Registered Amount
  //               break;
  //             case 12:
  //               SipRowData.SIPMonthlyAmount = cellText; // SIP Monthly Amount
  //               break;
  //             case 13:
  //               SipRowData.RemainingInst = cellText; // Remaining Installments
  //               break;
  //             case 14:
  //               SipRowData.BankDetails = cellText; // Bank Name / A/C No.
  //               break;
  //             case 15:
  //               SipRowData.XIRR = cellText; // XIRR (Return on Investment)
  //               break;
  //           }
  //         });

  //       Sipdata.push(SipRowData);
  //       cy.log('SIP Live Data :', Sipdata);
  //     });

  //     cy.then(() => {
  //        folioNumbers = Sipdata.map((row) => row.FolioNumber); // Extract Folio Numbers
  //       cy.log('Folio Numbers:', folioNumbers); // Log the Folio Numbers
  //     });
  // });

  // // Test_Case 4: MongoDB Test for Live SIP Data
  //  it('Validate the Connection For MySQL & Validate the LiveSip Data Against web Data', () => {
  //         // Use dynamic table
  //         cy.log('MySQL Config:', dbConfig);
  //         cy.task('testMySQLConnection', {
  //             tableName: dbConfig.config.tableName12,
  //             whereCondition: dbConfig.config.whereCondition12 + `('${folioNumbers.join("','")}')`
  //         }).then((result) => {
  //             expect(result.success).to.be.true;
  //             if (result.data && result.data.length > 0) {
  //                 let matchedRecords = [];
  //                 let mismatchedRecords = [];
  //                 cy.log('Data found in the table.', result.data);

  //                 // Sort the mediclaimValue array before iterating, if you want to sort by SchemeName
  //                 Sipdata.sort((a, b) => {
  //                     if (a.SchemeName < b.SchemeName) return -1;
  //                     if (a.SchemeName > b.SchemeName) return 1;
  //                     return 0;
  //                 });
  //                 // Iterate through each row in the MySQL result
  //                 result.data.forEach((row, index) => {
  //                     cy.log('Row data from MySQL:', row);

  //                     // Get corresponding data from mediclaimValue (after sorting)
  //                     let rowsData = Sipdata[index];

  //                     let isMatch = false; // Initialize match flag

  //                     // Compare SchemeName and PolicyNumber between the rows
  //                     if ( rowsData.folioNumbers === row.FolioNumbe) {
  //                         isMatch = true;
  //                     }

  //                     // Push the result to matched or mismatched records
  //                     if (isMatch) {
  //                         matchedRecords.push(row); // Store matched data
  //                     } else {
  //                         mismatchedRecords.push(row); // Store mismatched data
  //                     }
  //                 });

  //                 // Log matched and mismatched records
  //                 cy.log('Matched Records:', matchedRecords);
  //                 cy.log('Mismatched Records:', mismatchedRecords);

  //             } else {
  //                 cy.log('No data found in the eq_holding table.');
  //             }
  //         });
  //     });

  // // Test_Case 5: All SIP Data and Folio Number
  // it('validate the Mutual Fund Data(allMutualFundValues & PCodeValues)', () => {
  //   login_Mutual();
  //   // For the Mutual Fund section in the report
  //   cy.get('#liveportfoliotabllist8733 > :nth-child(2) > .nav-link').click();
  //   cy.wait(2000);
  //   cy.get('#sipExportData > :nth-child(1) > .col-md-12 > :nth-child(5) > .col-md-3 > .form-group > :nth-child(2)').click();
  //   cy.wait(2000);
  //   cy.get('#reportSipData_8733_wrapper')
  //     .find('table')
  //     .find('tbody')
  //     .children('tr')
  //     //.not('.sh-panel.dn') // Skip rows with class 'sh-panel dn'
  //     .each(($row) => {
  //       let SipRowData = {};
  //       cy.wrap($row)
  //         .find('td')
  //         .each(($cell, cellIndex) => {
  //           const cellText = $cell.text().trim();
  //           switch (cellIndex) {

  //             case 2:
  //               SipRowData.SchemeName = cellText; // Scheme Name
  //               break;
  //             case 3:
  //               SipRowData.ActiveStatus = cellText; // "Active" or "Inactive"
  //               break;
  //             case 4:
  //               //const folioNumber = $cell.find('p:contains("Folio") b').text().trim();
  //               SipRowData.FolioNumber = cellText; // Folio Number
  //               break;
  //             case 5:
  //               SipRowData.SipFrequency = cellText; // "Once a Month", "Monthly", etc.
  //               break;
  //             case 6:
  //               SipRowData.SIPTxnNo = cellText; // Transaction Number for SIP
  //               break;
  //             case 7:
  //               SipRowData.SIPStartDate = cellText; // SIP Start Date
  //               break;
  //             case 8:
  //               SipRowData.SIPEndDate = cellText; // SIP End Date
  //               break;
  //             case 9:
  //               SipRowData.TerminationDate = cellText; // Termination Date
  //               break;
  //             case 10:
  //               SipRowData.SipDate = cellText; // SIP Date
  //               break;
  //             case 11:
  //               SipRowData.SIPRegAmount = cellText; // SIP Registered Amount
  //               break;
  //             case 12:
  //               SipRowData.SIPMonthlyAmount = cellText; // SIP Monthly Amount
  //               break;
  //             case 13:
  //               SipRowData.RemainingInst = cellText; // Remaining Installments
  //               break;
  //             case 14:
  //               SipRowData.BankDetails = cellText; // Bank Name / A/C No.
  //               break;
  //             case 15:
  //               SipRowData.XIRR = cellText; // XIRR (Return on Investment)
  //               break;
  //           }
  //         });

  //       Sipdata.push(SipRowData);
  //       cy.log('SIP Live Data :', Sipdata);
  //     });

  //     cy.then(() => {
  //        folioNumbers = Sipdata.map((row) => row.FolioNumber); // Extract Folio Numbers
  //       cy.log('Folio Numbers:', folioNumbers); // Log the Folio Numbers
  //     });
  // });

  // // Test_Case 6: Mysql Test for All SIP Data
  //  it('Validate the Connection For MySQL & Validate the LiveSip Data Against web Data', () => {
  //         // Use dynamic table
  //         cy.task('testMySQLConnection', {
  //             tableName: dbConfig.config.tableName12,
  //             whereCondition: dbConfig.config.whereCondition12 + `('${folioNumbers.join("','")}')`
  //         }).then((result) => {
  //             expect(result.success).to.be.true;
  //             if (result.data && result.data.length > 0) {
  //                 let matchedRecords = [];
  //                 let mismatchedRecords = [];
  //                 cy.log('Data found in the table.', result.data);
  // //
  //                 // Iterate through each row in the MySQL result
  //                 result.data.forEach((row, index) => {
  //                     cy.log('Row data from MySQL:', row);

  //                     // Get corresponding data from mediclaimValue (after sorting)
  //                     let rowsData = Sipdata[index];

  //                     let isMatch = false; // Initialize match flag

  //                     // Compare SchemeName and PolicyNumber between the rows
  //                     if ( rowsData.folioNumbers === row.FolioNumbe) {
  //                         isMatch = true;
  //                     }

  //                     // Push the result to matched or mismatched records
  //                     if (isMatch) {
  //                         matchedRecords.push(row); // Store matched data
  //                     } else {
  //                         mismatchedRecords.push(row); // Store mismatched data
  //                     }
  //                 });

  //                 // Log matched and mismatched records
  //                 cy.log('Matched Records:', matchedRecords);
  //                 cy.log('Mismatched Records:', mismatchedRecords);

  //             } else {
  //                 cy.log('No data found in the eq_holding table.');
  //             }
  //         });
  //     });

  // Test_Case 7: All STP Data and Folio Number
  it('validate the Mutual Fund Data(All STP Data and Folio Number)', () => {
    login_Mutual();
    // For the Mutual Fund section in the report
    cy.get('#liveportfoliotabllist8733 > :nth-child(3) > .nav-link').click();
    cy.wait(2000);
    cy.get('#stpExportData > :nth-child(1) > .col-md-12 > :nth-child(5) > .col-md-3 > .form-group > :nth-child(2)').click();
    cy.wait(2000);
    //  to select the "40" option from the dropdown
    cy.get('select[name="reportStpData_8733_length"]')
    .select('40'); // Select the option with the text "40"
    cy.get('#reportStpData_8733_wrapper')
      .find('table')
      .find('tbody')
      .children('tr')
      .each(($row) => {
        let StpRowData = {};
        cy.wrap($row)
          .find('td')
          .each(($cell, cellIndex) => {
            const cellText = $cell.text().trim();
            switch (cellIndex) {
              case 2:
                StpRowData.SchemeName = cellText; // Scheme Name
                break;
              case 3:
                StpRowData.ActiveStatus = cellText; // "Active" or "Inactive"
                break;
              case 4:
                StpRowData.FolioNumber = cellText; // Folio Number
                break;
              case 5:
                StpRowData.StpFrequency = cellText; // "Once a Month", "Monthly", etc.
                break;
              case 6:
                StpRowData.StPTxnNo = cellText; // Transaction Number for STP
                break;
              case 7:
                StpRowData.StPStartDate = cellText; // STP Start Date
                break;
              case 8:
                StpRowData.StPEndDate = cellText; // STP End Date
                break;
              case 9:
                StpRowData.TerminationDate = cellText; // Termination Date
                break;
              case 10:
                StpRowData.StpDate = cellText; // STP Date
                break;
              case 11:
                StpRowData.StPAmount = cellText; // STP  Amount
                break;
              case 12:
                StpRowData.RemIst = cellText; // Rem Amount
                break;
              case 13:
                StpRowData.BankDetails = cellText; //Bank Details
                break;
            }
          });
        Stpdata.push(StpRowData);
      });
    cy.log('STP All Data :', Stpdata);
    Stpdata.sort((a, b) => {
      return Number(a.StPTxnNo) - Number(b.StPTxnNo); // Convert to numbers and compare
    });
    console.log(Stpdata);
    cy.then(() => {
      FolioNumber = Stpdata.map((row) => row.FolioNumber); // Extract Folio Numbers
      cy.log('Folio Numbers:', FolioNumber,); // Log the Folio Numbers
    });
  });


  // Test_Case 8: Mysql Test for All STP Data
  it('Validate the Connection For MySQL & Validate the  All STP Data Against web Data', () => {
    // Use dynamic table
    const formattedFolioNumbers = FolioNumber.map(num => `'${num.trim()}'`).join(',');
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName12,
      whereCondition: `${dbConfig.config.whereCondition12} (${formattedFolioNumbers}) ORDER BY IHNO ASC`
    }).then((result) => {
      expect(result.success).to.be.true;
      if (result.data && result.data.length > 0) {
        let matchedRecords = [];
        let mismatchedRecords = [];
        cy.log('Data found in the table.', result.data);
        Stpdata.sort((a, b) => {
          if (a.StPTxnNo < b.StPTxnNo) return -1;  // If numA is smaller, put a before b
          if (a.StPTxnNo > b.StPTxnNo) return 1;   // If numA is greater, put b before a
          return 0;  // If they are equal, no change in order
      });
      cy.log("Stpdata",Stpdata);
        // Iterate through each row in the MySQL result
        result.data.forEach((row, index) => {
          let rowsData = Stpdata[index];
          let isMatch = false; // Initialize match flag
          // Compare SchemeName and PolicyNumber between the rows
          if (row?.IHNO.trim() == rowsData?.StPTxnNo.trim()) {
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
        cy.log('No data found in the SIP table.');
      }
    });
  });



});
