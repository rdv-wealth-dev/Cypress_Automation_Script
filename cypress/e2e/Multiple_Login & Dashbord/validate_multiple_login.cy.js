describe('Login Validation for Multiple Users', () => {

  // Load fixture data before the tests
  before(() => {
    cy.fixture('credentials').as('users');
  });

  it('Validate login for each user type', function () {
    // Loop through each user type and perform login
    Object.keys(this.users).forEach(userType => {
      const { username, password, loginUrl } = this.users[userType];
      
      // Log each user type and its details (Optional: for debugging)
      cy.log(`Logging in as ${userType}...`);

      // Visit the login URL
      cy.visit(loginUrl);
      
      // Assuming there are input fields with ids #username and #password
      // and a button with id #loginButton (modify as per actual page structure)
      cy.get('input[id="inputEmail"]').type(username,{ force: true });
      cy.get('input[id="inputPassword"]').type(password,{ force: true });
      cy.get('button[type="submit"]').click();

      // Check if the login was successful
      // For example, check if the user is redirected to the dashboard
      // Modify the selector based on your application structure
      cy.url().should('include', '/my-dashboard');
      cy.screenshot(); // for taking screenshot
      
      cy.get('a[id="profileMenuDropPanel"]').click(); //click on menu for logout option
      cy.get('a[id="logoutli"]').click();   //click for logout option
      
      // Optionally log out after each login if necessary
      // cy.get('#logoutButton').click();
    });
  });
});

  