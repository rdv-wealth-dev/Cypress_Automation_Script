const { mongoconfig, login, login_Mutual } = require('../../support/dbMongoConfig');
const dbConfig = require('../../support/dbConfig'); // Adjust the path as necessary

describe('Asset Report and Mutual Fund Report', () => {
  let allMutualFundValues = [];
  let PCodeValues = [];
  let uniquePcodeValues = [];

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  // Test_Case 1: Mutual Fund Report Test
  it('validate the Mutual Fund Data(allMutualFundValues & PCodeValues)', () => {
    login_Mutual();
    // For the Mutual Fund section in the report
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
  it('Validate the Connection For MongoDB & Validate the MutualFundData Against web Data', () => {
    const { collectionName1, whereCondition1 } = mongoconfig;
    cy.log('MongoDB Config:', collectionName1, whereCondition1);
    whereCondition1.sCode.$in = uniquePcodeValues; 
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
});
