describe('Login Test', () => {
    it('should log in and navigate to the dashboard', () => {
  
      Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('CKEDITOR is not defined')) {
          return false; // Ignore this error
        }
        return true; // Let Cypress fail the test for other errors
      });
  
      // Visit the login page
      cy.visit('https://email.my-einsurance.com/SOGo/so/')
  
      // Enter username and password into the respective fields
      cy.get('input[name="3.1.1.3.3.1.4.4.1.3.3.1.1.3.1.5"]').type('autoupload@wealthelite.in')
      cy.get('input[name="3.1.1.3.3.1.4.4.1.3.3.1.1.3.3.5"]').type('&64,nORVeR')
  
      // Submit the form
      cy.intercept('POST', '/SOGo/connect').as('loginRequest');
      cy.get('button[type="submit"]').click();
  
      // Wait for the login request and check the response status
      cy.wait('@loginRequest').then((interception) => {
        if (interception.response.statusCode === 403) {
          cy.log('Login failed with 403 error');
          // You could fail the test here if you need, or just log the error and continue
          throw new Error('Login failed due to 403');
        }
        expect(interception.response.statusCode).to.eq(200);  // Expect 200 for successful login
      });
  
      // Wait for the page to load (e.g., wait for an element that appears after login)
      cy.get('.dashboard-logo', { timeout: 10000 }).should('be.visible');  // Replace with actual dashboard element
  
      // Now verify that the URL contains '/dashboard'
      cy.url().should('include', '/dashboard'); // This will check if the URL includes "/dashboard"
  
      // Optionally, verify that the page contains the dashboard content
      cy.get('h1').should('contain', 'Dashboard');  // Replace with an actual header or other element specific to the dashboard
  
    })
  });
   
  