const express = require('express');

// Routes

// Init our express app
const app = express();

// Enable express app to receive JSON data
app.use(express.json());

// Defining end-points

// Global error handler

// Catch non-existing endpoints

module.exports = { app };
