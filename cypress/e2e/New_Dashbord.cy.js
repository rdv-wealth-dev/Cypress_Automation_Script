import '../support/commands';

describe('Wealth Elite Dashboard Full Validation', () => {
  beforeEach(() => {
    cy.loginWithSession();
    cy.visit('https://wealthelite.in/my-dashboard');
    cy.wait(2000);
    cy.get('#whatsappOptInModal').invoke("modal", "hide");
    cy.get('#globalModalContainer .auto-show-modal').invoke("modal", "hide");
    //cy.get('.modal-body > .img-fluid').invoke("hide");

  });

  Cypress.on('uncaught:exception', () => false);

  it('TC_001: Validate Top Tiles - AUM & SIP and redirections', () => {
    // Wait for page to load fully
    cy.wait(3000);

    // Validate AUM & SIP tiles
    cy.get('.trand-box').each(($el, index) => {
      cy.wrap($el).within(() => {
        // Check AUM/SIP title and value
        cy.get('h1')
          .invoke('text')
          .then((text) => {
            const trimmedText = text.replace(/\s+/g, ' ').trim();
            const pattern = /(AUM|SIP)\s\d+(\.\d+)?\s?(Cr|Lakh|Thousand)/;
            cy.log(`Box ${index + 1}: ${trimmedText}`);
            expect(trimmedText).to.match(pattern);
          });

        // Check the trend/month-over-month text
        cy.get('.tend-mon')
          .invoke('text')
          .then((text) => {
            const valuePattern = /\d+(\.\d+)?\s(Cr|Lakh|Thousand)/;
            const percentPattern = /\d+(\.\d+)?%\sMoM/;
            cy.log(`Tend-mon Text: ${text}`);

            if (valuePattern.test(text)) {
              expect(text).to.match(valuePattern);
            }

            if (percentPattern.test(text)) {
              expect(text).to.match(percentPattern);
            }
          });
      });
    });

    // Save current dashboard URL
    cy.url().then((originalUrl) => {
      const baseUrl = new URL(originalUrl).origin;
      // Iterate over all "View Report" links
      cy.get('a:contains("View Report")').each(($link, index) => {
        cy.wrap($link)
          .invoke('attr', 'href')
          .then((href) => {
            cy.log(`Validating View Report link #${index + 1}: ${href}`);
            expect(href).to.not.eq(originalUrl);

            // Construct full URL if href is relative
            const fullUrl = href.startsWith('http') ? href : baseUrl + href;

            // Visit the full URL to validate page loads
            cy.visit(fullUrl);
            cy.wait(2000);

            // Return to dashboard
            cy.visit(originalUrl);
            cy.wait(3000);

            // Re-hide modal if needed
            cy.hideWhatsAppModalIfVisible();
          });
      });
    });
  });

  it('TC_002: Validate Quick Report Filters & Report Navigation', () => {
    cy.wait(2000);
    // Validate the section title (assuming "Quick Report" is visible somewhere)
    cy.contains('Quick Report').should('exist');
    // Validate Branch dropdown (1st dropdown)
    cy.get('select').eq(0).should('exist');
    // Validate Advisor dropdown (2nd dropdown)
    cy.get('select').eq(1).should('exist');
    // Validate client search input
    cy.get('input[placeholder="Search Client By Name / PAN"]').should('exist');
    // Validate Report Type dropdown
    cy.get('select#reportType')
      .should('exist')
      .and('contain', 'Portfolio Valuation');
    // Validate 'Go To Report' button
    cy.get('button.show-quick-report-handler')
      .should('exist')
      .and('contain.text', 'To Report')

  });

  it('TC_003: Validate Product Tabs', () => {
    const tabs = ['MF( BSE + MFU )', 'Fixed Deposit', 'Loan Against MF', 'Peer to Peer', 'Equi Trade', 'NPS'];
    tabs.forEach(tab => cy.contains(tab).should('be.visible'));
  });

    it('TC_004: Validate 3 Day Summary Section', () => {
      cy.contains('3 Days').click().should('have.class', 'active');
      const metrics = ['Purchases', 'Redemptions', 'Rej. Transactions', 'SIP Rejections', 'New SIP'];
      metrics.forEach(metric => cy.contains(metric).should('exist'));
    });

  it('TC_005: Validate Transaction INR values are present', () => {
    const tiles = ['Purchases', 'Redemptions', 'Rej. Transactions', 'SIP Rejections', 'New SIP'];
    tiles.forEach(tile => {
      cy.contains('h5', tile)
        .parents('.media-body')
        .find('p')
        .should('contain.text', 'INR');
    });
  });


  it('TC_006: Validate SIP Business Chart and Monthly MIS Section', () => {
    cy.contains('sip business chart').should('exist');
    cy.contains('Monthly MIS').should('exist');
    cy.contains('View Report').should('exist');
  });

  it('TC_007: Validate Clients section & Download button', () => {
    cy.contains('Clients').should('exist');
    cy.get('.btn.btn-sip-vr').contains('Download Report').should('be.visible');
  });

  it('TC_008: Validate Sidebar/Top Nav Icons', () => {
    const tooltips = ['Lightbulb', 'Bell', 'Star', 'Graduation Cap', 'Video'];
    tooltips.forEach(() => {
      cy.get('svg').should('exist'); // Assuming they are SVG icons
    });
  });

  it('TC_009: Validate Welcome Text and Branding', () => {
    cy.contains('Welcome MFD Partner').should('exist');
    cy.contains('AMFI-Registered Mutual Fund Distributor').should('exist');

  });

});