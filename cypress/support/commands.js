import mysql from 'mysql2/promise';

// Create a pool for MySQL connection
let pool;

before(() => {
  pool = mysql.createPool({
    host: Cypress.env('DB_HOST'),
    user: Cypress.env('DB_USER'),
    password: Cypress.env('DB_PASSWORD'),
    database: Cypress.env('DB_NAME'),
    connectionLimit: 10,
  });

  cy.wrap(pool).as('dbPool');  // Store the pool for reuse in tests
});

// Custom command to query the database
Cypress.Commands.add('queryDatabase', (query, params = []) => {
  cy.get('@dbPool').then(pool => {
    return pool.execute(query, params);
  });
});
import 'cypress-xpath';
