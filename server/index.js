const express = require('express');
const messagesRouter = require('./routes/messages');
const connectToDatabase = require('./Connection'); 

require('dotenv').config();

const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors({
    origin: ['https://skammu.website', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
  }));

  app.use('/api/messages', messagesRouter);

connectToDatabase().catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  });

  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });