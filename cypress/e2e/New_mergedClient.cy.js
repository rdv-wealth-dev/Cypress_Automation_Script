import '../support/commands';

describe('validate the merged client', () => {
    beforeEach(() => {
        cy.loginWithSession();
        cy.visit('https://wealthelite.in/my-dashboard');
        cy.wait(2000);
        cy.get('#whatsappOptInModal').invoke("modal", "hide");
        cy.get('#globalModalContainer .auto-show-modal').invoke("modal", "hide");
        //cy.get('.modal-body > .img-fluid').invoke("hide");

    });

    Cypress.on('uncaught:exception', () => false);

    it('TC01:validate that the client able to merged', () => {
        cy.visit('https://wealthelite.in/UserManager/utility/utility-dashboard');
        cy.wait(2000);

        // ✅ Validate initial URL
        cy.url().should('include', '/UserManager/utility/utility-dashboard');

        // 🔹 Navigate through the flow
        cy.get('#utility__NavItem').click();
        cy.get('#main-content-wrapper > div:nth-child(2) > div:nth-child(1) > a').click();
        cy.get(':nth-child(1) > .card-menu > .card-menu-link').click();

        cy.get('#mainClientInput').type("Demo ");
        cy.get('.odd:nth-child(1) label').click();

        cy.get('#unmappedClientSearch').click();
        cy.get('#unmappedClientSearch').type("test ");
        cy.wait(2000);

        cy.get('#merge_client_23365558').click();
        cy.get('#trss_4400697 > :nth-child(2) > .checkbox').click();
        cy.get('#finalConfirmationBtn').click();

        cy.get('.row > :nth-child(2) > .btn-primary').click();
        cy.get('#merging-output > .modal-dialog > .modal-content > .modal-footer > .btn').click();

        // 🔁 Final click that redirects
        cy.get('.row > :nth-child(2) > .btn-primary').click();

        // ✅ Validate redirection to merge-client-filter page
        cy.url().should('include', '/UserManager/utility/merge-client-filter');
    });

    it('TC02:validate that the client able to Differ Client', () => {
        cy.visit('https://wealthelite.in/UserManager/utility/utility-dashboard');
        cy.wait(2000);

        // ✅ Validate initial URL
        cy.url().should('include', '/UserManager/utility/utility-dashboard');

        // 🔹 Navigate through the flow
        cy.get('#utility__NavItem').click();
        cy.wait(2000);
        cy.get(':nth-child(2) > :nth-child(1) > .mf-dashbox').click();
        cy.get(':nth-child(2) > .card-menu > .card-menu-link').click();
        cy.get('#mainClientInput').type("test");

        cy.get('.odd:nth-child(5) label').click();
        cy.get('#checkbox_1').click();

        cy.get('.col-12 > .btn-success').click();
        cy.wait(2000);
        cy.get('.modal-footer > .btn-danger').click();

        // ✅ Validate redirection to merge-client-filter page
        cy.url().should('include', 'UserManager/utility/differ-clients');
    });

    it('TC03:validate View all merged Client', () => {
        cy.visit('https://wealthelite.in/UserManager/utility/utility-dashboard');
        cy.wait(2000);

        // ✅ Validate initial URL
        cy.url().should('include', '/UserManager/utility/utility-dashboard');

        // 🔹 Navigate through the flow
        cy.get('#utility__NavItem').click();
        cy.wait(2000);
        cy.get(':nth-child(2) > :nth-child(1) > .mf-dashbox').click();
        cy.get(':nth-child(3) > .card-menu > .card-menu-link').click();
        cy.wait(2000); 

        // Check if the table is visible
        cy.get('#monthlyexample').should('be.visible');

        // check the column headers
        cy.get('#monthlyexample thead th').eq(0).should('contain.text', 'Main Clients');
        cy.get('#monthlyexample thead th').eq(1).should('contain.text', 'Merged Clients');

        // check the first row of data
        cy.get('#monthlyexample tbody tr').first().should('exist');
    });

    it('TC04:validate Unmerged suggestion list', () => {
        cy.visit('https://wealthelite.in/UserManager/utility/utility-dashboard');
        cy.wait(2000);

        // ✅ Validate initial URL
        cy.url().should('include', '/UserManager/utility/utility-dashboard');

        // 🔹 Navigate through the flow
        cy.get('#utility__NavItem').click();
        cy.wait(2000);
        cy.get(':nth-child(2) > :nth-child(1) > .mf-dashbox').click();
        cy.get(':nth-child(4) > .card-menu > .card-menu-link').click();
        cy.wait(2000);

        // Check if the table is visible
        cy.get('#monthlyexample').should('be.visible');

        // Check that the table contains a specific client name (e.g., "Rakesh Chandra Verma")
        cy.get('#monthlyexample tbody')
            .contains('td', 'Rakesh Chandra Verma')
            .should('exist');

        // check the first row of data
        cy.get('#monthlyexample tbody tr').first().should('exist');
    });

});
