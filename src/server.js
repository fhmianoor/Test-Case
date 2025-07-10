const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = require('./app.js');
const sequelize = require('./utils/db');


express.Router();

const server = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

server();
