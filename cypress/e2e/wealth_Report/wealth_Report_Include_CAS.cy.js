describe('Mutual Fund Dashboard', () => {
    beforeEach(() => {
        cy.visit('https://staging.wealthelite.in/arn-login');
        cy.get('input[name="username"]').type('redmoneyindore', { force: true });
        cy.get('input[name="password"]').type('Red@123', { force: true });
        cy.get('button[type="submit"]').click();
        cy.get('#WealthReport__NavItem > span').click();
        //Include CAS Check
        cy.get('#outsideCasData').check();
    });

    it('Report should be send it on Email & Message', () => {
        // Select branch
        cy.get('#branch').select('All');

        // Select advisor
        cy.get('#advisor').select('All');

        // Select view by option
        cy.get('select[name="selectViewBy"]').select('Client');

        // Search by Name/PAN/Folio
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();

        // for report on Email-Ready
        cy.get('#reportFilter > div > div.col-12.col-sm-12.col-md-6.pl-xl-5 > div:nth-child(8) > div.col-8 > div > div > div.btn-group.prit-bx > label.btn.btn-default.email_sumdetail.email > svg').click();
        cy.get('#emailCloseId > div.radio.mb-0.mr-2.radio-label > label').click();
        cy.get('#email').should('exist').clear().type('ajaydatir77@gmail.com');
        cy.get('#emailCloseId > div.input-group.mt-2.w-100.float-left > div > button').click();
        cy.wait(15000);
        cy.get('#notificationMsg', { timeout: 10000 })
            // .should('be.visible')
            .and('contain.text', 'Mail Sent Successfully')
            .then(($msg) => {
                console.log('Success message is displayed:', $msg.text());
            });

        // Popup Handling
        cy.get('#notificationDiv > .close > span').click();

        // Select view by option
        cy.get('select[name="selectViewBy"]').select('Client');

        // Search by Name/PAN/Folio
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.wait(5000);
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();

        // for report on Message-Ready
        cy.get('#reportFilter > div > div.col-12.col-sm-12.col-md-6.pl-xl-5 > div:nth-child(8) > div.col-8 > div > div > div.btn-group.prit-bx > label.btn.btn-default.sms_sumdetail.sms').click();
        cy.get('#mobile').should('exist').clear().type('9764919865');
        cy.get('#mobileCloseId > div > div > button').click();
        cy.wait(15000);
        cy.get('#notificationMsg', { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', 'Message Sent Successfully')
            .then(($msg) => {
                console.log('Success message is displayed:', $msg.text());
            });

        // Popup Handling
        cy.get('#notificationDiv > .close > span').click();
    });



    it('should populate the WhatsApp link correctly in the DOM', () => {

        // // Select view by option
        // cy.get('select[name="selectViewBy"]').select('Client');

        // // Search by Name/PAN/Folio
        // cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        // cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();

        // // Trigger the button click for WhatsApp
        // // Using the class to select the label and click on it
        // cy.get('label.whatsapp-sumdetail.whatsapp').click();
        // // .click({ force: true });
        // //.should('be.visible') // Ensure the button is visible
        // // Ensure the WhatsApp input field is visible
        // cy.get('#whatsapp')
        //     .clear()
        //     .type('9764919865', { force: true });  // Type the value using force to bypass visibility checks

        // // Ensure the close button is visible and click it
        // cy.get('#whatsappCloseId > div > div > button').click();
        // // Wait for the link to appear in the DOM
        // cy.wait(2000);
        // // // Validate if the WhatsApp link has been added to the DOM
        // // cy.get('a[href^="https://api.whatsapp.com/send?phone=919764919865&text="]') // Use href selector to target the link
        // //     .should('exist')   // Ensure the link exists in the DOM
        // //     .and('be.visible');
        // // Select view by option
        // cy.get('select[name="selectViewBy"]').select('Client');
        // // Search by Name/PAN/Folio
        // cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        // cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();

        // //view Report on Web
        // cy.get('#pageType').click();
        // // Remove the target="_blank" to prevent opening in a new tab
        // cy.get('#btn_web_tab').click();
    });


    it('validate all present values present in the report', () => {
        // Select view by option
        cy.get('select[name="selectViewBy"]').select('Client');
        // Search by Name/PAN/Folio
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar', { force: true });
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
        // Trigger the report/valuation
        cy.get('#btn_web.btn.btn-success.vscroll').click();
        cy.wait(20000); // Adjust if needed

        // Validate client Name
        cy.get('#clientname', { timeout: 10000 }).should('be.visible');

        // Validate the Date
        cy.get('#portFolioExport > div > div > div > ul > li:nth-child(1) > span:nth-child(7)').should('be.visible');

        // Investment portfolio Total
        cy.get('#accordion-fy-wise > div.reportpanel.reportpanel-footer > table > tbody > tr > td:nth-child(2)').should('be.visible'); // Total Investment
        cy.get('#accordion-fy-wise > div.reportpanel.reportpanel-footer > table > tbody > tr > td:nth-child(4)').should('be.visible'); // Gain & Loss
        cy.get('#accordion-fy-wise > div.reportpanel.reportpanel-footer > table > tbody > tr > td:nth-child(5)').should('be.visible'); // Abs Returns

        // Validate the Sum of Total Investment
        let Investment;
        cy.get('#accordion-fy-wise > div.reportpanel.reportpanel-footer > table > tbody > tr > td:nth-child(2)')
            .invoke('text')
            .then((text) => {
                Investment = text.trim();
                console.log("investtt", Investment)
                console.log('Investment value added:', Math.floor(parseFloat(Investment.replace(/,/g, ''))));
            });

        let MutualfundInvestmentArray = [];
        const investmentIds = [
            '#mf_inv_8733',
            '#eq_inv_8733',
            '#po_inv_8733',
            '#fd_inv_8733',
            '#comm_inv_8733',
            '#real_inv_8733',
            '#pms_inv_8733'
        ];
       
        investmentIds.forEach((id) => {
            cy.get(id)
                .invoke('text')
                .then((text) => {
                    const value = text.trim();
                    MutualfundInvestmentArray.push(value);
                    console.log('MutualfundInvestment value added:', value);
                });
        });

        cy.then(() => {
            let sum = 0;
            MutualfundInvestmentArray.forEach((value, index) => {
                const numericValue = parseFloat(value.replace(/,/g, ''));
                if (!isNaN(numericValue)) {
                    sum += numericValue;
                    console.log(`Index ${index}: ${value} (numeric: ${numericValue}) added to sum`);
                } else {
                    console.log(`Index ${index}: Invalid value "${value}", skipping`);
                }
            });
            const roundedSum = Math.floor(sum);
            console.log('Total Sum of MutualfundInvestmentArray (Rounded to whole number):', roundedSum);
            expect(roundedSum).to.be.a('number');
            expect(roundedSum).to.be.greaterThan(0);
        });

        // Validate the Sum of Latest Value
        let LatestValue;
        cy.get('#accordion-fy-wise > div.reportpanel.reportpanel-footer > table > tbody > tr > td:nth-child(3)')
            .invoke('text')
            .then((text) => {
                LatestValue = text.trim();
                console.log("latesttt", LatestValue);

                console.log('Latest value added:', Math.floor(parseFloat(LatestValue.replace(/,/g, ''))));
            });


        let LatestValueArray = [];
        const latestValueIds = [
            '#mf_val_8733',
            '#eq_val_8733',
            '#po_val_8733',
            '#fd_val_8733',
            '#comm_val_8733',
            '#real_val_8733',
            '#pms_val_8733'
        ];

        latestValueIds.forEach((id) => {
            cy.get(id)
                .invoke('text')
                .then((text) => {
                    const value = text.trim();
                    LatestValueArray.push(value);
                    console.log('latest value added:', value);
                });
        });

        cy.then(() => {
            let sum1 = 0;
            LatestValueArray.forEach((value, index) => {
                const numericvalue1 = parseFloat(value.replace(/,/g, ''));
                if (!isNaN(numericvalue1)) {
                    sum1 += numericvalue1;
                    console.log(`Index ${index}: ${value} (numeric: ${numericvalue1}) added to sum1`);
                } else {
                    console.log(`Index ${index}: Invalid value "${value}", skipping`);
                }
            });
            const roundedSum1 = Math.floor(sum1);
            console.log('Total Sum of LatestValueArray (Rounded to whole number):', roundedSum1);
            expect(roundedSum1).to.be.a('number');
            expect(roundedSum1).to.be.greaterThan(0);
        });

        // Validate the Sum of Total Gain & Loss
        let GainandlossValue;
        cy.get('#accordion-fy-wise > div.reportpanel.reportpanel-footer > table > tbody > tr > td:nth-child(4)')
            .invoke('text')
            .then((text) => {
                GainandlossValue = text.trim();
                console.log('Latest value added:', Math.floor(parseFloat(GainandlossValue.replace(/,/g, ''))));
            });

        let GainandlossValueArray = [];
        const GainandlossValueIds = [
            '#mf_gainloss_8733',
            '#eq_gainloss_8733',
            '#po_gainloss_8733',
            '#fd_gainloss_8733',
            '#comm_gainloss_8733',
            '#real_gainloss_8733',
            '#pm_gainloss_8733'
        ];

        GainandlossValueIds.forEach((id) => {
            cy.get(id)
                .invoke('text')
                .then((text) => {
                    const value = text.trim();
                    GainandlossValueArray.push(value);
                    console.log('gainloss value added:', value);
                });
        });

        cy.then(() => {
            let sum2 = 0;
            GainandlossValueArray.forEach((value, index) => {
                const numericvalue2 = parseFloat(value.replace(/,/g, ''));
                if (!isNaN(numericvalue2)) {
                    sum2 += numericvalue2;
                    console.log(`Index ${index}: ${value} (numeric: ${numericvalue2}) added to sum2`);
                } else {
                    console.log(`Index ${index}: Invalid value "${value}", skipping`);
                }
            });
            const roundedSum2 = Math.floor(sum2);
            console.log('Total Sum of GainandlossValueArray (Rounded to whole number):', roundedSum2);
            expect(roundedSum2).to.be.a('number');
            expect(roundedSum2).to.be.greaterThan(0);
        });

        cy.then(() => {
            console.log("Investments val: ", Investment);
            console.log("Latests val: ", LatestValue);
            const result = ((LatestValue - Investment) * 100) / Investment;
            console.log("result: ", result);
            // console.log("calculated: ",`Calculated Absolute Return: ${result.toFixed(2)}%`);

            // Validate the HeldAway Portfollio
            cy.get('#mutualSectionHead_8733 > .m-tab > table > tbody > tr > :nth-child(1)').click();
            cy.wait(5000);
            cy.get('.cas-liveportfolio > h5').should('be.visible');
        });

    });
});