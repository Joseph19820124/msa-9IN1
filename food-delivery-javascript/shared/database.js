const mongoose = require('mongoose');

class Database {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mongoose.connect(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      });
      
      console.log('Connected to MongoDB');
      
      // Connection event handlers
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
      
      return this.connection;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    }
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = Database;