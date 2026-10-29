const express = require('express');
const router = express.Router();
const portalService = require('../services/portalService');

// GET /api/portal/appointments
router.get('/appointments', (req, res) => {
  const { patientId } = req.query;
  const apts = portalService.getAppointments(patientId);
  res.json({ success: true, count: apts.length, data: apts });
});

// POST /api/portal/appointments
router.post('/appointments', (req, res) => {
  try {
    const { patientId, providerName } = req.body;
    if (!patientId || !providerName) {
      return res.status(400).json({ success: false, error: 'patientId and providerName are required' });
    }
    const apt = portalService.bookAppointment(req.body);
    res.status(201).json({ success: true, message: 'Appointment scheduled', data: apt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/portal/appointments/:id/cancel
router.patch('/appointments/:id/cancel', (req, res) => {
  const apt = portalService.cancelAppointment(req.params.id);
  if (!apt) return res.status(404).json({ success: false, error: 'Appointment not found' });
  res.json({ success: true, message: 'Appointment cancelled', data: apt });
});

// GET /api/portal/messages
router.get('/messages', (req, res) => {
  const { patientId } = req.query;
  const msgs = portalService.getMessages(patientId);
  res.json({ success: true, count: msgs.length, data: msgs });
});

// POST /api/portal/messages
router.post('/messages', (req, res) => {
  try {
    const { patientId, subject, body } = req.body;
    if (!patientId || !body) {
      return res.status(400).json({ success: false, error: 'patientId and message body are required' });
    }
    const msg = portalService.sendMessage(req.body);
    res.status(201).json({ success: true, message: 'Message sent to care team', data: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/portal/messages/:id/reply
router.post('/messages/:id/reply', (req, res) => {
  try {
    const { sender, body } = req.body;
    if (!sender || !body) {
      return res.status(400).json({ success: false, error: 'sender and body are required' });
    }
    const updated = portalService.replyMessage(req.params.id, sender, body);
    if (!updated) return res.status(404).json({ success: false, error: 'Message thread not found' });
    res.json({ success: true, message: 'Reply sent', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
