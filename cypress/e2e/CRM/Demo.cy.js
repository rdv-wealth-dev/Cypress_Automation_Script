it('Written with DeploySentinel Recorder', () => {
    // Load "https://wealthelite.in/my-dashboard"
    cy.visit('https://wealthelite.in/my-dashboard');
  
    // Resize window to 1552 x 774
    cy.viewport(1552, 774);
  
    // Click on <a> "Wealth Report"
    cy.get('#WealthReport__NavItem').click();
  
    // Click on <select> "Select Client Family"
    cy.get('#selectViewBy').click(); 
  
    // Fill "1" on <select> #selectViewBy
    cy.get('#selectViewBy').select('1');
  
    // Click on <input> #searchClient
    cy.get('#searchClient').click();
  
    // Fill "singh parihar" on <input> #searchClient
    cy.get('#searchClient').type("singh parihar");
  
    // Click on <li> "Abhishek Singh Parihar [A..."
    cy.get('#loadClient > li:nth-child(1)').click();
  
    // Click on <button> "Show"
    cy.get('#btn_web').click();
  
    // Scroll wheel by X:0, Y:600
    cy.scrollTo(0, 501);
  
    // Click on <div> "Mutual Fund 83,50,222.22 ..."
    cy.get('[href="#mutualSectionData_8733"]').click();
  
    // Scroll wheel by X:0, Y:800
    cy.scrollTo(0, 1302);
  });