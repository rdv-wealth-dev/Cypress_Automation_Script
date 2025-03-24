describe('Mutual Fund Dashboard', () => {
  beforeEach(() => {
      cy.visit('https://staging.wealthelite.in/arn-login'); 
      cy.get('input[name="username"]').type('redmoneyindore', { force: true });
      cy.get('input[name="password"]').type('Red@123', { force: true });
      cy.get('button[type="submit"]').click();
      cy.get('#mutual__NavItem')  // Select by ID
      .should('be.visible')      // Ensure it is visible
      .click();
      cy.get('#main-content-wrapper > div > div > div:nth-child(4) > a').click();
  });

  it('should select branch, advisor, and view By and search by Name/PAN/Folio, Duration Choose By, select fund type', () => {
  
      // Select branch
      cy.get('#branch').select('All');
  
      // Select advisor
      cy.get('#advisor').select('All');
  
      // Select view by option
      cy.get('select[name="selectViewBy"]').select('Client');

      // Date range selection (From Date and To Date)
      cy.get('#fromDate.form-control').type('2024-10-13');
      cy.get('#toDate.form-control').type('2024-11-03').click();

      // Select fund type
      cy.get('select[name="ftype"]').select('All');
  
      // Search by Name/PAN/Folio
      cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
      cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();

      // Click on Show button
      cy.get('button[id="btn_web"]').click();
      cy.wait(4000);

      // Name validation
      cy.get('.report-result-panel > :nth-child(1) > :nth-child(2)')
      .should('be.visible') // Wait for the element to be visible
      .should('contain', 'Abhishek Singh Parihar');

      // Validate PAN number
      cy.get('#inputFormExportBT > div > div > div > ul > li:nth-child(1) > span.pan-number')
          .invoke('text')
          .then((panNumber) => {
              expect(panNumber).to.equal('[PAN : APIPP9166R]');
          });

      // Check if investment cost is a valid number
      cy.get('#invCostFrom_8733 > b')
      .invoke('text')
      .then((investmentCost) => {
          expect(investmentCost).to.match(/[\d,]+\.\d{2}/);
      });

      // Check if current value text is present
      cy.get('#curValFrom_8733 > b')
          .invoke('text')
          .then((currentValue) => {
              expect(currentValue).to.match(/[\d,]+\.\d{2}/);
          });

      // Check if gain/loss text is present
      cy.get('.dark-footer-table > tr > :nth-child(10)')
          .invoke('text')
          .then((gainLoss) => {
              expect(gainLoss).to.match(/[\d,]+\.\d{2}/);
          });

      // Check if absolute return text is present
      cy.get('#first-table_8733 > tfoot > tr > th:nth-child(10)')
      .invoke('text')
      .then((absoluteReturn) => {
          expect(absoluteReturn).to.match(/-?[\d,]+\.\d{2}/);
      });

      // Corrected the selector for XIRR (fixed the selector issue here)
      cy.get('#first-table_8733 > tfoot > tr > th:nth-child(12)')
          .invoke('text')
          .then((xirr) => {
              expect(xirr).to.match(/[\d,]+\.\d{2}%/); 
          });
  });
});
