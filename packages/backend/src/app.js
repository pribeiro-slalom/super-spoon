const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize database and move DB logic to a separate module
const { db } = require('./db');

// Mount items router
const itemsRouter = require('./routes/items');
app.use('/api/items', itemsRouter);

module.exports = { app, db };