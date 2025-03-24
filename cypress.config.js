require('dotenv').config();
const { defineConfig } = require('cypress');
const { MongoClient } = require('mongodb');
const mysql = require('mysql2');

module.exports = defineConfig({
  e2e: {
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome/',
      reportFilename: 'reports',
      html: true,
      json: true,
      overwrite: true,
      timestamp: 'yyyy-mm-dd_HH-MM-ss',
      charts: true,
      inline: true,
    },
    setupNodeEvents(on, config) {
      on('task', {
        async testMySQLConnection({ tableName, successMsg, errorMsg, whereCondition }) {
          const connection = mysql.createConnection({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER,      
            password: process.env.DB_PASSWORD,  
            database: process.env.DB_NAME   
          });
          return new Promise((resolve, reject) => {
            connection.connect((err) => {
              if (err) {
                console.error('Error connecting to MySQL:', err);
                reject({ success: false, message: `Error connecting to MySQL: ${err.message}` });
              } else {
                console.log('MySQL connection successful!');
                connection.query(`SELECT * from ${tableName} ${whereCondition}`, (queryErr, results) => {
                  if (queryErr) {
                    reject({ success: false, message: `Error running query: ${queryErr.message}` });
                  } else {
                    resolve({ success: true, message: 'MySQL connection successful!', data: results });
                  }
                });
              }
            });
          }).finally(() => {
            connection.end();
          });
        },
        
        async testMongoConnection({ collectionName, successMsg, errorMsg, whereCondition }) {
          const uri = process.env.MONGODB_URI;
          const dbName = 'testdb';
          
          if (!uri || !uri.startsWith('mongodb://')) {
            return { 
              success: false, 
              message: 'Invalid MongoDB URI. Please check your .env file' 
            };
          }

          const client = new MongoClient(uri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
          });

          try {
            console.log('Attempting to connect to MongoDB...');
            await client.connect();
            console.log('MongoDB connection established');

            const database = client.db(dbName);
            const adminDb = client.db().admin();
            const dbList = await adminDb.listDatabases();
            console.log('Databases:', dbList);
            
            if (!dbList.databases.some(db => db.name === dbName)) {
              return { 
                success: false, 
                message: `Database '${dbName}' not found` 
              };
            }

            const collections = await database.listCollections().toArray();
            console.log('Collections:', collections);
            if (!collections.some(col => col.name === collectionName)) {
              return { 
                success: false, 
                message: `Collection '${collectionName}' not found in database '${dbName}'` 
              };
            }

            const collection = database.collection(collectionName);
            const query = whereCondition ? JSON.parse(whereCondition) : {};
            const results = await collection.find(query).toArray();

            return { 
              success: true, 
              message: successMsg || 'MongoDB connection successful!', 
              data: results 
            };

          } catch (error) {
            console.error('MongoDB connection error:', error);
            return { 
              success: false, 
              message: `MongoDB connection failed: ${error.message}`,
              errorDetails: {
                uri: uri,
                dbName: dbName,
                collectionName: collectionName,
                stack: error.stack
              }
            };
          } finally {
            await client.close();
            console.log('MongoDB connection closed');
          }
        }
      });
      return config;
    },
  },
});
