// Centralized API client for EHRS01

const API_BASE = '/api';

export const api = {
  // Patients
  getPatients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/patients${query ? `?${query}` : ''}`).then(r => r.json());
  },
  getPatientById: (id) => fetch(`${API_BASE}/patients/${id}`).then(r => r.json()),
  createPatient: (data) => fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updatePatient: (id, data) => fetch(`${API_BASE}/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deletePatient: (id) => fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Clinical Encounters
  getEncounters: (patientId) => {
    const q = patientId ? `?patientId=${patientId}` : '';
    return fetch(`${API_BASE}/encounters${q}`).then(r => r.json());
  },
  createEncounter: (data) => fetch(`${API_BASE}/encounters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Orders (CPOE)
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/orders${query ? `?${query}` : ''}`).then(r => r.json());
  },
  createOrder: (data) => fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateOrderStatus: (id, status, results = null, impression = null) => fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, results, impression })
  }).then(r => r.json()),

  // Medications & E-Prescribing
  getMedications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/medications${query ? `?${query}` : ''}`).then(r => r.json());
  },
  checkContraindication: (patientId, drugName) => fetch(`${API_BASE}/medications/check-contraindication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, drugName })
  }).then(r => r.json()),
  prescribeMedication: (data) => fetch(`${API_BASE}/medications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async r => {
    const json = await r.json();
    if (!r.ok) {
      const err = new Error(json.error || 'Prescription failed');
      err.data = json;
      throw err;
    }
    return json;
  }),
  discontinueMedication: (id, reason) => fetch(`${API_BASE}/medications/${id}/discontinue`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  }).then(r => r.json()),

  // Portal (Appointments & Messages)
  getAppointments: (patientId) => {
    const q = patientId ? `?patientId=${patientId}` : '';
    return fetch(`${API_BASE}/portal/appointments${q}`).then(r => r.json());
  },
  bookAppointment: (data) => fetch(`${API_BASE}/portal/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  cancelAppointment: (id) => fetch(`${API_BASE}/portal/appointments/${id}/cancel`, {
    method: 'PATCH'
  }).then(r => r.json()),
  getMessages: (patientId) => {
    const q = patientId ? `?patientId=${patientId}` : '';
    return fetch(`${API_BASE}/portal/messages${q}`).then(r => r.json());
  },
  sendMessage: (data) => fetch(`${API_BASE}/portal/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  replyMessage: (id, sender, body) => fetch(`${API_BASE}/portal/messages/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, body })
  }).then(r => r.json()),

  // Interoperability (Integrations, HL7, FHIR)
  getIntegrations: () => fetch(`${API_BASE}/integrations/systems`).then(r => r.json()),
  getSyncLogs: () => fetch(`${API_BASE}/integrations/logs`).then(r => r.json()),
  triggerSync: (systemId) => fetch(`${API_BASE}/integrations/sync/${systemId}`, { method: 'POST' }).then(r => r.json()),
  getHl7Sample: (type) => fetch(`${API_BASE}/hl7/samples/${type}`).then(r => r.json()),
  parseHl7: (hl7Message) => fetch(`${API_BASE}/hl7/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hl7Message })
  }).then(r => r.json()),
  getFhirResource: (path) => fetch(`${API_BASE}/fhir${path}`).then(r => r.json()),

  // Agile Metrics
  getMetrics: () => fetch(`${API_BASE}/metrics`).then(r => r.json())
};
