const express = require('express');
const router = express.Router();
const hl7Service = require('../services/hl7Service');
const patientService = require('../services/patientService');
const clinicalService = require('../services/clinicalService');
const orderService = require('../services/orderService');
const medicationService = require('../services/medicationService');

// POST /api/hl7/parse - parse any HL7 string
router.post('/parse', (req, res) => {
  try {
    const { hl7Message } = req.body;
    if (!hl7Message) {
      return res.status(400).json({ success: false, error: 'hl7Message string is required' });
    }
    const parsed = hl7Service.parseHL7(hl7Message);
    res.json({ success: true, parsed });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/hl7/samples/:type - get sample HL7 message
router.get('/samples/:type', (req, res) => {
  const { type } = req.params;
  const patient = patientService.getAllPatients()[0];
  const encounter = clinicalService.getAllEncounters()[0];
  const order = orderService.getAllOrders()[0];
  const medication = medicationService.getAllMedications()[0];

  let rawMessage = "";
  if (type === 'ADT_A01') {
    rawMessage = hl7Service.generateAdtA01(patient, encounter);
  } else if (type === 'ADT_A08') {
    rawMessage = hl7Service.generateAdtA08(patient);
  } else if (type === 'ORU_R01') {
    rawMessage = hl7Service.generateOruR01(patient, order);
  } else if (type === 'RDE_O11') {
    rawMessage = hl7Service.generateRdeO11(patient, medication);
  } else {
    return res.status(400).json({ success: false, error: 'Supported types: ADT_A01, ADT_A08, ORU_R01, RDE_O11' });
  }

  res.json({
    success: true,
    messageType: type,
    rawMessage,
    parsed: hl7Service.parseHL7(rawMessage)
  });
});

module.exports = router;
