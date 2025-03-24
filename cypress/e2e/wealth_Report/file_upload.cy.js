describe('Login Test Suite', () => {
    it('Handles Blank Page After Login', () => {
      // Step 1: Visit the login page
      cy.visit('https://app.salesninjacrm.com/login');
  
      // Step 2: Resize the viewport (optional for testing)
      // cy.viewport(1600, 765);
  
      // Step 3: Enter username
      cy.get('.tab-pane:nth-child(1) [placeholder="Enter email address"]').type('support@redvisionglobal.com');
  
      // Step 4: Enter password
      cy.get('#home1 > :nth-child(1) > .p-4 > .p-2 > form > :nth-child(2) > .position-relative > .form-control')
        .type('Redv@123');
  
      // Step 5: Click the login button
      cy.get('.mt-4:nth-child(3) > .btn').click();
  
      // Step 6: Wait for the URL to change to include "/dashboard"
      cy.url().should('include', '/dashboard');
  
      // Step 7: Wait for the page to load properly by checking a visible element on the dashboard
      // For example, a navigation item that appears only after a successful login
      cy.get('#navbar-nav > li:nth-child(3) > a', { timeout: 10000 }).should('be.visible'); // Adjust this selector as needed
  
      // Step 8: If the dashboard is still not visible, reload the page
      cy.reload();
  
      // Step 9: Wait for the element to be visible again after reload
      cy.get('#navbar-nav > li:nth-child(3) > a', { timeout: 10000 }).should('be.visible'); // Adjust this selector as needed
  
      // Optional Step 10: You can also wait for other dashboard elements or content to ensure everything is loaded
      cy.get('.dashboard-widget', { timeout: 10000 }).should('be.visible'); // Example of another dashboard element
    });
  });
   //Include CAS Check
   cy.get('#outsideCasData').check();