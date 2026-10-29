const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 EHRS01 - Electronic Health Record System API Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📋 FHIR R4 Base Endpoint: http://localhost:${PORT}/api/fhir`);
  console.log(`🔄 HL7 v2.5.1 Gateway: http://localhost:${PORT}/api/hl7`);
  console.log(`📊 Agile Metrics Endpoint: http://localhost:${PORT}/api/metrics`);
  console.log(`=======================================================`);
});
