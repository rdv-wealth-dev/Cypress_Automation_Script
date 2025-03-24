 
describe('CRM Automation', () => {
    
    });
      // Function to add a category
      

    // Function to add a risk profile

    it('Add Categories', () => {

            // Log in or perform necessary setup
            cy.visit('https://staging.wealthelite.in/arn-login'); 
            cy.get('input[name="username"]').type('redmoneyindore', { force: true });
            cy.get('input[name="password"]').type('Redvision2024_new',{ force: true });
            cy.get('button[type="submit"]').click();
            cy.get('#crm__NavItem').click();
            cy.get('#main-content-wrapper > div:nth-child(2) > div:nth-child(1) > a').click();
          

          const addCategory = (name, minAum, maxAum) => {
            cy.get('#addNewRowAum > td:nth-child(1) > a').click();
            cy.wait(4000);
            cy.get('#categoryName3').type(name);
            cy.get('#minRange3').type(minAum);
            cy.get('#maxRange3').type(maxAum);
        };
        // Adding categories
        addCategory('HIGH HNI', 200000, 750000);
       
        const addProfile = (name, minAge, maxAge) => {
          cy.get('#addNewRowRisk > td:nth-child(1) > a').click();
          cy.wait(4000);
          cy.get('#profileName5').type(name);
          cy.get('#profileMin5').type(minAge);
          cy.get('#profileMax5').type(maxAge);
      };
      // Adding risk profiles
      addProfile(' test', 91, 93);
      cy.get('#crmSettingForm > div:nth-child(2) > div:nth-child(3) > button').click();
      cy.contains('Please Enter Valid Category Name').should('be.visible');
    });

       
    
;
 