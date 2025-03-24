const { MongoClient } = require('mongodb');

// MongoDB URI - Replace with your own connection string
const uri = 'mongodb://localhost:27017/testdb'; // Local MongoDB
// Or use MongoDB Atlas for cloud connection:
// const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/testdb?retryWrites=true&w=majority';

// Database name
const dbName = 'testdb'; // Replace with your MongoDB test database name

// Create a MongoDB client and connect to the database
const client = new MongoClient(uri);

const connectDb = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

const closeDb = async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Failed to close MongoDB connection', error);
  }
};

module.exports = { connectDb, closeDb };
