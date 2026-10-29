const express = require('express');
const router = express.Router();
const clinicalService = require('../services/clinicalService');
const patientService = require('../services/patientService');
const hl7Service = require('../services/hl7Service');

// GET /api/encounters
router.get('/', (req, res) => {
  try {
    const { patientId } = req.query;
    const encounters = clinicalService.getAllEncounters(patientId);
    res.json({ success: true, count: encounters.length, data: encounters });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/encounters/:id
router.get('/:id', (req, res) => {
  const enc = clinicalService.getEncounterById(req.params.id);
  if (!enc) {
    return res.status(404).json({ success: false, error: 'Encounter not found' });
  }
  res.json({ success: true, data: enc });
});

// POST /api/encounters
router.post('/', (req, res) => {
  try {
    const { patientId, reasonForVisit } = req.body;
    if (!patientId) {
      return res.status(400).json({ success: false, error: 'patientId is required' });
    }

    const patient = patientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient does not exist' });
    }

    const encounter = clinicalService.createEncounter(req.body);
    const hl7Adt01 = hl7Service.generateAdtA01(patient, encounter);

    res.status(201).json({
      success: true,
      message: 'Clinical encounter and SOAP note documented',
      data: encounter,
      hl7Adt01
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/encounters/:id
router.put('/:id', (req, res) => {
  try {
    const updated = clinicalService.updateEncounter(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Encounter not found' });
    }
    res.json({ success: true, message: 'Encounter updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
