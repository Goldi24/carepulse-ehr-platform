const express = require('express');
const cors = require('cors');
const path = require('path');

const patientRoutes = require('./routes/patientRoutes');
const clinicalRoutes = require('./routes/clinicalRoutes');
const orderRoutes = require('./routes/orderRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const fhirRoutes = require('./routes/fhirRoutes');
const hl7Routes = require('./routes/hl7Routes');
const portalRoutes = require('./routes/portalRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'Electronic Health Record System (EHRS01)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Register feature routes
app.use('/api/patients', patientRoutes);
app.use('/api/encounters', clinicalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/fhir', fhirRoutes);
app.use('/api/hl7', hl7Routes);
app.use('/api/portal', portalRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/metrics', metricsRoutes);

// Static frontend serving from client/dist
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
