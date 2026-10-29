const { initialPatients } = require('../data/initialData');

let patients = JSON.parse(JSON.stringify(initialPatients));

function getAllPatients(query = {}) {
  let result = [...patients];

  if (query.search) {
    const s = query.search.toLowerCase();
    result = result.filter(p =>
      p.firstName.toLowerCase().includes(s) ||
      p.lastName.toLowerCase().includes(s) ||
      p.mrn.toLowerCase().includes(s) ||
      p.email.toLowerCase().includes(s)
    );
  }

  if (query.status) {
    result = result.filter(p => p.status.toLowerCase() === query.status.toLowerCase());
  }

  return result;
}

function getPatientById(id) {
  return patients.find(p => p.id === id || p.mrn === id);
}

function createPatient(data) {
  const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newMrn = `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPatient = {
    id: newId,
    mrn: data.mrn || newMrn,
    firstName: data.firstName || "Unnamed",
    lastName: data.lastName || "Patient",
    gender: data.gender || "Other",
    dob: data.dob || "1990-01-01",
    phone: data.phone || "",
    email: data.email || "",
    address: data.address || { street: "", city: "", state: "", zip: "" },
    emergencyContact: data.emergencyContact || { name: "", relation: "", phone: "" },
    insurance: data.insurance || {
      provider: "Self-Pay",
      policyNumber: "N/A",
      groupNumber: "N/A",
      coverageType: "None",
      status: "Inactive",
      expirationDate: ""
    },
    bloodGroup: data.bloodGroup || "Unknown",
    allergies: data.allergies || [],
    chronicConditions: data.chronicConditions || [],
    surgicalHistory: data.surgicalHistory || [],
    status: data.status || "Active",
    createdAt: new Date().toISOString()
  };

  patients.unshift(newPatient);
  return newPatient;
}

function updatePatient(id, updateData) {
  const index = patients.findIndex(p => p.id === id || p.mrn === id);
  if (index === -1) return null;

  patients[index] = {
    ...patients[index],
    ...updateData,
    id: patients[index].id, // protect ID
    mrn: patients[index].mrn, // protect MRN
    updatedAt: new Date().toISOString()
  };

  return patients[index];
}

function deletePatient(id) {
  const index = patients.findIndex(p => p.id === id);
  if (index === -1) return false;
  patients.splice(index, 1);
  return true;
}

function resetPatients() {
  patients = JSON.parse(JSON.stringify(initialPatients));
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  resetPatients
};
