describe('API Data Validation with Web Report', () => {
  const apiUrl = 'https://wealthelite.in/api/api/wealth-report-details'; // Your API endpoint

  it('should print API data', () => {
    const requestBody = {
      "agent_id": "8",
      "view": "1",
      "user_id": "8733",
      "branch": "all",
      "advisor": "all",
      "type": "Commodity" // This must be valid
    };

    // Log the entire request configuration
    cy.log('Request Configuration:', {
      method: 'POST',
      url: apiUrl,
      body: requestBody
    });

    // Step 1: Fetch data from the API using POST method
    cy.request({
      method: 'POST', // Use POST method as per your curl request
      url: apiUrl,
      body: requestBody
    }).then((response) => {
      // Log the API Response in the Cypress Console
      cy.log('API Status:', response.status); // Check the HTTP status code
      cy.log('API Response Body:', JSON.stringify(response.body, null, 2)); // Full response body

      // Step 2: If you have data, log the response
      if (response.body) {
        cy.log('API Response Data:', JSON.stringify(response.body, null, 2));
      } else {
        cy.log('No response data received');
      }
    });
  });
});
