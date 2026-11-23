const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();

// Initialize Prometheus registry and default metrics (CPU, RAM, Event Loop, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics for HTTP requests
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);

// Middleware to capture metrics for all requests
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route: route,
      code: res.statusCode
    };
    httpRequestsTotal.inc(labels);
    httpRequestDurationMicroseconds.observe(labels, duration);
  });
  next();
});

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex.message);
  }
});

// API route for health and status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '1.1',
    timestamp: new Date().toISOString()
  });
});

// Explicit root route serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
