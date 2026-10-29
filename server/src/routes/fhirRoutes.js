const express = require('express');
const router = express.Router();
const fhirService = require('../services/fhirService');
const patientService = require('../services/patientService');
const clinicalService = require('../services/clinicalService');
const medicationService = require('../services/medicationService');
const orderService = require('../services/orderService');

// GET /api/fhir/metadata - FHIR Capability Statement
router.get('/metadata', (req, res) => {
  res.json({
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toISOString(),
    publisher: "EHRS01 Healthcare & Pharma",
    kind: "instance",
    software: {
      name: "EHRS01 Electronic Health Record System",
      version: "1.0.0"
    },
    fhirVersion: "4.0.1",
    format: ["application/fhir+json", "application/json"],
    rest: [
      {
        mode: "server",
        resource: [
          { type: "Patient", interaction: [{ code: "read" }, { code: "search-type" }] },
          { type: "Observation", interaction: [{ code: "read" }, { code: "search-type" }] },
          { type: "MedicationRequest", interaction: [{ code: "read" }, { code: "search-type" }] },
          { type: "DiagnosticReport", interaction: [{ code: "read" }, { code: "search-type" }] }
        ]
      }
    ]
  });
});

// GET /api/fhir/Patient
router.get('/Patient', (req, res) => {
  const patients = patientService.getAllPatients();
  const bundle = {
    resourceType: "Bundle",
    type: "searchset",
    total: patients.length,
    entry: patients.map(p => ({
      fullUrl: `${req.protocol}://${req.get('host')}/api/fhir/Patient/${p.id}`,
      resource: fhirService.toFhirPatient(p)
    }))
  };
  res.json(bundle);
});

// GET /api/fhir/Patient/:id
router.get('/Patient/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) {
    return res.status(404).json({
      resourceType: "OperationOutcome",
      issue: [{ severity: "error", code: "not-found", diagnostics: `Patient ${req.params.id} not found` }]
    });
  }
  res.json(fhirService.toFhirPatient(patient));
});

// GET /api/fhir/Observation
router.get('/Observation', (req, res) => {
  const { patient } = req.query;
  const encounters = clinicalService.getAllEncounters(patient);
  let entries = [];

  for (const enc of encounters) {
    if (enc.vitals) {
      if (enc.vitals.heartRate) {
        entries.push({ fullUrl: `urn:uuid:OBS-${enc.id}-HR`, resource: fhirService.toFhirObservation(enc, "HR", enc.vitals.heartRate, "beats/min", "8867-4", "Heart rate") });
      }
      if (enc.vitals.systolicBP) {
        entries.push({ fullUrl: `urn:uuid:OBS-${enc.id}-SBP`, resource: fhirService.toFhirObservation(enc, "SBP", enc.vitals.systolicBP, "mmHg", "8480-6", "Systolic blood pressure") });
      }
      if (enc.vitals.oxygenSaturation) {
        entries.push({ fullUrl: `urn:uuid:OBS-${enc.id}-O2`, resource: fhirService.toFhirObservation(enc, "O2", enc.vitals.oxygenSaturation, "%", "2708-6", "Oxygen saturation in Arterial blood") });
      }
    }
  }

  res.json({
    resourceType: "Bundle",
    type: "searchset",
    total: entries.length,
    entry: entries
  });
});

// GET /api/fhir/MedicationRequest
router.get('/MedicationRequest', (req, res) => {
  const { patient } = req.query;
  const meds = medicationService.getAllMedications(patient ? { patientId: patient } : {});
  res.json({
    resourceType: "Bundle",
    type: "searchset",
    total: meds.length,
    entry: meds.map(m => ({
      fullUrl: `${req.protocol}://${req.get('host')}/api/fhir/MedicationRequest/${m.id}`,
      resource: fhirService.toFhirMedicationRequest(m)
    }))
  });
});

// GET /api/fhir/DiagnosticReport
router.get('/DiagnosticReport', (req, res) => {
  const { patient } = req.query;
  const orders = orderService.getAllOrders(patient ? { patientId: patient } : {});
  res.json({
    resourceType: "Bundle",
    type: "searchset",
    total: orders.length,
    entry: orders.map(o => ({
      fullUrl: `${req.protocol}://${req.get('host')}/api/fhir/DiagnosticReport/${o.id}`,
      resource: fhirService.toFhirDiagnosticReport(o)
    }))
  });
});

// GET /api/fhir/$everything
router.get('/\\$everything', (req, res) => {
  const { patient } = req.query;
  const bundle = fhirService.getFhirBundle(patient);
  res.json(bundle);
});

module.exports = router;
