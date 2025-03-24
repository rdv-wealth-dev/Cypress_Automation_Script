describe('Login and Verify Homepage Load', () => {
    it('Should log in and verify homepage', () => {
      // Visit login page
      cy.visit('https://dev.wealthelite.in/arn-login');
  
      // Perform login steps
      cy.get('input[name="username"]').type('redmoneyindore', { force: true }) // Replace with actual field
      cy.get('input[name="password"]').type('Redvision2024_new',{ force: true }); // Replace with actual field
      cy.get('button[type="submit"]').click();
  
      // Wait for a specific element to verify the homepage load
      // This can be an element that only appears on the homepage.
      cy.get('.dashboard__NavItem', { timeout: 10000 }) // Adjust the selector to match an element on your homepage
        .should('be.visible'); // Check that the element is visible
      
      // Optionally, check that the SEO script has completed (if applicable)
      //cy.get('script[src*="seo-script.js"]', { timeout: 10000 }).should('exist'); // Replace with actual script path if necessary
  
      // Additionally, verify URL includes /my-dashboard
      cy.url().should('include', '/my-dashboard');
     // cy.screenshot('after-click'); // This saves a screenshot with the name 'after-click'
  
      // Or check page title
      cy.title().should('eq', 'My Dashboard - Wealth Elite'); // Replace with the actual page title
    });
  });
  