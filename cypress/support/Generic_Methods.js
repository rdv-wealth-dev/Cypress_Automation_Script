// Define credentials for different user types
const users = {
    admin: { username: 'adminUser', password: 'adminPass', role: 'Admin' },
    manager: { username: 'managerUser', password: 'managerPass', role: 'Manager' },
    employee: { username: 'employeeUser', password: 'employeePass', role: 'Employee' },
    guest: { username: 'guestUser', password: 'guestPass', role: 'Guest' },
    vendor: { username: 'vendorUser', password: 'vendorPass', role: 'Vendor' },
    customer: { username: 'customerUser', password: 'customerPass', role: 'Customer' }
  };
  
  // Custom command to select user type and log in
  Cypress.Commands.add('launchAndLoginAs', (role) => {
    const user = users[role];
  
    // Check if the user role is defined
    if (!user) {
      throw new Error(`No credentials found for role: ${role}`);
    }
  
    // Step 1: Visit the main website
    cy.visit('/'); // Modify this URL to your actual landing page
  
    // Step 2: Select the user type from a dropdown or buttons
    // Modify this based on your application (e.g., dropdown, buttons, etc.)
    cy.get('#userTypeDropdown').select(user.role);  // Dropdown example
    // If it's a button, you can use:
    // cy.get(`button[data-role="${user.role}"]`).click();
  
    // Step 3: Log in with the selected user's credentials
    cy.get('input[name="username"]').clear().type(user.username);
    cy.get('input[name="password"]').clear().type(user.password);
    cy.get('button[type="submit"]').click();
  
    // Step 4: Validate the redirection to the correct dashboard
    if (role === 'admin') {
      cy.url().should('include', '/admin-dashboard');
    } else if (role === 'manager') {
      cy.url().should('include', '/manager-dashboard');
    } else if (role === 'employee') {
      cy.url().should('include', '/employee-dashboard');
    } else if (role === 'guest') {
      cy.url().should('include', '/guest-dashboard');
    } else if (role === 'vendor') {
      cy.url().should('include', '/vendor-dashboard');
    } else if (role === 'customer') {
      cy.url().should('include', '/customer-dashboard');
    }
  });
  