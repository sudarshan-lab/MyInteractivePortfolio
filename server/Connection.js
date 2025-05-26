
const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  const conParams = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
  

  try {
    await mongoose.connect(uri, conParams);
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection error');
  }
};

module.exports = connectToDatabase;

