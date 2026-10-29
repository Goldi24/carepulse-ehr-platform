const { initialExternalSystems } = require('../data/initialData');

let externalSystems = JSON.parse(JSON.stringify(initialExternalSystems));
let syncLogs = [
  { id: "LOG-1", timestamp: "2026-10-23T11:25:00.000Z", system: "SYS-LIS", event: "Automated HL7 ORU^R01 result synchronization (32 orders processed)", status: "Success" },
  { id: "LOG-2", timestamp: "2026-10-23T11:20:00.000Z", system: "SYS-EMR", event: "FHIR Patient & Observation incremental bundle sync", status: "Success" },
  { id: "LOG-3", timestamp: "2026-10-23T11:18:00.000Z", system: "SYS-PACS", event: "DICOM Web WADO-RS study metadata handshake", status: "Success" },
  { id: "LOG-4", timestamp: "2026-10-23T11:15:00.000Z", system: "SYS-PHARM", event: "NCPDP SCRIPT e-Rx dispatch queue emptied (14 prescriptions)", status: "Success" }
];

function getExternalSystems() {
  return externalSystems;
}

function getSyncLogs() {
  return syncLogs;
}

function triggerSystemSync(systemId) {
  const sys = externalSystems.find(s => s.id === systemId);
  if (!sys) return null;

  sys.lastSync = new Date().toISOString();
  sys.syncRecords += Math.floor(1 + Math.random() * 15);
  sys.latencyMs = Math.floor(25 + Math.random() * 45);

  const newLog = {
    id: `LOG-${Date.now()}`,
    timestamp: sys.lastSync,
    system: sys.id,
    event: `Manual test synchronization completed for ${sys.name}. ${sys.syncRecords} total transactions synced.`,
    status: "Success"
  };

  syncLogs.unshift(newLog);
  if (syncLogs.length > 50) syncLogs.pop();

  return { system: sys, log: newLog };
}

function resetIntegrations() {
  externalSystems = JSON.parse(JSON.stringify(initialExternalSystems));
}

module.exports = {
  getExternalSystems,
  getSyncLogs,
  triggerSystemSync,
  resetIntegrations
};
