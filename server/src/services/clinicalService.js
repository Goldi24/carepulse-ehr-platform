const { initialEncounters } = require('../data/initialData');

let encounters = JSON.parse(JSON.stringify(initialEncounters));

function getAllEncounters(patientId = null) {
  if (patientId) {
    return encounters.filter(e => e.patientId === patientId);
  }
  return encounters;
}

function getEncounterById(id) {
  return encounters.find(e => e.id === id);
}

function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

function createEncounter(data) {
  const newId = `ENC-${Math.floor(500 + Math.random() * 500)}`;

  let bmi = data.vitals?.bmi;
  if (!bmi && data.vitals?.weightKg && data.vitals?.heightCm) {
    bmi = calculateBMI(data.vitals.weightKg, data.vitals.heightCm);
  }

  const newEncounter = {
    id: newId,
    patientId: data.patientId,
    date: data.date || new Date().toISOString(),
    provider: data.provider || "Dr. Staff Clinician, MD",
    department: data.department || "General Medicine",
    type: data.type || "Office Visit",
    reasonForVisit: data.reasonForVisit || "Routine Examination",
    vitals: {
      heartRate: data.vitals?.heartRate || 72,
      systolicBP: data.vitals?.systolicBP || 120,
      diastolicBP: data.vitals?.diastolicBP || 80,
      respiratoryRate: data.vitals?.respiratoryRate || 16,
      temperatureC: data.vitals?.temperatureC || 37.0,
      temperatureF: data.vitals?.temperatureF || 98.6,
      oxygenSaturation: data.vitals?.oxygenSaturation || 98,
      weightKg: data.vitals?.weightKg || 70,
      heightCm: data.vitals?.heightCm || 170,
      bmi: bmi || 24.2
    },
    soapNote: {
      subjective: data.soapNote?.subjective || "Patient states no acute complaints.",
      objective: data.soapNote?.objective || "Alert, pleasant, no distress noted.",
      assessment: data.soapNote?.assessment || "Normal baseline clinical review.",
      plan: data.soapNote?.plan || "Continue current regimen; return PRN."
    },
    status: data.status || "Signed"
  };

  encounters.unshift(newEncounter);
  return newEncounter;
}

function updateEncounter(id, updateData) {
  const index = encounters.findIndex(e => e.id === id);
  if (index === -1) return null;

  encounters[index] = {
    ...encounters[index],
    ...updateData,
    id: encounters[index].id,
    patientId: encounters[index].patientId
  };

  return encounters[index];
}

function resetEncounters() {
  encounters = JSON.parse(JSON.stringify(initialEncounters));
}

module.exports = {
  getAllEncounters,
  getEncounterById,
  createEncounter,
  updateEncounter,
  calculateBMI,
  resetEncounters
};
