const express = require('express');
const router = express.Router();
const medicationService = require('../services/medicationService');
const patientService = require('../services/patientService');
const hl7Service = require('../services/hl7Service');

// GET /api/medications
router.get('/', (req, res) => {
  try {
    const meds = medicationService.getAllMedications(req.query);
    res.json({ success: true, count: meds.length, data: meds });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/medications/check-contraindication
router.post('/check-contraindication', (req, res) => {
  try {
    const { patientId, drugName } = req.body;
    if (!patientId || !drugName) {
      return res.status(400).json({ success: false, error: 'patientId and drugName are required' });
    }

    const patient = patientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const check = medicationService.checkAllergyContraindication(patient, drugName);
    res.json({ success: true, contraindication: check });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/medications (e-prescribing)
router.post('/', (req, res) => {
  try {
    const { patientId, drugName, dosage } = req.body;
    if (!patientId || !drugName || !dosage) {
      return res.status(400).json({ success: false, error: 'patientId, drugName, and dosage are required' });
    }

    const patient = patientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const result = medicationService.prescribeMedication(req.body);
    const hl7Rde = hl7Service.generateRdeO11(patient, result.medication);

    res.status(201).json({
      success: true,
      message: `Prescription #${result.medication.id} for ${result.medication.drugName} routed to pharmacy`,
      data: result.medication,
      allergyWarningOverridden: result.allergyWarningOverridden,
      hl7Rde
    });
  } catch (err) {
    if (err.name === 'AllergyContraindicationError') {
      return res.status(409).json({
        success: false,
        error: err.message,
        isContraindicated: true,
        allergyDetails: err.allergyDetails
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/medications/:id/discontinue
router.patch('/:id/discontinue', (req, res) => {
  try {
    const { reason } = req.body;
    const discontinued = medicationService.discontinueMedication(req.params.id, reason);
    if (!discontinued) {
      return res.status(404).json({ success: false, error: 'Medication not found' });
    }
    res.json({
      success: true,
      message: `Medication #${discontinued.id} (${discontinued.drugName}) discontinued`,
      data: discontinued
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
