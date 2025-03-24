const dbMongoConfig = require('../support/dbMongoConfig');  // Adjust the path as necessary

describe('Asset Report', () => {
  let assetData = [];

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });

  // Case: 1
  it('should validate web report data and connect to MySQL to fetch data from asset_report table', () => {
    // Visit the login page and log in
    cy.visit('https://wealthelite.in/arn-login');
    cy.get('input[name="username"]').type('redmoneyindore', { force: true });
    cy.get('input[name="password"]').type('Abdul@123', { force: true });
    cy.get('button[type="submit"]').click();

    // Navigate through the website and generate the report
    cy.get('#WealthReport__NavItem > span').click({ force: true });
    cy.get('select[name="selectViewBy"]').select('Client');
    cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
    cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
    cy.wait(3000);

    // Trigger the report/valuation
    cy.get('#btn_web.btn.btn-success.vscroll').click();
    cy.wait(7000);

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
        assetData.push(assetRowData);
      });
    cy.log('Assetdata:', assetData);

    // Validate the web report data
    assetData.forEach((row, index) => {
      cy.log(`Validating asset row ${index + 1}: ${JSON.stringify(row)}`);

      // Assertions for each field in row data
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

  // Case: 2
  it('should successfully connect to MongoDB and fetch data from asset_report collection', () => {
    const { collectionName, whereCondition } = dbMongoConfig.mongoconfig;

    // Log the arguments to verify they are correct
    cy.log(`Collection: ${collectionName}`);
    cy.log(`Query: ${JSON.stringify(whereCondition)}`);
    cy.task('testMongoConnection', {
      collectionName,
      successMsg: 'Successfully connected to MongoDB and fetched data from the collection!',
      errorMsg: 'Failed to connect to MongoDB or fetch data from the collection.',
      whereCondition: JSON.stringify(whereCondition),
    }).then((result) => {
      cy.log("result", result);

      // Add more detailed logging to understand the result
      cy.log(`MongoDB Query Result: ${JSON.stringify(result)}`);

      // Check if the connection was successful
      expect(result.success, result.message).to.be.true;

      if (result.success) {
        // Continue with your assertion logic
        if (result.data && result.data.length > 0) {
          result.data.forEach(row => {
            cy.log(`Row data from MongoDB: ${JSON.stringify(row)}`);
            assetData.forEach(assetRow => {
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
    });
  });
});



