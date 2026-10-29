const { initialMedications } = require('../data/initialData');
const { getPatientById } = require('./patientService');

let medications = JSON.parse(JSON.stringify(initialMedications));

// Drug-allergy cross-reactivity mapping for clinical decision support
const ALLERGY_DRUG_MAP = {
  penicillin: ["amoxicillin", "ampicillin", "augmentin", "penicillin", "piperacillin", "dicloxacillin"],
  sulfa: ["bactrim", "sulfamethoxazole", "septra", "sulfasalazine"],
  codeine: ["codeine", "morphine", "hydrocodone", "oxycodone", "tramadol"],
  aspirin: ["aspirin", "ibuprofen", "naproxen", "ketorolac", "diclofenac", "nsaid"]
};

function checkAllergyContraindication(patient, drugName) {
  if (!patient || !patient.allergies || !patient.allergies.length) {
    return { hasConflict: false };
  }

  const drugLower = drugName.toLowerCase();

  for (const allergy of patient.allergies) {
    const allergenLower = allergy.allergen.toLowerCase();
    
    // Direct string match
    if (drugLower.includes(allergenLower) || allergenLower.includes(drugLower)) {
      return {
        hasConflict: true,
        allergen: allergy.allergen,
        severity: allergy.severity,
        reaction: allergy.reaction,
        message: `CRITICAL CONTRAINDICATION: Patient has documented ${allergy.severity} allergy to ${allergy.allergen} (${allergy.reaction}). Prescribing "${drugName}" carries high risk.`
      };
    }

    // Class cross-reactivity match
    for (const [allergyKey, mappedDrugs] of Object.entries(ALLERGY_DRUG_MAP)) {
      if (allergenLower.includes(allergyKey)) {
        if (mappedDrugs.some(d => drugLower.includes(d))) {
          return {
            hasConflict: true,
            allergen: allergy.allergen,
            severity: allergy.severity,
            reaction: allergy.reaction,
            message: `CRITICAL CONTRAINDICATION: Patient is allergic to ${allergy.allergen}. "${drugName}" belongs to or cross-reacts with the ${allergyKey.toUpperCase()} drug class.`
          };
        }
      }
    }
  }

  return { hasConflict: false };
}

function getAllMedications(filter = {}) {
  let result = [...medications];

  if (filter.patientId) {
    result = result.filter(m => m.patientId === filter.patientId);
  }

  if (filter.status) {
    result = result.filter(m => m.status.toLowerCase() === filter.status.toLowerCase());
  }

  return result;
}

function getMedicationById(id) {
  return medications.find(m => m.id === id);
}

function prescribeMedication(data) {
  const patient = getPatientById(data.patientId);
  const allergyCheck = checkAllergyContraindication(patient, data.drugName);

  if (allergyCheck.hasConflict && !data.overrideAllergyWarning) {
    const error = new Error(allergyCheck.message);
    error.name = "AllergyContraindicationError";
    error.allergyDetails = allergyCheck;
    throw error;
  }

  const newId = `MED-${Math.floor(300 + Math.random() * 500)}`;

  const newMed = {
    id: newId,
    patientId: data.patientId,
    encounterId: data.encounterId || null,
    rxNormCode: data.rxNormCode || "999999",
    drugName: data.drugName,
    dosage: data.dosage,
    form: data.form || "Oral Tablet",
    route: data.route || "Oral",
    frequency: data.frequency || "Once daily",
    duration: data.duration || "30 days",
    refills: typeof data.refills === "number" ? data.refills : 1,
    prescribedBy: data.prescribedBy || "Dr. Attending Physician, MD",
    prescribedDate: new Date().toISOString().split("T")[0],
    status: "Active",
    pharmacyStatus: "Sent to Pharmacy - NCPDP Electronic Transfer",
    overrideReason: data.overrideReason || null,
    notes: data.notes || ""
  };

  medications.unshift(newMed);
  return { medication: newMed, allergyWarningOverridden: !!data.overrideAllergyWarning };
}

function discontinueMedication(id, reason) {
  const med = medications.find(m => m.id === id);
  if (!med) return null;

  med.status = "Discontinued";
  med.discontinuedDate = new Date().toISOString().split("T")[0];
  med.discontinuedReason = reason || "Completed therapy or provider instructed discontinuation";

  return med;
}

function resetMedications() {
  medications = JSON.parse(JSON.stringify(initialMedications));
}

module.exports = {
  getAllMedications,
  getMedicationById,
  checkAllergyContraindication,
  prescribeMedication,
  discontinueMedication,
  resetMedications
};
