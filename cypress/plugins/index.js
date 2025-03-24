const { MongoClient } = require('mongodb');
const mysql = require('mysql2');





module.exports = (on, config) => {
  on('task', {
    getDataFromDB(query) {
      return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
          host: process.env.DB_HOST,     // MySQL host
          user: process.env.DB_USER,     // MySQL username
          password: process.env.DB_PASSWORD, // MySQL password
          database: process.env.DB_NAME
        });

        connection.query(query, (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });

        connection.end();
      });
    },
    
    async testMongoConnection({ collectionName, whereCondition }) {
      // Validate required parameters
      if (!collectionName || !whereCondition) {
        return { success: false, message: 'Missing required parameters' };
      }

      // Validate and format MongoDB URI
      const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/';
      if (!uri.startsWith('mongodb://')) {
        return { success: false, message: 'Invalid MongoDB URI' };
      }

      const client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000 // 5 second timeout
      });

      try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB || 'testdb');
        
        // Validate collection exists
        const collections = await database.listCollections().toArray();
        if (!collections.some(col => col.name === collectionName)) {
          return { success: false, message: `Collection ${collectionName} not found` };
        }

        const collection = database.collection(collectionName);
        const data = await collection.find(whereCondition).toArray();
        
        return { 
          success: true, 
          data: data,
          count: data.length
        };
      } catch (error) {
        console.error('MongoDB Error:', error);
        return { 
          success: false, 
          message: `MongoDB operation failed: ${error.message}`,
          error: error.toString()
        };
      } finally {
        if (client && client.isConnected()) {
          await client.close();
        }
      }

    }
  });
};
