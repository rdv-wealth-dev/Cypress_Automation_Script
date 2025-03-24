 //Validate the P&L
 it('Should validate the P&L Data', () => {
    // Open a new tab STP
    cy.get('#btn_web.btn.btn-success.vscroll').click();
    cy.wait(8000);
    cy.get('#liveportfoliotabllist8733 > li:nth-child(7) > a').click();
    cy.get('select[name="whatIfSummary_8733_length"]')
        .select('-1')  // Select the option with value "-1" (All)
        .should('have.value', '-1');
    cy.wait(6000);





});
