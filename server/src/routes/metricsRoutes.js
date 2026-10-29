const express = require('express');
const router = express.Router();
const metricsService = require('../services/metricsService');

// GET /api/metrics
router.get('/', (req, res) => {
  const metrics = metricsService.getAgileMetrics();
  res.json({ success: true, data: metrics });
});

// POST /api/metrics/epic-progress
router.post('/epic-progress', (req, res) => {
  const { epic, completion, storiesCompleted } = req.body;
  if (!epic) return res.status(400).json({ success: false, error: 'Epic name is required' });
  const updated = metricsService.updateEpicProgress(epic, completion, storiesCompleted);
  if (!updated) return res.status(404).json({ success: false, error: 'Epic not found' });
  res.json({ success: true, message: 'Epic progress updated', data: updated });
});

// POST /api/metrics/update
router.post('/update', (req, res) => {
  const { level, metricName, newValue } = req.body;
  if (!level || !metricName || newValue === undefined) {
    return res.status(400).json({ success: false, error: 'level, metricName, and newValue are required' });
  }
  const updated = metricsService.updateMetric(level, metricName, newValue);
  if (!updated) return res.status(404).json({ success: false, error: 'Metric not found' });
  res.json({ success: true, message: 'Metric updated', data: updated });
});

module.exports = router;
