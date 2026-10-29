const test = require('node:test');
const assert = require('node:assert/strict');
const patientService = require('../src/services/patientService');
const clinicalService = require('../src/services/clinicalService');
const orderService = require('../src/services/orderService');
const medicationService = require('../src/services/medicationService');
const hl7Service = require('../src/services/hl7Service');
const fhirService = require('../src/services/fhirService');
const portalService = require('../src/services/portalService');
const integrationService = require('../src/services/integrationService');
const metricsService = require('../src/services/metricsService');

test('Patient Service - Retrieve & Register Patients', () => {
  const all = patientService.getAllPatients();
  assert.ok(all.length >= 4, 'Should load initial seeded patients');

  const p1 = patientService.getPatientById('PAT-1001');
  assert.equal(p1.firstName, 'Eleanor');
  assert.equal(p1.lastName, 'Vance');
  assert.equal(p1.bloodGroup, 'A+');

  const newPatient = patientService.createPatient({
    firstName: "Test",
    lastName: "Subject",
    dob: "1992-05-10",
    gender: "Male"
  });
  assert.ok(newPatient.id.startsWith('PAT-'), 'Should generate PAT ID');
  assert.equal(newPatient.firstName, 'Test');
});

test('Clinical Service - Calculate BMI and Create SOAP Encounter', () => {
  const bmi = clinicalService.calculateBMI(70, 175);
  assert.equal(bmi, 22.9, 'BMI calculation should be accurate');

  const enc = clinicalService.createEncounter({
    patientId: 'PAT-1001',
    provider: 'Dr. Adams',
    reasonForVisit: 'Hypertension follow-up',
    vitals: { weightKg: 80, heightCm: 170, systolicBP: 130, diastolicBP: 85 },
    soapNote: {
      subjective: 'Mild dizziness',
      objective: 'BP 130/85',
      assessment: 'Hypertension',
      plan: 'Monitor BP'
    }
  });

  assert.ok(enc.id.startsWith('ENC-'), 'Should assign encounter ID');
  assert.equal(enc.patientId, 'PAT-1001');
  assert.equal(enc.vitals.bmi, 27.7);
});

test('Order Management (CPOE) - Create Order and Update Results', () => {
  const order = orderService.createOrder({
    patientId: 'PAT-1002',
    type: 'Laboratory',
    testName: 'Lipid Panel',
    loincCode: '573-7',
    priority: 'Routine'
  });

  assert.ok(order.id.startsWith('ORD-'));
  assert.equal(order.status, 'Ordered');

  const updated = orderService.updateOrderStatus(order.id, 'Completed', [
    { test: 'Total Cholesterol', value: '185', unit: 'mg/dL', referenceRange: '< 200', flag: 'Normal' }
  ]);

  assert.equal(updated.status, 'Completed');
  assert.equal(updated.results.length, 1);
  assert.ok(updated.reportedAt);
});

test('Medication Service - Allergy Contraindication Clinical Decision Support', () => {
  const pat1 = patientService.getPatientById('PAT-1001'); // allergic to Penicillin
  const checkConflict = medicationService.checkAllergyContraindication(pat1, 'Amoxicillin 500mg');
  assert.equal(checkConflict.hasConflict, true, 'Amoxicillin should trigger penicillin cross-reactivity warning');

  const checkSafe = medicationService.checkAllergyContraindication(pat1, 'Lisinopril 10mg');
  assert.equal(checkSafe.hasConflict, false, 'Lisinopril should not conflict with Penicillin allergy');

  // Verify that prescribing contraindicated drug throws without override
  assert.throws(() => {
    medicationService.prescribeMedication({
      patientId: 'PAT-1001',
      drugName: 'Amoxicillin',
      dosage: '500mg'
    });
  }, { name: 'AllergyContraindicationError' });

  // Prescribing with explicit clinical override should succeed
  const overridePrescription = medicationService.prescribeMedication({
    patientId: 'PAT-1001',
    drugName: 'Amoxicillin',
    dosage: '500mg',
    overrideAllergyWarning: true,
    overrideReason: 'Desensitization protocol completed in ICU'
  });

  assert.ok(overridePrescription.medication.id);
  assert.equal(overridePrescription.allergyWarningOverridden, true);
});

test('Interoperability - HL7 v2.5.1 Message Generation and Parsing', () => {
  const pat = patientService.getPatientById('PAT-1001');
  const enc = clinicalService.getAllEncounters('PAT-1001')[0];

  const hl7Adt = hl7Service.generateAdtA01(pat, enc);
  assert.ok(hl7Adt.includes('MSH|'), 'Must contain MSH segment');
  assert.ok(hl7Adt.includes('PID|1||MRN-2026-8941'), 'Must contain patient MRN in PID segment');
  assert.ok(hl7Adt.includes('ADT^A01^ADT_A01'), 'Must have correct message type');

  const parsed = hl7Service.parseHL7(hl7Adt);
  assert.equal(parsed.details.patientLastName, 'Vance');
  assert.equal(parsed.details.patientFirstName, 'Eleanor');
  assert.equal(parsed.details.patientMrn, 'MRN-2026-8941');
});

test('Interoperability - HL7 FHIR R4 Bundle & Resource Generation', () => {
  const pat = patientService.getPatientById('PAT-1001');
  const fhirPat = fhirService.toFhirPatient(pat);

  assert.equal(fhirPat.resourceType, 'Patient');
  assert.equal(fhirPat.name[0].family, 'Vance');
  assert.equal(fhirPat.identifier[0].value, 'MRN-2026-8941');

  const bundle = fhirService.getFhirBundle('PAT-1001');
  assert.equal(bundle.resourceType, 'Bundle');
  assert.ok(bundle.total > 0, 'Bundle should contain entries');
});

test('Patient Portal - Scheduling and Secure Messaging', () => {
  const apt = portalService.bookAppointment({
    patientId: 'PAT-1003',
    providerName: 'Dr. Rivera',
    type: 'Telehealth',
    reason: 'Follow-up'
  });
  assert.ok(apt.id.startsWith('APT-'));
  assert.equal(apt.status, 'Scheduled');

  const msg = portalService.sendMessage({
    patientId: 'PAT-1003',
    subject: 'Prescription Refill',
    body: 'Need refill for my vitamins'
  });
  assert.ok(msg.id.startsWith('MSG-'));

  const replied = portalService.replyMessage(msg.id, 'Dr. Rivera', 'Prescription has been authorized.');
  assert.equal(replied.replies.length, 1);
});

test('Integrations & Agile Metrics Service', () => {
  const systems = integrationService.getExternalSystems();
  assert.equal(systems.length, 4, 'Should track EMR, PACS, LIS, and Pharmacy systems');

  const syncRes = integrationService.triggerSystemSync('SYS-LIS');
  assert.ok(syncRes.log.id);

  const metrics = metricsService.getAgileMetrics();
  assert.equal(metrics.projectSummary.code, 'EHRS01');
  assert.equal(metrics.epicsProgress.length, 6, '6 epics in scope');
});
