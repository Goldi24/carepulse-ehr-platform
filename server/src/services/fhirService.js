// HL7 FHIR Release 4 (R4) Resource Transformer & Service
const { getAllPatients, getPatientById } = require('./patientService');
const { getAllEncounters } = require('./clinicalService');
const { getAllOrders } = require('./orderService');
const { getAllMedications } = require('./medicationService');

function toFhirPatient(patient) {
  if (!patient) return null;

  return {
    resourceType: "Patient",
    id: patient.id,
    identifier: [
      {
        use: "usual",
        type: {
          coding: [
            { system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR", display: "Medical Record Number" }
          ]
        },
        system: "urn:oid:2.16.840.1.113883.4.1",
        value: patient.mrn
      }
    ],
    active: patient.status === "Active",
    name: [
      {
        use: "official",
        family: patient.lastName,
        given: [patient.firstName]
      }
    ],
    telecom: [
      { system: "phone", value: patient.phone, use: "mobile" },
      { system: "email", value: patient.email, use: "home" }
    ],
    gender: patient.gender ? patient.gender.toLowerCase() : "unknown",
    birthDate: patient.dob,
    address: [
      {
        use: "home",
        line: [patient.address?.street || ""],
        city: patient.address?.city || "",
        state: patient.address?.state || "",
        postalCode: patient.address?.zip || "",
        country: "USA"
      }
    ],
    contact: patient.emergencyContact ? [
      {
        relationship: [{ text: patient.emergencyContact.relation }],
        name: { text: patient.emergencyContact.name },
        telecom: [{ system: "phone", value: patient.emergencyContact.phone }]
      }
    ] : []
  };
}

function toFhirObservation(encounter, vitalType, value, unit, code, display) {
  return {
    resourceType: "Observation",
    id: `OBS-${encounter.id}-${vitalType}`,
    status: "final",
    category: [
      {
        coding: [
          { system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }
        ]
      }
    ],
    code: {
      coding: [
        { system: "http://loinc.org", code: code, display: display }
      ],
      text: display
    },
    subject: {
      reference: `Patient/${encounter.patientId}`
    },
    effectiveDateTime: encounter.date,
    valueQuantity: {
      value: value,
      unit: unit,
      system: "http://unitsofmeasure.org"
    }
  };
}

function toFhirMedicationRequest(med) {
  return {
    resourceType: "MedicationRequest",
    id: med.id,
    status: med.status.toLowerCase() === "active" ? "active" : "stopped",
    intent: "order",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: med.rxNormCode,
          display: med.drugName
        }
      ],
      text: med.drugName
    },
    subject: {
      reference: `Patient/${med.patientId}`
    },
    authoredOn: med.prescribedDate,
    requester: {
      display: med.prescribedBy
    },
    dosageInstruction: [
      {
        text: `${med.dosage} ${med.route} ${med.frequency}`,
        route: { text: med.route },
        timing: { code: { text: med.frequency } }
      }
    ],
    dispenseRequest: {
      numberOfRepeatsAllowed: med.refills,
      expectedSupplyDuration: {
        value: parseInt(med.duration) || 30,
        unit: "days",
        system: "http://unitsofmeasure.org",
        code: "d"
      }
    }
  };
}

function toFhirDiagnosticReport(order) {
  return {
    resourceType: "DiagnosticReport",
    id: order.id,
    status: order.status.toLowerCase() === "completed" ? "final" : "registered",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0074",
            code: order.category,
            display: order.type
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: order.loincCode,
          display: order.testName
        }
      ],
      text: order.testName
    },
    subject: {
      reference: `Patient/${order.patientId}`
    },
    effectiveDateTime: order.orderDate,
    issued: order.reportedAt || order.orderDate,
    performer: [
      { display: order.orderedBy }
    ],
    conclusion: order.radiologistImpression || order.clinicalNotes || "Results pending review"
  };
}

function getFhirBundle(patientId = null) {
  let patients = patientId ? [getPatientById(patientId)].filter(Boolean) : getAllPatients();
  let entries = [];

  for (const pat of patients) {
    entries.push({
      fullUrl: `urn:uuid:${pat.id}`,
      resource: toFhirPatient(pat)
    });

    const patientEncounters = getAllEncounters(pat.id);
    for (const enc of patientEncounters) {
      if (enc.vitals) {
        if (enc.vitals.heartRate) {
          entries.push({ fullUrl: `urn:uuid:OBS-${enc.id}-HR`, resource: toFhirObservation(enc, "HR", enc.vitals.heartRate, "beats/min", "8867-4", "Heart rate") });
        }
        if (enc.vitals.systolicBP) {
          entries.push({ fullUrl: `urn:uuid:OBS-${enc.id}-SBP`, resource: toFhirObservation(enc, "SBP", enc.vitals.systolicBP, "mmHg", "8480-6", "Systolic blood pressure") });
        }
        if (enc.vitals.oxygenSaturation) {
          entries.push({ fullUrl: `urn:uuid:OBS-${enc.id}-O2`, resource: toFhirObservation(enc, "O2", enc.vitals.oxygenSaturation, "%", "2708-6", "Oxygen saturation in Arterial blood") });
        }
      }
    }

    const patientMeds = getAllMedications({ patientId: pat.id });
    for (const med of patientMeds) {
      entries.push({ fullUrl: `urn:uuid:${med.id}`, resource: toFhirMedicationRequest(med) });
    }

    const patientOrders = getAllOrders({ patientId: pat.id });
    for (const ord of patientOrders) {
      entries.push({ fullUrl: `urn:uuid:${ord.id}`, resource: toFhirDiagnosticReport(ord) });
    }
  }

  return {
    resourceType: "Bundle",
    type: "searchset",
    total: entries.length,
    entry: entries
  };
}

module.exports = {
  toFhirPatient,
  toFhirObservation,
  toFhirMedicationRequest,
  toFhirDiagnosticReport,
  getFhirBundle
};
