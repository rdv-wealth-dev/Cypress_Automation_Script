describe('Mutual Fund Dashboard', () => {
    beforeEach(() => {

        // Intercept and ignore specific requests
        cy.intercept('GET', 'https://googleads.g.doubleclick.net/*', { statusCode: 200 }).as('googleAds');
        cy.intercept('POST', 'https://jnn-pa.googleapis.com/*', { statusCode: 200 }).as('jnnPa');
        cy.intercept('POST', 'https://www.youtube.com/youtubei/v1/log_event*', { statusCode: 200 }).as('youtubeLog');
        cy.intercept('POST', 'https://play.google.com/log*', { statusCode: 200 }).as('playLog');
        cy.intercept('POST', '/Universal/universal/notifications', { statusCode: 200 }).as('universalNotifications');
        cy.visit('https://staging.wealthelite.in/arn-login');
        cy.get('input[name="username"]').type('redmoneyindore', { force: true });
        cy.get('input[name="password"]').type('Red@123', { force: true });
        cy.get('button[type="submit"]').click();
        cy.get('#mutual__NavItem').click();
        cy.get('#main-content-wrapper > div > div > div:nth-child(1) > a').click();
        cy.wait(6000);
        cy.get('select[name="selectViewBy"]').select('Client');
        // Search by Name/PAN/Folio
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar', { force: true });
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
    });


    // Report generate & validate email and message functionality 
    it('Report should be send it on Email & Message', () => {
        cy.get('#reportFilter > div > div.col-12.col-sm-12.col-md-6.pl-xl-5 > div:nth-child(8) > div.col-8 > div > div > div.btn-group.prit-bx > label.btn.btn-default.email_sumdetail.email > svg').click();
        cy.get('#emailCloseId > div.radio.mb-0.mr-2.radio-label > label').click();
        cy.get('#email').should('exist').clear().type('ajaydatir77@gmail.com');
        cy.get('#emailCloseId > div.input-group.mt-2.w-100.float-left > div > button').click();
        cy.wait(15000);
        cy.get('#notificationMsg', { timeout: 10000 })
            .and('contain.text', 'Mail Sent Successfully')
            .then(($msg) => {
                console.log('Success message is displayed:', $msg.text());
            });

        cy.get('#notificationDiv > .close > span').click();

        cy.get('select[name="selectViewBy"]').select('Client');
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.wait(5000);
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();

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

        cy.get('#notificationDiv > .close > span').click();
    });


    // This test validates if the WhatsApp link is present and correct in the DOM
    it('should populate the WhatsApp link correctly in the DOM', () => {
        cy.get('select[name="selectViewBy"]').select('Client');
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar');
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
        cy.get('label.whatsapp-sumdetail.whatsapp').click();
        cy.get('#whatsapp')
            .clear()
            .type('9764919865', { force: true });
        cy.get('#whatsappCloseId > div > div > button').click();
        cy.wait(2000);
        cy.get('a[href^="https://api.whatsapp.com/send?phone=919764919865&text="]')
            .should('exist')
            .and('be.visible');
    });


    // Validate the Appropriate client report should be generated
    it('validate the Name & Date of client', () => {
        cy.get('select[name="selectViewBy"]').select('Client');
        cy.get('input[placeholder="Search client"]').type('Abhishek Singh Parihar', { force: true });
        cy.get('#clientSearchLabelDiv > div.col-md-8 > div').contains('Abhishek Singh Parihar').click();
        cy.get('#btn_web.btn.btn-success.vscroll').click();
        cy.wait(20000);

        cy.get('#clientname', { timeout: 10000 }).should('be.visible');
        cy.get('#portFolioExport > div > div > div > ul > li:nth-child(1) > span:nth-child(7)').should('be.visible');

    });


    it('Should validate the Table Data', () => {

        cy.get('#btn_web.btn.btn-success.vscroll').click();
        cy.wait(8000);

        // Store expected values (extract values from DOM)
        cy.get('#liveTransTable > tfoot > tr > th:nth-child(4)').invoke('text').then((expectedInvCost) => {
            cy.get('#grandSummaryUnit').invoke('text').then((expectedUnit) => {
                cy.get('#liveTransTable > tfoot > tr > th.text-right.grandSummaryCurrentValue-8733').invoke('text').then((expectedCurVal) => {
                    cy.get('#liveTransTable > tfoot > tr > th:nth-child(14)').invoke('text').then((expectedGainLoss) => {
                        cy.get('#liveTransTable > tfoot > tr > th:nth-child(15)').invoke('text').then((expectedAbsRtn) => {

                            // Initialize individual objects for each attribute
                            let invCostData = { "Inv. Cost": [] };
                            let unitsData = { "Units": [] };
                            let purNavData = { "Pur. Nav": [] };
                            let curNavData = { "Cur. Nav": [] };
                            let curValueData = { "Cur. Value": [] };
                            let gainLossData = { "Gain & Loss": [] };
                            let absRtnData = { "Abs. Rtn.": [] };
                            let xirrData = { "XIRR": [] };

                            // Function to convert formatted string to float
                            const parseFormattedValue = (value) => {
                                return parseFloat(value.replace(/,/g, '')); // Remove commas and convert to float
                            };

                            // Assuming you have already navigated to the page containing the table
                            cy.get('#liveTransTable tbody tr').each(($row) => {
                                // Extracting the required values from the table
                                const invCost = $row.find('td.inv_cost').text().trim();
                                const units = $row.find('td.units').text().trim();
                                const purNav = $row.find('td.pur_nav').text().trim();
                                const curNav = $row.find('td.cur_nav').text().trim();
                                const curValue = $row.find('td.cur_value').text().trim();
                                const gainLoss = $row.find('td.gain_loss').text().trim();
                                const absRtn = $row.find('td.abs_rtn').text().trim();
                                const xirr = $row.find('td.xirr').text().trim();

                                // Push the extracted values into the corresponding arrays in the individual objects if they are not empty
                                if (invCost) invCostData["Inv. Cost"].push(parseFormattedValue(invCost));
                                if (units) unitsData["Units"].push(parseFormattedValue(units));
                                if (purNav) purNavData["Pur. Nav"].push(parseFormattedValue(purNav));
                                if (curNav) curNavData["Cur. Nav"].push(parseFormattedValue(curNav));
                                if (curValue) curValueData["Cur. Value"].push(parseFormattedValue(curValue));
                                if (gainLoss) gainLossData["Gain & Loss"].push(parseFormattedValue(gainLoss));
                                if (absRtn) absRtnData["Abs. Rtn."].push(parseFormattedValue(absRtn));
                                if (xirr) xirrData["XIRR"].push(parseFormattedValue(xirr));
                            }).then(() => {
                                // After all rows have been processed, log the individual objects
                                // cy.log('Inv. Cost Data:', invCostData);
                                // cy.log('Units Data:', unitsData);
                                // cy.log('Pur. Nav Data:', purNavData);
                                // cy.log('Cur. Nav Data:', curNavData);
                                // cy.log('Cur. Value Data:', curValueData);
                                // cy.log('Gain & Loss Data:', gainLossData);
                                // cy.log('Abs. Rtn. Data:', absRtnData);
                                // cy.log('XIRR Data:', xirrData);

                                // Calculate sums for each object
                                const sumInvCost = invCostData["Inv. Cost"].reduce((acc, val) => acc + val, 0);
                                const sumUnits = unitsData["Units"].reduce((acc, val) => acc + val, 0);
                                const sumCurValue = curValueData["Cur. Value"].reduce((acc, val) => acc + val, 0);
                                const sumGainLoss = gainLossData["Gain & Loss"].reduce((acc, val) => acc + val, 0);
                                const sumAbsRtn = absRtnData["Abs. Rtn."].reduce((acc, val) => acc + val, 0);
                                const absRtn = (sumGainLoss / sumInvCost) * 100;

                                // Round to two decimal places
                                const roundedAbsRtn = parseFloat(absRtn.toFixed(2));

                                // Log the sums and average
                                // cy.log('Sum of Inv. Cost:', sumInvCost);
                                // cy.log('Sum of Units:', sumUnits);
                                // cy.log('Sum of Cur. Value:', sumCurValue);
                                // cy.log('Sum of Gain & Loss:', sumGainLoss);
                                // cy.log('Sum of Abs. Rtn.:', sumAbsRtn);
                                // cy.log('Abs. Rtn.:', absRtn);
                                // cy.log('Rounded Abs. Rtn.:', roundedAbsRtn);

                                // Convert expected values from strings to floats and remove commas
                                const expectedInvCostNum = parseFormattedValue(expectedInvCost);
                                const expectedUnitNum = parseFormattedValue(expectedUnit);
                                const expectedCurValNum = parseFormattedValue(expectedCurVal);
                                const expectedGainLossNum = parseFormattedValue(expectedGainLoss);
                                const expectedAbsRtnNum = parseFormattedValue(expectedAbsRtn);

                                // Round both values to 2 decimal places
                                const roundedSumUnits = parseFloat(sumUnits.toFixed(2));
                                const roundedExpectedUnitNum = parseFloat(expectedUnitNum.toFixed(2));
                                const roundedSumCurValue = parseFloat(sumCurValue.toFixed(1)); // Round sumCurValue to 2 decimal places
                                const roundedExpectedCurValNum = parseFloat(expectedCurValNum.toFixed(1));
                                const roundedSumGainLoss = parseFloat(sumGainLoss.toFixed(1)); // Round sumGainLoss to 2 decimal places
                                const roundedExpectedGainLossNum = parseFloat(expectedGainLossNum.toFixed(1));

                                // Validate the extracted sums against the expected values
                                expect(sumInvCost).to.equal(expectedInvCostNum);
                                expect(roundedSumUnits).to.equal(roundedExpectedUnitNum);
                                expect(roundedSumCurValue).to.equal(roundedExpectedCurValNum);
                                expect(roundedSumGainLoss).to.equal(roundedExpectedGainLossNum);
                                expect(roundedAbsRtn).to.equal(expectedAbsRtnNum); // Compare rounded values
                            });
                        });
                    });
                });
            });
        });
    });
    // Validate SIP 
    it('Should validate the SIP data', () => {
        // Open a new tab
        cy.get('#btn_web.btn.btn-success.vscroll').click();
        cy.wait(8000);
        cy.get('#liveportfoliotabllist8733 > li:nth-child(2) > a').click();
        //cy.get('#sipExportData > div > div > div > div.col-md-3 > div > div.radio.float-none.h-100.m-0.mr-4 > label').click();
        cy.get('#sipExportData > div > div > div > div.col-md-3 > div > div:nth-child(2) > label').click();
        cy.wait(6000);

        cy.get('#reportSip_8733 > div > div > div > div tbody tr').each(($row, index) => {
            // Get the table columns
            const columns = $row.find('td');

            // Validate the data for each column
            expect(columns.eq(1).text().trim()).to.equal('Abhishek Singh Parihar'); // Client Name
            expect(columns.eq(2).text().trim()).to.equal('Nippon India Growth Fund - Growth'); // Scheme Name
            expect(columns.eq(3).text().trim()).to.equal('Inactive'); // Active status
            expect(columns.eq(4).text().trim()).to.equal('44045568822'); // Folio Number
            expect(columns.eq(5).text().trim()).to.equal('Monthly'); // SIP Frq
            expect(columns.eq(6).text().trim()).to.equal('392996735'); // SIP Txn No.
            expect(columns.eq(7).text().trim()).to.equal('10 Aug 2007'); // SIP Start Date
            expect(columns.eq(8).text().trim()).to.equal('10 Jul 2017'); // SIP End Date
            expect(columns.eq(9).text().trim()).to.equal('18 Nov 2008'); // Termination Date
            expect(columns.eq(10).text().trim()).to.equal('10'); // SIP Date
            expect(columns.eq(11).text().trim()).to.equal('1,000.00'); // SIP Registered Amount
            expect(columns.eq(12).text().trim()).to.equal('1,000.00'); // SIP Monthly Amount
            expect(columns.eq(13).text().trim()).to.equal('-'); // Rem. Inst.
            expect(columns.eq(14).text().trim()).to.equal('STATE BANK OF INDIA / 53009118524'); // Bank Name/ A/C No
            expect(columns.eq(15).text().trim()).to.equal('0 %'); // XIRR
        });

        // Validate the total values
        cy.get('#reportSipData_8733 tfoot tr td').each(($cell, index) => {
            if (index === 9) {
                expect($cell.text().trim()).to.equal('1,000.00'); // Total SIP Registered Amount
            } else if (index === 10) {
                expect($cell.text().trim()).to.equal('1,000.00'); // Total SIP Monthly Amount
            }
        });
    });


    // Validate STP --IMP Table have the one Empty Column that's why we got error
    it('Should validate the STP data', () => {
        // Open a new tab STP
        cy.get('#btn_web.btn.btn-success.vscroll').click();
        cy.wait(8000);
        cy.get('#liveportfoliotabllist8733 > li:nth-child(3) > a').click();
        //cy.get('#sipExportData > div > div > div > div.col-md-3 > div > div.radio.float-none.h-100.m-0.mr-4 > label').click();
        cy.get('#stpExportData > div > div > div > div.col-md-3 > div > div:nth-child(2) > label').click();
        cy.wait(6000);

        // Get the table headers
        cy.get('#reportStpData_8733 thead tr th').then(($headers) => {
            const columnHeaders = $headers.map((index, header) => header.textContent.trim()).get(); // Use .get() to convert to array

            // Validate the data for each row
            cy.get('#stps8733 tbody tr').each(($row, rowIndex) => {
                // Get the table columns
                const columns = $row.find('td');

                // Validate the data for each column
                columnHeaders.forEach((header, columnIndex) => {
                    expect(columns.eq(columnIndex).text().trim()).to.not.be.empty;
                });
            });
        });
        // Validate the total values
        cy.get('#reportStpData_8733 tfoot tr td').each(($cell, index) => {
            expect($cell.text().trim()).to.not.be.empty;
        });
    });
    //Validate the P&L
    it('Should validate the P&L Data', () => {
        // Open a new tab for Scheme data
        cy.get('#btn_web.btn.btn-success.vscroll').click();
        cy.wait(8000);
        cy.get('#liveportfoliotabllist8733 > li:nth-child(7) > a').click(); // Adjust the index if necessary
        cy.wait(6000);

        // Initialize individual objects for each attribute
        let inflowData = { "Inflow": [] };
        let redemptionData = { "Redemption": [] };
        let switchOutData = { "Switch Out": [] };
        let curValueData = { "Cur. Value": [] };
        let gainLossData = { "Gain & Loss": [] };
        let absRtnData = { "Abs. Rtn.": [] };
        let xirrData = { "XIRR": [] };

        // Function to convert formatted string to float
        const parseFormattedValue = (value) => {
            return parseFloat(value.replace(/,/g, '').replace('%', '')); // Remove commas and convert to float
        };

        // Assuming you have already navigated to the page containing the table
        cy.get('#profitLoss8733 tbody tr').each(($row) => {
            // Extracting the required values from the table
            const schemeName = $row.find('td').eq(0).text().trim();
            const folio = $row.find('td').eq(1).text().trim();
            const inflow = $row.find('td').eq(2).text().trim();
            const redemption = $row.find('td').eq(3).text().trim();
            const switchOut = $row.find('td').eq(4).text().trim();
            const curValue = $row.find('td').eq(5).text().trim();
            const gainLoss = $row.find('td').eq(6).text().trim();
            const absRtn = $row.find('td').eq(7).text().trim();
            const xirr = $row.find('td').eq(8).text().trim();

            // Push the extracted values into the corresponding arrays in the individual objects if they are not empty
            if (inflow) inflowData["Inflow"].push(parseFormattedValue(inflow));
            if (redemption) redemptionData["Redemption"].push(parseFormattedValue(redemption));
            if (switchOut) switchOutData["Switch Out"].push(parseFormattedValue(switchOut));
            if (curValue) curValueData["Cur. Value"].push(parseFormattedValue(curValue));
            if (gainLoss) gainLossData["Gain & Loss"].push(parseFormattedValue(gainLoss));
            if (absRtn) absRtnData["Abs. Rtn."].push(parseFormattedValue(absRtn));
            if (xirr) xirrData["XIRR"].push(parseFormattedValue(xirr));
        }).then(() => {
            // After all rows have been processed, log the individual objects
            cy.log('Inflow Data:', inflowData);
            cy.log('Redemption Data:', redemptionData);
            cy.log('Switch Out Data:', switchOutData);
            cy.log('Cur. Value Data:', curValueData);
            cy.log('Gain & Loss Data:', gainLossData);
            cy.log('Abs. Rtn. Data:', absRtnData);
            cy.log('XIRR Data:', xirrData);

            // Validate the total values in the footer
            cy.get('#whatIfSummary_8733 td', { timeout: 10000 }).each(($cell, index) => {
                cy.wrap($cell).should('be.visible').then(() => {
                    const cellText = $cell.text().trim();
                    cy.log(`Processing cell at index ${index}: ${cellText}`);
                    
                    if (index === 1) {
                        const expectedInflow = parseFormattedValue(cellText);
                        const sumInflow = inflowData["Inflow"].reduce((acc, val) => acc + val, 0);
                        cy.log(`Calculated Inflow: ${sumInflow}, Expected Inflow: ${expectedInflow}`);
                        expect(Number(sumInflow)).to.equal(Number(expectedInflow));
                    } else if (index === 3) {
                 const expectedRedemption = parseFormattedValue($cell.text().trim());
                    const sumRedemption = redemptionData["Redemption"].reduce((acc, val) => acc + val, 0);
                    expect(sumRedemption).to.equal(expectedRedemption); // Validate Redemption
                } else if (index === 4) {
                    const expectedSwitchOut = parseFormattedValue($cell.text().trim());
                    const sumSwitchOut = switchOutData["Switch Out"].reduce((acc, val) =>
                    expect(sumSwitchOut).to.equal(expectedSwitchOut))// Validate Switch Out
                } else if (index === 5) {
                    const expectedCurValue = parseFormattedValue($cell.text().trim());
                    const sumCurValue = curValueData["Cur. Value"].reduce((acc, val) => acc + val, 0);
                    expect(sumCurValue).to.equal(expectedCurValue); // Validate Current Value
                } else if (index === 6) {
                    const expectedGainLoss = parseFormattedValue($cell.text().trim());
                    const sumGainLoss = gainLossData["Gain & Loss"].reduce((acc, val) => acc + val, 0);
                    expect(sumGainLoss).to.equal(expectedGainLoss); // Validate Gain & Loss
                } else if (index === 7) {
                    const expectedAbsRtn = parseFormattedValue($cell.text().trim());
                    const sumAbsRtn = absRtnData["Abs. Rtn."].reduce((acc, val) => acc + val, 0);
                    const calculatedAbsRtn = (sumGainLoss / sumInflow) * 100; // Calculate Abs. Rtn.
                    expect(calculatedAbsRtn).to.equal(expectedAbsRtn); // Validate Absolute Return
                } else if (index === 8) {
                    const expectedXIRR = parseFormattedValue($cell.text().trim());
                    const sumXIRR = xirrData["XIRR"].reduce((acc, val) => acc + val, 0);
                    expect(sumXIRR).to.equal(expectedXIRR); // Validate XIRR
                }
            });
        });
    });

});
});