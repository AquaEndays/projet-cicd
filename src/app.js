const express = require('express');
const path = require('path');

const app = express();

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API route for health and status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
});

// Explicit root route serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
