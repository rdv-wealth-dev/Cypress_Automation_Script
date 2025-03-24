const dbConfig = require('../support/dbConfig');  // Adjust the path as necessary

describe('Mutual Fund Dashboard', () => {
  let rowsData = []; 

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });
//Case: 1
  it('validate all present values in the report', () => {
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

  // Case : 2
  it('should successfully connect to MySQL and fetch data from demo table', () => {
    // Use dynamic table
    cy.task('testMySQLConnection', { 
      tableName: dbConfig.config.tableName0, 
      whereCondition: dbConfig.config.whereCondition0
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
});
