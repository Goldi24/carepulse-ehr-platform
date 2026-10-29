const express = require('express');
const router = express.Router();
const integrationService = require('../services/integrationService');

// GET /api/integrations/systems
router.get('/systems', (req, res) => {
  const systems = integrationService.getExternalSystems();
  res.json({ success: true, count: systems.length, data: systems });
});

// GET /api/integrations/logs
router.get('/logs', (req, res) => {
  const logs = integrationService.getSyncLogs();
  res.json({ success: true, count: logs.length, data: logs });
});

// POST /api/integrations/sync/:systemId
router.post('/sync/:systemId', (req, res) => {
  const result = integrationService.triggerSystemSync(req.params.systemId);
  if (!result) {
    return res.status(404).json({ success: false, error: 'System connector not found' });
  }
  res.json({ success: true, message: 'Sync handshake successful', data: result });
});

module.exports = router;
