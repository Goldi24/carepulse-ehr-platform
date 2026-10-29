// HL7 v2.5.1 Message Generator & Parser Service
// Supports standard MSH, PID, PV1, OBR, OBX, RXE segments

function formatHL7Date(date = new Date()) {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function generateAdtA01(patient, encounter) {
  const now = formatHL7Date();
  const dob = patient.dob ? patient.dob.replace(/-/g, '') : "19900101";
  const msgControlId = `MSG${Date.now()}`;

  const msh = `MSH|^~\\&|EHRS01|HOSPITAL_MAIN|EMR_SYSTEM|REGIONAL_HOSPITAL|${now}||ADT^A01^ADT_A01|${msgControlId}|P|2.5.1|||AL|NE`;
  const evn = `EVN|A01|${now}|||CLINICIAN01`;
  const pid = `PID|1||${patient.mrn}^^^EHRS01^MR||${patient.lastName}^${patient.firstName}||${dob}|${patient.gender ? patient.gender.charAt(0) : 'U'}|||${patient.address?.street || ''}^^${patient.address?.city || ''}^${patient.address?.state || ''}^${patient.address?.zip || ''}||${patient.phone || ''}|||S||${patient.id}`;
  const pv1 = `PV1|1|O|AMB^CLINIC-1^EXAM1||||DR-ADAMS^Adams^Rachel^^^^MD|||GEN|||||||${encounter?.provider || 'DR-ADAMS'}||${encounter?.id || 'ENC-TEMP'}|||||||||||||||||||||||||${now}`;

  return [msh, evn, pid, pv1].join('\r\n');
}

function generateAdtA08(patient) {
  const now = formatHL7Date();
  const dob = patient.dob ? patient.dob.replace(/-/g, '') : "19900101";
  const msgControlId = `MSG${Date.now()}`;

  const msh = `MSH|^~\\&|EHRS01|HOSPITAL_MAIN|EMR_SYSTEM|REGIONAL_HOSPITAL|${now}||ADT^A08^ADT_A08|${msgControlId}|P|2.5.1|||AL|NE`;
  const evn = `EVN|A08|${now}`;
  const pid = `PID|1||${patient.mrn}^^^EHRS01^MR||${patient.lastName}^${patient.firstName}||${dob}|${patient.gender ? patient.gender.charAt(0) : 'U'}|||${patient.address?.street || ''}^^${patient.address?.city || ''}^${patient.address?.state || ''}^${patient.address?.zip || ''}||${patient.phone || ''}`;

  return [msh, evn, pid].join('\r\n');
}

function generateOruR01(patient, order) {
  const now = formatHL7Date();
  const msgControlId = `MSG${Date.now()}`;

  const msh = `MSH|^~\\&|LIS_LAB|HOSPITAL_CORE|EHRS01|EMR_GATEWAY|${now}||ORU^R01^ORU_R01|${msgControlId}|P|2.5.1`;
  const pid = `PID|1||${patient.mrn}^^^EHRS01^MR||${patient.lastName}^${patient.firstName}`;
  const obr = `OBR|1|${order.id}|${order.id}^LIS|${order.loincCode}^${order.testName}^LN|||${formatHL7Date(order.orderDate)}|||||||||${order.orderedBy}||||||${now}|||F`;

  const obxSegments = (order.results || []).map((res, idx) => {
    return `OBX|${idx + 1}|NM|${res.test}^${res.test}^LN||${res.value}|${res.unit}|${res.referenceRange}|${res.flag === 'Normal' ? 'N' : 'H'}|||F|||${now}`;
  });

  return [msh, pid, obr, ...obxSegments].join('\r\n');
}

function generateRdeO11(patient, medication) {
  const now = formatHL7Date();
  const msgControlId = `MSG${Date.now()}`;

  const msh = `MSH|^~\\&|EHRS01|CPOE_ENGINE|PHARMACY_GATEWAY|SURESCRIPTS|${now}||RDE^O11^RDE_O11|${msgControlId}|P|2.5.1`;
  const pid = `PID|1||${patient.mrn}^^^EHRS01^MR||${patient.lastName}^${patient.firstName}`;
  const orc = `ORC|NW|${medication.id}|${medication.id}^PHARM||||1^${medication.frequency}^^^^||${now}|${medication.prescribedBy}`;
  const rxe = `RXE|1^${medication.frequency}|${medication.rxNormCode}^${medication.drugName}^RXNORM|${medication.dosage}|||${medication.route}||||${medication.refills}`;

  return [msh, pid, orc, rxe].join('\r\n');
}

function parseHL7(hl7String) {
  if (!hl7String || typeof hl7String !== 'string') {
    throw new Error("Invalid HL7 string provided.");
  }

  const lines = hl7String.trim().split(/\r?\n/);
  const parsed = {
    messageType: "",
    controlId: "",
    segments: [],
    details: {}
  };

  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split('|');
    const segName = fields[0];

    parsed.segments.push({ segment: segName, fields });

    if (segName === 'MSH') {
      parsed.messageType = fields[8] || "";
      parsed.controlId = fields[9] || "";
      parsed.details.sendingApp = fields[2] || "";
      parsed.details.receivingApp = fields[4] || "";
    } else if (segName === 'PID') {
      parsed.details.patientMrn = fields[3] ? fields[3].split('^')[0] : "";
      const names = (fields[5] || "").split('^');
      parsed.details.patientLastName = names[0] || "";
      parsed.details.patientFirstName = names[1] || "";
      parsed.details.dob = fields[7] || "";
      parsed.details.gender = fields[8] || "";
    } else if (segName === 'OBR') {
      const orderTest = (fields[4] || "").split('^');
      parsed.details.orderId = fields[2] || "";
      parsed.details.testCode = orderTest[0] || "";
      parsed.details.testName = orderTest[1] || "";
    } else if (segName === 'RXE') {
      const drug = (fields[2] || "").split('^');
      parsed.details.rxNormCode = drug[0] || "";
      parsed.details.drugName = drug[1] || "";
      parsed.details.dosage = fields[3] || "";
    }
  }

  return parsed;
}

module.exports = {
  formatHL7Date,
  generateAdtA01,
  generateAdtA08,
  generateOruR01,
  generateRdeO11,
  parseHL7
};
