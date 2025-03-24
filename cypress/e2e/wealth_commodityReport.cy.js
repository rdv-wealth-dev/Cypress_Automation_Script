const dbConfig = require('../support/dbConfig');  // Adjust the path as necessary

describe('Commodity Holding Report', () => {
  let commodityData = []; 

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });
//Case: 1
  it('should validate web report data and connect to MySQL to fetch data from commodity_holding table', () => {
    // Visit the login page and log in
    cy.visit('https://wealthelite.in/arn-login');
    cy.get('input[name="username"]').type('redmoneyindore', { force: true });
    cy.get('input[name="password"]').type('Abdul@123', { force: true });
    cy.get('button[type="submit"]').click();
    cy.wait(4000);
    cy.get('button.btn-modal-dismiss').click();

    // Navigate through the website and generate the report
    cy.get('#WealthReport__NavItem > span').click({ force: true });
    cy.get('select[name="selectViewBy"]').select('Client');
    cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
    cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
    cy.wait(3000);

    // Trigger the report/valuation
    cy.get('#btn_web.btn.btn-success.vscroll').click();
    cy.wait(7000);
    
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

//Case : 2
  it('should successfully connect to MySQL and fetch data from commodity_holding table', () => {
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
});
