const express = require('express');
const dotenv = require('dotenv');
const router = require('./router/router.js');
const app = express();
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

module.exports = app;