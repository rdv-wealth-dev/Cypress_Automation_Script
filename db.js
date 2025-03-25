require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Query function to run queries

async function queryDatabase(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(query, params);
    return rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    connection.release();  // Release the connection back to the pool
  }
}

module.exports = { queryDatabase };
