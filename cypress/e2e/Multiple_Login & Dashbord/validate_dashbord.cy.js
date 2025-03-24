describe('Dashboard Validation', () => {
    before(() => {
      // Log in or perform necessary setup
      cy.visit('https://staging.wealthelite.in/arn-login'); 
      cy.get('input[name="username"]').type('redmoneyindore', { force: true });
      cy.get('input[name="password"]').type('Redvision2024_new',{ force: true });
      cy.get('button[type="submit"]').click();
    });
  
    it('should display the dashboard correctly', () => {
      // Visit the dashboard page
      cy.visit('https://staging.wealthelite.in/my-dashboard'); 
  
      // Verify the title and welcome message
      cy.get('#bc-r-ele > ol > li > p').contains('Welcome MFD Partner (Corporate)').should('be.visible');
  
      // Verify navigation links
      const navLinks = [
        'Home',
        'CRM',
        'Utilities',
        'Insurance',
        'Assets',
        'Mutual',
        'CAS',
        'Research',
        'Transact Online',
        'Goal GPS',
        'Financial Planning',
        'Dashboard',
      ];
      navLinks.forEach(link => {
        cy.contains(link).should('be.visible');
      });
   
      // Validate search functionality
      cy.get('#search-box')
        .should('be.visible');
   
       // cy.get('a[id="profileMenuDropPanel"]').click(); //click on menu for logout option
        //cy.get('a[id="logoutli"]').click();   //click for logout option
        
  });
  
})