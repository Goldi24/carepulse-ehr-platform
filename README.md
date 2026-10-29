# 🏥 CarePulse EHR — Electronic Health Record & Clinical Interoperability Platform

> **Domain:** Healthcare & Pharmaceuticals | **Standards:** HL7 v2.5.1 & HL7 FHIR Release 4 (R4)  
> **Repository Owner:** [Goldi24](https://github.com/Goldi24)  
> **Architecture:** Full-Stack Modern Web Application (React 19 + Vite 8 + Tailwind CSS v4 + Express Node.js API)

---

## 🌟 Executive Overview

**CarePulse EHR** is an enterprise-grade, web-based Electronic Health Record System designed to unify fragmented healthcare workflows across hospital networks, outpatient ambulatory centers, and specialized clinics. 

It modernizes legacy clinical documentation by replacing fragmented paper charting with structured **4-Quadrant SOAP clinical encounters**, biometric vitals tracking with dynamic BMI calculations, **Computerized Provider Order Entry (CPOE)** mapped to LOINC standard codes, **e-Prescribing** featuring real-time **Clinical Decision Support (CDS)** allergy cross-checks, and a high-fidelity **PACS DICOM Web Viewer**. 

Furthermore, CarePulse EHR functions as a high-performance healthcare integration gateway supporting bidirectional **HL7 v2.5.1 messaging (ADT, ORU, RDE)** and modern **HL7 FHIR Release 4 (R4) RESTful APIs**.

---

## 🚀 Key Modules & Clinical Epics

### 1. 📇 Epic 1: Patient Management & Master Patient Index (MPI)
- **Master Patient Index (MPI):** Comprehensive demographic registration, MRN generation, insurance coverage verification, and contact management.
- **Patient 360° Profile:** Chronological view of active chronic conditions, surgical histories, documented allergies with severity flags, and past consultations.
- **Dynamic Quick Filters:** Filter by active status, documented allergy risks, and chronic care cohorts (e.g. Hypertension, T2DM).

### 2. 🩺 Epic 2: Clinical Encounters & 4-Quadrant SOAP Documentation
- **Physician Consultations:** Document outpatient, urgent, and telehealth encounters with attending provider attribution.
- **Biometric Vitals Grid:** Real-time capture of Blood Pressure ($mmHg$), Heart Rate ($bpm$), $SpO_2$ (Pulse Oximetry), Body Temperature (°F), and Respiratory Rate.
- **Dynamic BMI Computation:** Automatic calculation of Body Mass Index with categorical clinical status indicators.
- **Structured 4-Quadrant SOAP Notes:**
  - **S (Subjective):** Patient chief complaint and History of Present Illness (HPI).
  - **O (Objective):** Physical exam observations and vital sign readings.
  - **A (Assessment):** Primary clinical diagnosis with ICD-10 diagnostic coding.
  - **P (Plan):** Diagnostic orders, pharmacological prescriptions, and clinical follow-up directives.

### 3. 🧪 Epic 3: Computerized Provider Order Entry (CPOE) & Diagnostics
- **Diagnostic Orders Placement:** Standardized ordering catalog for Clinical Pathology / LIS tests (CBC, CMP-14, HbA1c, Lipid Panel, Urinalysis) and Radiology / PACS studies (Chest X-Ray, CT Brain, MRI Spine, Echo).
- **LOINC Standardization:** Automated association of universal LOINC codes for every order.
- **Priority Triage:** Order prioritization including **Routine**, **Urgent**, and **STAT (Emergency)** with visual status steppers.
- **Simulated PACS DICOM Web Viewer:** High-fidelity radiograph viewer featuring viewport HUD metadata, zoom in/out, contrast window inversion, and radiologist impressions.

### 4. 💊 Epic 4: E-Prescribing (e-Rx) & Medication Management with CDS
- **e-Prescription Engine:** Structured medication ordering with RxNorm naming, dosage, route (Oral, IV, Inhalation), frequency, and refill management.
- **Clinical Decision Support (CDS) Allergy Cross-Check:** Real-time detection of drug-allergy contraindications (e.g., blocking Penicillin derivatives for penicillin-allergic patients).
- **Documented Clinical Override:** Clinician override protocol with logged justification for emergency scenarios.

### 5. 🌐 Epic 5: Interoperability Hub (HL7 v2.5.1 & FHIR R4)
- **HL7 v2.5.1 ER7 Gateway:**
  - Automated message generation: `ADT^A01` (Admit/Visit), `ADT^A08` (Demographic Update), `ORU^R01` (Lab Results), and `RDE^O11` (Pharmacy Orders).
  - Built-in HL7 segment dissector and interactive parser for external messages.
- **HL7 FHIR Release 4 (R4) REST API:**
  - `/api/fhir/Patient`: FHIR R4 Patient resources and searchset bundles.
  - `/api/fhir/Observation`: Vitals and laboratory observations.
  - `/api/fhir/MedicationRequest`: Prescription orders.
  - `/api/fhir/DiagnosticReport`: Diagnostic and imaging reports.
  - `/api/fhir/$everything`: Complete patient record FHIR bundle.
  - `/api/fhir/metadata`: Conformance CapabilityStatement.
- **Active Hospital Connectors:** Real-time simulated connectors for PACS (Port 104), LIS (Port 2575 MLLP), Pharmacy Gateway, and Enterprise EMR.

### 6. 📱 Epic 6: Consumer Health Patient Portal
- **Dual-Role Switcher:** Seamless toggle between *Clinician View* (Dr. Rachel Adams, MD) and *Patient Portal View* (Eleanor Vance).
- **Self-Service Scheduling:** In-Person and Telehealth appointment booking with provider and department selection.
- **Secure Messaging:** HIPAA-compliant communication thread between patients and care teams.
- **Personal Health Record (PHR):** Immediate patient access to lab results, vital histories, and active medications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React Icons |
| **Backend** | Node.js, Express 4.21, CORS |
| **Interoperability** | HL7 v2.5.1 ER7 Parser/Generator, HL7 FHIR Release 4 (R4) JSON Engine |
| **Standards** | ICD-10-CM, LOINC, RxNorm, DICOM Web (WADO-RS) |
| **Testing** | Node.js Built-in Test Runner (`node:test`, TAP) |

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Goldi24/carepulse-ehr-platform.git
   cd carepulse-ehr-platform
   ```

2. **Install dependencies:**
   ```bash
   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   ```

3. **Start the application:**
   - **One-click startup (Windows):**
     Double click `start.bat` in the root folder, or run:
     ```bash
     start.bat
     ```
   - **Manual startup:**
     ```bash
     # In terminal 1 (Backend API):
     cd server && npm run dev
     # Server starts on http://localhost:5000

     # In terminal 2 (Vite Frontend):
     cd client && npm run dev
     # Client opens on http://localhost:3000
     ```

4. **Run Automated Test Suite:**
   ```bash
   cd server && npm test
   ```

---

## 🔒 Security & HIPAA Alignment
- **Access Control:** Role-based segregation between clinical providers and patient portal users.
- **Clinical Safety:** Hard-stop CDS alerts for documented drug-allergy interactions.
- **Audit Trails:** Automatic timestamping and clinician signature attribution on all SOAP encounters, orders, and prescription records.

---

## 👤 Author & Maintainer
- **GitHub:** [@Goldi24](https://github.com/Goldi24)  
- **Email:** rajindrasingh390@gmail.com
