const dbConfig = require('../support/dbConfig');  // Adjust the path as necessary

describe('Property Holding Dashboard', () => {
  let propertyData = []; // This will hold the data extracted from the web page (Property section)

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; 
  });
//Case: 1
  it('should validate web report data and connect to MySQL to fetch data from property_holding table', () => {
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
    
    // For the Property section in the report
    cy.get('#realEstateSectionHead_8733 > .m-tab').click();

    // Extract data from the web page for property_holding
    cy.get('#realEstateSectionData_8733 > .panel-body')
      .find('table')
      .find('tbody')
      .children('tr')
      .filter(':even')
      .filter('[showhide="show"]')
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
//Case : 2
  it('should successfully connect to MySQL and fetch data from property_holding table', () => {
    // Use dynamic table name 
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName2, 
      whereCondition: dbConfig.config.whereCondition2 
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
});
