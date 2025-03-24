const dbConfig = require('../support/dbConfig'); // Adjust path based on your file structure

describe('Investment Scheme Dashboard', () => {
  let schemeData = []; // This will hold the data extracted from the web page (Investment Scheme section)
  let accData = []; // This will hold all the account numbers separately
  let accString = '';

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false; // Prevent Cypress from failing the test
  });
  //Case : 1
  it('should validate web report data and connect to MySQL to fetch data from investment_schemes table', () => {
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
        let schemeRowData = {};
        cy.wrap($row)
          .find('td')
          .each(($cell, cellIndex) => {
            const cellText = $cell.text().trim();

            switch (cellIndex) {
              case 0: schemeRowData.SchemeName = cellText; break;
              case 1: schemeRowData.AccountNumber = cellText; break;
              case 2: schemeRowData.SchemeType = cellText; break;
              case 3: schemeRowData.IssueDate = cellText; break;
              case 4: schemeRowData.Investment = cellText; break;
              case 5: schemeRowData.Term = cellText; break;
              case 6: schemeRowData.Interest = cellText; break;
              case 7: schemeRowData.CurrentValue = cellText; break;
              case 8: schemeRowData.MaturityDate = cellText; break;
              case 9: schemeRowData.MaturityAmount = cellText; break;
            }
          });
        schemeData.push(schemeRowData);  
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

  // case :2
  it('should successfully connect to MySQL and fetch data from investment_schemes table', () => {
    cy.log(dbConfig.config.whereCondition3 + '(' + accString + ')');

    // Connect to MySQL and fetch the data
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName3,
      whereCondition: dbConfig.config.whereCondition3 + '(' + accString + ')'
    }).then((result) => {
      cy.log(result);

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
});