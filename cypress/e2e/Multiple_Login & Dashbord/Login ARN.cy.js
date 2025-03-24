describe('Login Test', () => {
  it('should log in with valid credentials', () => {
    // Visit the login page
    cy.visit('https://dev.wealthelite.in/arn-login'); // ARN Login hit

    // Fill in the username
    cy.get('input[name="username"]').type('redmoneyindore', { force: true });
 // Replace with your username input selector

    // Fill in the password
    cy.get('input[name="password"]').type('Redvision2024_new',{ force: true }); // Replace with your password input selector

    // Click the login button
    cy.get('button[type="submit"]').click(); // Replace with your login button selector

   

  });
});