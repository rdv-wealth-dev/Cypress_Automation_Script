const mongoconfig = {
  collectionName7: 'pmsAsset',
  whereCondition7: { 'client_id': 8733 },
  collectionName1: 'present_day_summary',
  whereCondition1: {
    arn_id: 8,
    date: '2025-04-07',
    sCode: {
    //   $in: [
    //     "H02",
    //     "HMCOG",
    //     "P1191",
    //     "P1451",
    //     "P3251",
    //     "PESG",
    //     "P121",
    //     "P1023"
    //   ]
    },
    folio: { $in: ['10569084/11','423134232627','1015984573' ,'8202527/58'] }
  },
};

const login = () => {

  // Intercept and ignore specific requests
  cy.intercept('GET', 'https://googleads.g.doubleclick.net/*', { statusCode: 200 }).as('googleAds');
  cy.intercept('POST', 'https://jnn-pa.googleapis.com/*', { statusCode: 200 }).as('jnnPa');
  cy.intercept('POST', 'https://www.youtube.com/youtubei/v1/log_event*', { statusCode: 200 }).as('youtubeLog');
  cy.intercept('POST', 'https://play.google.com/log*', { statusCode: 200 }).as('playLog');
  cy.intercept('POST', '/Universal/universal/notifications', { statusCode: 200 }).as('universalNotifications');
  
  // Visit the login page and log in
  cy.visit('https://wealthelite.in/arn-login');
  cy.get('input[name="username"]').type('redmoneyindore', { force: true });
  cy.get('input[name="password"]').type('Abdul@2347', { force: true });
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  //cy.get('button.btn-modal-dismiss').click();

  // Navigate through the website and generate the report
  cy.get('#WealthReport__NavItem > span').click({ force: true });
  cy.get('select[name="selectViewBy"]').select('Client');
  cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
  cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
  cy.wait(3000);

  // Trigger the report/valuation
  cy.get('#btn_web.btn.btn-success.vscroll').click();
  cy.wait(5000);
}

const login_Mutual = () => {

  // Intercept and ignore specific requests
  cy.intercept('GET', 'https://googleads.g.doubleclick.net/*', { statusCode: 200 }).as('googleAds');
  cy.intercept('POST', 'https://jnn-pa.googleapis.com/*', { statusCode: 200 }).as('jnnPa');
  cy.intercept('POST', 'https://www.youtube.com/youtubei/v1/log_event*', { statusCode: 200 }).as('youtubeLog');
  cy.intercept('POST', 'https://play.google.com/log*', { statusCode: 200 }).as('playLog');
  cy.intercept('POST', '/Universal/universal/notifications', { statusCode: 200 }).as('universalNotifications');
 
  // Visit the login page and log in
  cy.visit('https://wealthelite.in/arn-login');
  cy.get('input[name="username"]').type('redmoneyindore', { force: true });
  cy.get('input[name="password"]').type('Abdul@2347', { force: true });
  cy.get('button[type="submit"]').click();
  cy.wait(5000);
     //cy.get('button.btn-modal-dismiss').click();

  // Navigate through the website and generate the report
  cy.get('#mutual__NavItem').click({ force: true });
  cy.get('#main-content-wrapper > div > div > div:nth-child(1) > a').click();
  cy.wait(3000);
  cy.get('select[name="selectViewBy"]').select('Client');
  cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
  cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
  cy.wait(3000);

  // Trigger the report/valuation
  cy.get('#btn_web.btn.btn-success.vscroll').click();
  cy.wait(5000);
}




module.exports = { mongoconfig, login, login_Mutual };

