// Initial In-Memory Clinical & Operational Dataset for EHRS01
const initialPatients = [
  {
    id: "PAT-1001",
    mrn: "MRN-2026-8941",
    firstName: "Eleanor",
    lastName: "Vance",
    gender: "Female",
    dob: "1968-04-15",
    phone: "+1 (555) 234-5678",
    email: "eleanor.vance@example.com",
    address: {
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      zip: "62704"
    },
    emergencyContact: {
      name: "Thomas Vance",
      relation: "Spouse",
      phone: "+1 (555) 234-9988"
    },
    insurance: {
      provider: "BlueCross BlueShield Healthcare",
      policyNumber: "BCBS-88392019",
      groupNumber: "GRP-4402",
      coverageType: "Comprehensive PPO",
      status: "Active",
      expirationDate: "2027-12-31"
    },
    bloodGroup: "A+",
    allergies: [
      { allergen: "Penicillin", severity: "Severe (Anaphylaxis risk)", reaction: "Hives, bronchospasm" },
      { allergen: "Sulfa Drugs", severity: "Moderate", reaction: "Skin rash, pruritus" }
    ],
    chronicConditions: [
      { code: "I10", name: "Essential (Primary) Hypertension", diagnosedDate: "2018-06-12" },
      { code: "E11.9", name: "Type 2 Diabetes Mellitus without complications", diagnosedDate: "2020-02-19" },
      { code: "E78.5", name: "Hyperlipidemia", diagnosedDate: "2019-11-04" }
    ],
    surgicalHistory: [
      { procedure: "Laparoscopic Cholecystectomy", date: "2015-09-14", notes: "Uneventful recovery" }
    ],
    status: "Active"
  },
  {
    id: "PAT-1002",
    mrn: "MRN-2026-7723",
    firstName: "James",
    lastName: "Walker",
    gender: "Male",
    dob: "1984-11-23",
    phone: "+1 (555) 876-5432",
    email: "james.walker@example.com",
    address: {
      street: "124 Baker Street",
      city: "Boston",
      state: "MA",
      zip: "02115"
    },
    emergencyContact: {
      name: "Sarah Walker",
      relation: "Sister",
      phone: "+1 (555) 876-1122"
    },
    insurance: {
      provider: "Aetna Health Plus",
      policyNumber: "AET-55910328",
      groupNumber: "GRP-9931",
      coverageType: "HMO Gold",
      status: "Active",
      expirationDate: "2027-06-30"
    },
    bloodGroup: "O+",
    allergies: [
      { allergen: "Codeine", severity: "Moderate", reaction: "Nausea, severe dizziness" }
    ],
    chronicConditions: [
      { code: "J45.909", name: "Bronchial Asthma, uncomplicated", diagnosedDate: "2010-03-15" },
      { code: "J30.9", name: "Allergic Rhinitis", diagnosedDate: "2012-07-22" }
    ],
    surgicalHistory: [],
    status: "Active"
  },
  {
    id: "PAT-1003",
    mrn: "MRN-2026-6105",
    firstName: "Maria",
    lastName: "Santos",
    gender: "Female",
    dob: "1995-08-30",
    phone: "+1 (555) 432-1098",
    email: "maria.santos@example.com",
    address: {
      street: "88 Ocean Parkway, Apt 4B",
      city: "Miami",
      state: "FL",
      zip: "33139"
    },
    emergencyContact: {
      name: "Carlos Santos",
      relation: "Father",
      phone: "+1 (555) 432-7711"
    },
    insurance: {
      provider: "UnitedHealthcare Choice",
      policyNumber: "UHC-9940214",
      groupNumber: "GRP-1029",
      coverageType: "PPO Standard",
      status: "Active",
      expirationDate: "2026-11-30"
    },
    bloodGroup: "B+",
    allergies: [],
    chronicConditions: [],
    surgicalHistory: [
      { procedure: "Appendectomy", date: "2024-04-10", notes: "Laparoscopic, clean margins" }
    ],
    status: "Active"
  },
  {
    id: "PAT-1004",
    mrn: "MRN-2026-3390",
    firstName: "David",
    lastName: "Chen",
    gender: "Male",
    dob: "1959-12-05",
    phone: "+1 (555) 654-9870",
    email: "david.chen@example.com",
    address: {
      street: "500 Pinecrest Blvd",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    emergencyContact: {
      name: "Linda Chen",
      relation: "Wife",
      phone: "+1 (555) 654-2234"
    },
    insurance: {
      provider: "Cigna Global Health",
      policyNumber: "CIG-33829104",
      groupNumber: "GRP-7740",
      coverageType: "Medicare Advantage",
      status: "Active",
      expirationDate: "2027-12-31"
    },
    bloodGroup: "AB+",
    allergies: [
      { allergen: "Aspirin", severity: "Moderate", reaction: "Gastric upset, bronchospasm" }
    ],
    chronicConditions: [
      { code: "I25.10", name: "Atherosclerotic Heart Disease of native coronary artery", diagnosedDate: "2017-09-01" },
      { code: "E11.9", name: "Type 2 Diabetes Mellitus", diagnosedDate: "2015-11-20" }
    ],
    surgicalHistory: [
      { procedure: "Coronary Stent Placement (LAD)", date: "2018-01-20", notes: "Drug-eluting stent" }
    ],
    status: "Active"
  }
];

const initialEncounters = [
  {
    id: "ENC-501",
    patientId: "PAT-1001",
    date: "2026-10-20T10:30:00.000Z",
    provider: "Dr. Rachel Adams, MD (Internal Medicine)",
    department: "Ambulatory Outpatient Clinic",
    type: "Routine Follow-up",
    reasonForVisit: "Hypertension follow-up and quarterly HbA1c review",
    vitals: {
      heartRate: 74,
      systolicBP: 138,
      diastolicBP: 86,
      respiratoryRate: 16,
      temperatureC: 36.8,
      temperatureF: 98.2,
      oxygenSaturation: 98,
      weightKg: 78.5,
      heightCm: 165,
      bmi: 28.8
    },
    soapNote: {
      subjective: "Patient reports overall compliance with Lisinopril and Metformin. Occasional morning headaches over the past 2 weeks. Denies chest pain, shortness of breath, palpitations, or lower extremity edema. Fasting blood sugars reported around 125-140 mg/dL.",
      objective: "Alert and oriented x3. Cardiac: Regular rate and rhythm, normal S1/S2, no murmurs. Lungs: Clear to auscultation bilaterally. Abdomen: Soft, non-tender, non-distended. Extremities: No peripheral edema. BP 138/86 mmHg in right arm seated.",
      assessment: "1. Essential Hypertension (I10) - borderline controlled on Lisinopril 20mg daily.\n2. Type 2 Diabetes Mellitus (E11.9) - glycemic control stable, pending current HbA1c.\n3. Hyperlipidemia (E78.5) - compliant on statin therapy.",
      plan: "1. Increase Lisinopril to 30mg daily to optimize systolic BP (<130 mmHg).\n2. Order Comprehensive Metabolic Panel (CMP) and HbA1c.\n3. Continue Metformin 500mg BID.\n4. Re-check BP log in 4 weeks; follow-up clinic visit in 3 months."
    },
    status: "Signed"
  },
  {
    id: "ENC-502",
    patientId: "PAT-1002",
    date: "2026-10-18T14:15:00.000Z",
    provider: "Dr. Marcus Vance, MD (Pulmonology)",
    department: "Specialty Care Center",
    type: "Asthma Flare Evaluation",
    reasonForVisit: "Worsening shortness of breath and wheezing during cold mornings",
    vitals: {
      heartRate: 88,
      systolicBP: 122,
      diastolicBP: 78,
      respiratoryRate: 20,
      temperatureC: 37.0,
      temperatureF: 98.6,
      oxygenSaturation: 96,
      weightKg: 82.0,
      heightCm: 180,
      bmi: 25.3
    },
    soapNote: {
      subjective: "Patient experiences increased coughing at night and mild inspiratory wheeze triggered by seasonal temperature drop. Has been using Albuterol rescue inhaler 3-4 times per week. Denies fever, chills, or productive sputum.",
      objective: "Mild expiratory wheeze in bilateral lung bases. Good air movement. Peak expiratory flow rate (PEFR) 420 L/min (baseline 500 L/min). Heart sounds normal.",
      assessment: "1. Bronchial Asthma with acute exacerbation (J45.901).\n2. Allergic Rhinitis (J30.9).",
      plan: "1. Initiate Fluticasone/Salmeterol 100/50 mcg DPI 1 puff BID.\n2. Continue Albuterol HFA PRN for acute rescue.\n3. Asthma action plan reviewed with patient.\n4. Chest X-Ray ordered to rule out pulmonary infiltration."
    },
    status: "Signed"
  }
];

const initialOrders = [
  {
    id: "ORD-801",
    patientId: "PAT-1001",
    encounterId: "ENC-501",
    type: "Laboratory",
    category: "LIS",
    testName: "Hemoglobin A1c & Glycemic Panel",
    loincCode: "4548-4",
    priority: "Routine",
    orderedBy: "Dr. Rachel Adams, MD",
    orderDate: "2026-10-20T10:45:00.000Z",
    status: "Completed",
    results: [
      { test: "Hemoglobin A1c", value: "6.9", unit: "%", referenceRange: "< 5.7 (Normal), 5.7-6.4 (Prediabetes), >= 6.5 (Diabetes)", flag: "High", status: "Final" },
      { test: "Estimated Average Glucose (eAG)", value: "151", unit: "mg/dL", referenceRange: "70-126", flag: "High", status: "Final" }
    ],
    reportedAt: "2026-10-21T08:30:00.000Z",
    clinicalNotes: "Glycemic control is moderately improved from previous 7.4% baseline. Reinforce lifestyle interventions."
  },
  {
    id: "ORD-802",
    patientId: "PAT-1001",
    encounterId: "ENC-501",
    type: "Laboratory",
    category: "LIS",
    testName: "Comprehensive Metabolic Panel (CMP-14)",
    loincCode: "24323-8",
    priority: "Routine",
    orderedBy: "Dr. Rachel Adams, MD",
    orderDate: "2026-10-20T10:45:00.000Z",
    status: "Completed",
    results: [
      { test: "Serum Creatinine", value: "0.92", unit: "mg/dL", referenceRange: "0.60 - 1.20", flag: "Normal", status: "Final" },
      { test: "eGFR", value: "> 60", unit: "mL/min/1.73m2", referenceRange: ">= 60", flag: "Normal", status: "Final" },
      { test: "Serum Potassium", value: "4.4", unit: "mmol/L", referenceRange: "3.5 - 5.0", flag: "Normal", status: "Final" },
      { test: "Serum Sodium", value: "140", unit: "mmol/L", referenceRange: "135 - 145", flag: "Normal", status: "Final" },
      { test: "Fasting Blood Glucose", value: "128", unit: "mg/dL", referenceRange: "70 - 99", flag: "High", status: "Final" }
    ],
    reportedAt: "2026-10-21T09:00:00.000Z",
    clinicalNotes: "Normal renal function and electrolyte stability on ACE inhibitor therapy."
  },
  {
    id: "ORD-803",
    patientId: "PAT-1002",
    encounterId: "ENC-502",
    type: "Imaging",
    category: "PACS",
    testName: "Chest X-Ray 2 Views (PA and Lateral)",
    loincCode: "36554-4",
    priority: "Urgent",
    orderedBy: "Dr. Marcus Vance, MD",
    orderDate: "2026-10-18T14:30:00.000Z",
    status: "Completed",
    results: [
      {
        test: "Chest Radiography PA/LAT",
        value: "Hyperinflated lung fields consistent with reactive airway disease",
        unit: "",
        referenceRange: "Clear lung fields, normal cardiothoracic ratio",
        flag: "Abnormal",
        status: "Final"
      }
    ],
    pacsViewerUrl: "/imaging/viewer?studyId=STU-99201&patient=PAT-1002",
    radiologistImpression: "Lungs demonstrate hyperinflation compatible with asthma exacerbation. No focal consolidations, pneumothorax, or pleural effusion seen. Heart size within normal limits.",
    reportedAt: "2026-10-18T16:15:00.000Z"
  },
  {
    id: "ORD-804",
    patientId: "PAT-1004",
    encounterId: "ENC-503",
    type: "Imaging",
    category: "PACS",
    testName: "Echocardiogram Transthoracic (TTE)",
    loincCode: "18053-9",
    priority: "Routine",
    orderedBy: "Dr. Sarah Jenkins, MD (Cardiology)",
    orderDate: "2026-10-22T09:15:00.000Z",
    status: "In-Progress",
    results: [],
    pacsViewerUrl: null,
    radiologistImpression: null,
    reportedAt: null
  }
];

const initialMedications = [
  {
    id: "MED-301",
    patientId: "PAT-1001",
    encounterId: "ENC-501",
    rxNormCode: "314076",
    drugName: "Lisinopril",
    dosage: "30 mg",
    form: "Oral Tablet",
    route: "Oral",
    frequency: "Once Daily in the morning",
    duration: "90 days",
    refills: 3,
    prescribedBy: "Dr. Rachel Adams, MD",
    prescribedDate: "2026-10-20",
    status: "Active",
    pharmacyStatus: "Dispensed - Walgreens #4021",
    notes: "Increased from 20mg to improve blood pressure target."
  },
  {
    id: "MED-302",
    patientId: "PAT-1001",
    encounterId: "ENC-501",
    rxNormCode: "860975",
    drugName: "Metformin Hydrochloride",
    dosage: "500 mg",
    form: "Oral Tablet",
    route: "Oral",
    frequency: "Twice daily with meals",
    duration: "90 days",
    refills: 3,
    prescribedBy: "Dr. Rachel Adams, MD",
    prescribedDate: "2026-08-15",
    status: "Active",
    pharmacyStatus: "Active",
    notes: "Take with food to minimize GI discomfort."
  },
  {
    id: "MED-303",
    patientId: "PAT-1001",
    encounterId: "ENC-501",
    rxNormCode: "617314",
    drugName: "Atorvastatin Calcium",
    dosage: "20 mg",
    form: "Oral Tablet",
    route: "Oral",
    frequency: "Once daily at bedtime",
    duration: "90 days",
    refills: 2,
    prescribedBy: "Dr. Rachel Adams, MD",
    prescribedDate: "2026-05-10",
    status: "Active",
    pharmacyStatus: "Active",
    notes: "Lipid lowering therapy."
  },
  {
    id: "MED-304",
    patientId: "PAT-1002",
    encounterId: "ENC-502",
    rxNormCode: "746827",
    drugName: "Albuterol Sulfate HFA",
    dosage: "90 mcg/actuation",
    form: "Inhalation Aerosol",
    route: "Inhalation",
    frequency: "1-2 puffs every 4-6 hours PRN wheezing",
    duration: "30 days",
    refills: 5,
    prescribedBy: "Dr. Marcus Vance, MD",
    prescribedDate: "2026-10-18",
    status: "Active",
    pharmacyStatus: "Ready for Pickup - CVS Pharmacy #1890",
    notes: "Rescue inhaler for acute shortness of breath."
  },
  {
    id: "MED-305",
    patientId: "PAT-1002",
    encounterId: "ENC-502",
    rxNormCode: "896209",
    drugName: "Fluticasone Propionate / Salmeterol",
    dosage: "100/50 mcg",
    form: "Diskus Powder Inhaler",
    route: "Inhalation",
    frequency: "1 puff twice daily (morning and evening)",
    duration: "30 days",
    refills: 3,
    prescribedBy: "Dr. Marcus Vance, MD",
    prescribedDate: "2026-10-18",
    status: "Active",
    pharmacyStatus: "Sent to Pharmacy",
    notes: "Maintenance controller therapy. Rinse mouth after use."
  }
];

const initialAppointments = [
  {
    id: "APT-201",
    patientId: "PAT-1001",
    providerName: "Dr. Rachel Adams, MD",
    department: "Internal Medicine",
    dateTime: "2026-11-20T10:00:00.000Z",
    type: "In-Person",
    reason: "Hypertension 4-week BP check and medication review",
    status: "Scheduled"
  },
  {
    id: "APT-202",
    patientId: "PAT-1002",
    providerName: "Dr. Marcus Vance, MD",
    department: "Pulmonology",
    dateTime: "2026-11-05T14:30:00.000Z",
    type: "Telehealth",
    reason: "Asthma controller follow-up and spirometry review",
    status: "Confirmed"
  },
  {
    id: "APT-203",
    patientId: "PAT-1003",
    providerName: "Dr. Sophia Rivera, MD",
    department: "General Surgery",
    dateTime: "2026-10-28T09:30:00.000Z",
    type: "In-Person",
    reason: "Post-op appendectomy 6-month check",
    status: "Scheduled"
  }
];

const initialMessages = [
  {
    id: "MSG-101",
    patientId: "PAT-1001",
    sender: "Eleanor Vance (Patient)",
    recipient: "Dr. Rachel Adams, MD",
    subject: "Question about Lisinopril dosage increase",
    body: "Hello Dr. Adams, I picked up the new 30mg Lisinopril prescription today. Should I finish the leftover 20mg pills first or start the 30mg tomorrow morning?",
    timestamp: "2026-10-21T14:20:00.000Z",
    isRead: true,
    replies: [
      {
        id: "REP-101-1",
        sender: "Dr. Rachel Adams, MD",
        body: "Hello Eleanor. Please begin taking the new 30mg dose starting tomorrow morning and safely discard the old 20mg pills to avoid any dosage mix-up. Please log your blood pressure readings daily.",
        timestamp: "2026-10-21T15:45:00.000Z"
      }
    ]
  },
  {
    id: "MSG-102",
    patientId: "PAT-1002",
    sender: "James Walker (Patient)",
    recipient: "Dr. Marcus Vance, MD",
    subject: "Using the Diskus inhaler before morning jog",
    body: "Hi Dr. Vance, I've started the new controller inhaler. Is it okay to take my morning puff before my morning jog or should I still use the Albuterol rescue inhaler beforehand?",
    timestamp: "2026-10-22T08:10:00.000Z",
    isRead: false,
    replies: []
  }
];

const initialAgileMetrics = {
  projectSummary: {
    code: "EHRS01",
    name: "Electronic Health Record System",
    domain: "Healthcare and Pharma",
    type: "New Product Development",
    currentSprint: 14,
    totalSprints: 20,
    timeBoundDays: 20,
    startDate: "2026-10-01",
    targetReleaseDate: "2026-11-20",
    overallCompletion: 76
  },
  strategicMetrics: [
    { name: "Business Value Delivered", target: 100, current: 84, unit: "%", description: "Cumulative clinical value: automated CPOE, real-time e-Rx allergy checking, unified patient records." },
    { name: "Customer & Clinician Satisfaction (CSAT)", target: 90, current: 92.4, unit: "%", description: "Physician & nurse usability evaluation across 4 hospital clinics." },
    { name: "Time to First Viable Increment", target: 10, current: 8, unit: "days", description: "Sprint 3 delivery of core patient demographic and encounter logging." }
  ],
  tacticalMetrics: [
    { name: "Release Burn-up", target: 450, current: 362, unit: "Story Points", description: "Story points delivered towards the multi-clinic release scope." },
    { name: "Defect Leakage", target: "< 5%", current: 2.1, unit: "%", description: "Percentage of QA-passed stories where defects were found in Staging/UAT." },
    { name: "Cycle Time", target: "< 3.5 days", current: 2.8, unit: "days", description: "Average duration from user story 'In-Progress' to 'Done'." },
    { name: "Escaped Defect Cost", target: "< $5,000", current: "$1,250", unit: "USD", description: "Estimated remediation cost of non-blocking UAT findings." }
  ],
  operationalMetrics: [
    { name: "Team Velocity", target: 35, current: 38.5, unit: "pts/sprint", description: "Average completed story points across the 24-engineer combined team." },
    { name: "Defect Density", target: "< 1.5", current: 0.62, unit: "defects/KLOC", description: "Defect rate across back-end microservices and front-end modules." },
    { name: "Code Coverage", target: ">= 85%", current: 91.2, unit: "%", description: "Automated unit and integration test coverage across the repository." },
    { name: "Lead Time to Production", target: "< 24 hrs", current: 8.5, unit: "hours", description: "From git branch merge to automated staging deployment." },
    { name: "Deployment Frequency", target: "Daily / on-demand", current: 4.2, unit: "deploys/week", description: "CI/CD automated release pipeline trigger frequency." },
    { name: "Automated Test Pass Rate", target: ">= 98%", current: 99.4, unit: "%", description: "Pass rate for 312 CI test cases spanning HL7, FHIR, and REST APIs." },
    { name: "Work In Progress (WIP)", target: "<= 8 stories", current: 5, unit: "stories", description: "Current active user stories across offshore and onsite teams." }
  ],
  epicsProgress: [
    { epic: "Patient Management", plannedSprints: 3, status: "Completed", completion: 100, storiesCompleted: 24, totalStories: 24 },
    { epic: "Clinical Documentation", plannedSprints: 4, status: "Completed", completion: 100, storiesCompleted: 32, totalStories: 32 },
    { epic: "Order Management (CPOE)", plannedSprints: 3, status: "In-Progress", completion: 85, storiesCompleted: 22, totalStories: 26 },
    { epic: "Medication Management (e-Rx)", plannedSprints: 3, status: "In-Progress", completion: 80, storiesCompleted: 20, totalStories: 25 },
    { epic: "System Integration (HL7/FHIR)", plannedSprints: 4, status: "In-Progress", completion: 70, storiesCompleted: 21, totalStories: 30 },
    { epic: "Patient Portal", plannedSprints: 3, status: "In-Progress", completion: 65, storiesCompleted: 15, totalStories: 23 }
  ],
  sprintVelocityHistory: [
    { sprint: "Sprint 1", commitment: 30, completed: 28 },
    { sprint: "Sprint 2", commitment: 32, completed: 31 },
    { sprint: "Sprint 3", commitment: 35, completed: 34 },
    { sprint: "Sprint 4", commitment: 35, completed: 36 },
    { sprint: "Sprint 5", commitment: 38, completed: 37 },
    { sprint: "Sprint 6", commitment: 38, completed: 39 },
    { sprint: "Sprint 7", commitment: 40, completed: 39 },
    { sprint: "Sprint 8", commitment: 40, completed: 41 },
    { sprint: "Sprint 9", commitment: 40, completed: 38 },
    { sprint: "Sprint 10", commitment: 40, completed: 42 },
    { sprint: "Sprint 11", commitment: 42, completed: 41 },
    { sprint: "Sprint 12", commitment: 42, completed: 43 },
    { sprint: "Sprint 13", commitment: 42, completed: 40 },
    { sprint: "Sprint 14 (Current)", commitment: 42, completed: 32 }
  ],
  teamStructure: [
    { role: "Product Owner", count: 1, location: "Onsite", tools: "Jira, Confluence", focus: "Backlog grooming, stakeholder management, acceptance criteria" },
    { role: "Project Manager", count: 1, location: "Onsite", tools: "Jira, MS Project", focus: "Project planning, risk management, progress tracking" },
    { role: "Scrum Master", count: 2, location: "1 Onsite, 1 Offshore", tools: "Jira, Confluence", focus: "Sprint planning, daily stand-ups, retrospectives" },
    { role: "Technical Lead", count: 2, location: "1 Onsite, 1 Offshore", tools: "VS Code, SonarQube", focus: "Technical design, code reviews, architectural governance" },
    { role: "Front-end Developers", count: 6, location: "2 Onsite, 4 Offshore", tools: "React, Tailwind, Jest", focus: "UI components, patient chart, portal, CPOE interfaces" },
    { role: "Back-end Developers", count: 8, location: "2 Onsite, 6 Offshore", tools: "Node.js, Express, FHIR, HL7", focus: "REST APIs, FHIR R4 resources, CPOE workflows, DB schemas" },
    { role: "DevOps Engineers", count: 3, location: "1 Onsite, 2 Offshore", tools: "AWS, CI/CD, Terraform", focus: "Pipeline configuration, staging/prod environments" },
    { role: "QA Lead & Engineers", count: 7, location: "2 Onsite, 5 Offshore", tools: "Selenium, Postman, Jest", focus: "Test strategies, integration verification, clinical UAT" },
    { role: "Business Analysts", count: 2, location: "Onsite", tools: "Confluence, Jira", focus: "Requirements elicitation, clinical workflow validation" }
  ]
};

const initialExternalSystems = [
  {
    id: "SYS-EMR",
    name: "Enterprise Master Patient Index & Legacy EMR",
    protocol: "HL7 FHIR R4 REST API",
    endpoint: "https://emr-gateway.health-org.internal/fhir",
    status: "Online",
    latencyMs: 38,
    lastSync: "2026-10-23T11:20:00.000Z",
    syncRecords: 1420
  },
  {
    id: "SYS-PACS",
    name: "Picture Archiving & Communication System (PACS)",
    protocol: "DICOM Web / WADO-RS & HL7 ORM",
    endpoint: "https://pacs-archive.hospital.internal/dicom-web",
    status: "Online",
    latencyMs: 65,
    lastSync: "2026-10-23T11:18:00.000Z",
    syncRecords: 890
  },
  {
    id: "SYS-LIS",
    name: "Laboratory Information System (LIS)",
    protocol: "HL7 v2.5.1 MLLP & FHIR DiagnosticReport",
    endpoint: "mllp://lis-interface.hospital.internal:2575",
    status: "Online",
    latencyMs: 42,
    lastSync: "2026-10-23T11:25:00.000Z",
    syncRecords: 3240
  },
  {
    id: "SYS-PHARM",
    name: "Pharmacy Dispensing Network (Surescripts Gateway)",
    protocol: "NCPDP SCRIPT Standard / FHIR MedicationRequest",
    endpoint: "https://pharmacy-hub.surescripts.internal/api/v2",
    status: "Online",
    latencyMs: 78,
    lastSync: "2026-10-23T11:15:00.000Z",
    syncRecords: 2150
  }
];

module.exports = {
  initialPatients,
  initialEncounters,
  initialOrders,
  initialMedications,
  initialAppointments,
  initialMessages,
  initialAgileMetrics,
  initialExternalSystems
};
