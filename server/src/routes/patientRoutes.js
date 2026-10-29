const express = require('express');
const router = express.Router();
const patientService = require('../services/patientService');
const hl7Service = require('../services/hl7Service');
const fhirService = require('../services/fhirService');

// GET /api/patients
router.get('/', (req, res) => {
  try {
    const patients = patientService.getAllPatients(req.query);
    res.json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/patients/:id
router.get('/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }
  res.json({ success: true, data: patient });
});

// POST /api/patients
router.post('/', (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName) {
      return res.status(400).json({ success: false, error: 'First name and Last name are required' });
    }
    const newPatient = patientService.createPatient(req.body);
    const hl7Adt = hl7Service.generateAdtA08(newPatient);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: newPatient,
      hl7Notification: hl7Adt
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/patients/:id
router.put('/:id', (req, res) => {
  try {
    const updated = patientService.updatePatient(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    const hl7Update = hl7Service.generateAdtA08(updated);

    res.json({
      success: true,
      message: 'Patient profile updated',
      data: updated,
      hl7Notification: hl7Update
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/patients/:id
router.delete('/:id', (req, res) => {
  const deleted = patientService.deletePatient(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }
  res.json({ success: true, message: 'Patient record removed' });
});

// GET /api/patients/:id/hl7
router.get('/:id/hl7', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }
  const hl7 = hl7Service.generateAdtA08(patient);
  res.setHeader('Content-Type', 'text/plain');
  res.send(hl7);
});

// GET /api/patients/:id/fhir
router.get('/:id/fhir', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found' });
  }
  const fhir = fhirService.toFhirPatient(patient);
  res.json(fhir);
});

module.exports = router;
