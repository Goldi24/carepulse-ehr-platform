const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const patientService = require('../services/patientService');
const hl7Service = require('../services/hl7Service');

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const orders = orderService.getAllOrders(req.query);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orderService.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders (CPOE entry)
router.post('/', (req, res) => {
  try {
    const { patientId, testName, type } = req.body;
    if (!patientId || !testName) {
      return res.status(400).json({ success: false, error: 'patientId and testName are required' });
    }

    const order = orderService.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: `CPOE ${order.type} order #${order.id} placed successfully`,
      data: order
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, results, impression } = req.body;
    const updated = orderService.updateOrderStatus(req.params.id, status, results, impression);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const patient = patientService.getPatientById(updated.patientId);
    let hl7Oru = null;
    if (patient && (updated.status === 'Completed' || updated.status === 'Reported')) {
      hl7Oru = hl7Service.generateOruR01(patient, updated);
    }

    res.json({
      success: true,
      message: `Order #${updated.id} status updated to ${updated.status}`,
      data: updated,
      hl7Oru
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id/hl7
router.get('/:id/hl7', (req, res) => {
  const order = orderService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  const patient = patientService.getPatientById(order.patientId);
  if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

  const hl7 = hl7Service.generateOruR01(patient, order);
  res.setHeader('Content-Type', 'text/plain');
  res.send(hl7);
});

module.exports = router;
