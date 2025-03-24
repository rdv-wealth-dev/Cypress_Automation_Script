const dbConfig = require('../support/dbConfig');

describe('FD/Bond Report', () => {
  let fdBondData = [];
  let fdBondAccData = [];
  let fdBondAccString = '';

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  //Case: 1
  it('should validate web report data and connect to MySQL to fetch data from fd_bond_report table', () => {
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

  //Case : 2
  it('should successfully connect to MySQL and fetch data from fd_bond_report table', () => {
    cy.log(dbConfig.config.whereCondition4 + '(' + fdBondAccString + ')');

    // Connect to MySQL and fetch the data
    cy.task('testMySQLConnection', {
      tableName: dbConfig.config.tableName4,
      whereCondition: dbConfig.config.whereCondition4 + '(' + fdBondAccString + ')'
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
});
