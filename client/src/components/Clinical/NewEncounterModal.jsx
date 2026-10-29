import React, { useState, useEffect } from 'react';
import { X, FileText, Activity, Stethoscope, AlertCircle, Check } from 'lucide-react';
import { api } from '../../api';

export default function NewEncounterModal({ isOpen, onClose, onEncounterCreated, patients = [] }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [provider, setProvider] = useState('Dr. Rachel Adams, MD (Internal Medicine)');
  const [department, setDepartment] = useState('Ambulatory Outpatient Clinic');
  const [type, setType] = useState('Office Visit / Evaluation');
  const [reasonForVisit, setReasonForVisit] = useState('');
  
  // Vitals
  const [vitals, setVitals] = useState({
    heartRate: 72,
    systolicBP: 124,
    diastolicBP: 80,
    respiratoryRate: 16,
    temperatureF: 98.6,
    oxygenSaturation: 99,
    weightKg: 75,
    heightCm: 172
  });

  // SOAP
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients]);

  if (!isOpen) return null;

  // Calculate BMI dynamically
  const heightM = (vitals.heightCm || 170) / 100;
  const calculatedBmi = vitals.weightKg ? (vitals.weightKg / (heightM * heightM)).toFixed(1) : 22.0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !reasonForVisit) {
      setError('Please select a patient and provide the reason for visit.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        patientId: selectedPatientId,
        provider,
        department,
        type,
        reasonForVisit,
        vitals: {
          ...vitals,
          temperatureC: +(((vitals.temperatureF - 32) * 5) / 9).toFixed(1),
          bmi: +calculatedBmi
        },
        soapNote: {
          subjective: subjective || 'Patient presents for clinical evaluation.',
          objective: objective || `Physical exam unremarkable. BP: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg.`,
          assessment: assessment || 'Clinical review completed.',
          plan: plan || 'Follow up as clinically indicated.'
        },
        status: 'Signed'
      };

      const res = await api.createEncounter(payload);
      if (res.success) {
        setSuccessNotice('Encounter & SOAP Note signed! HL7 ADT^A01 generated.');
        setTimeout(() => {
          onEncounterCreated(res.data);
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Failed to document encounter');
      }
    } catch (err) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-700 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-200" />
            <div>
              <h2 className="text-lg font-bold">Document Clinical Encounter & SOAP Note</h2>
              <p className="text-xs text-blue-200">Epic 2: Clinical Documentation (Sprints 4-7)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Patient & Provider Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Encounter Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Office Visit / Evaluation">Office Visit / Evaluation</option>
                <option value="Routine Follow-up">Routine Follow-up</option>
                <option value="Urgent Care / Acute Visit">Urgent Care / Acute Visit</option>
                <option value="Telehealth Consultation">Telehealth Consultation</option>
                <option value="Post-Operative Check">Post-Operative Check</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Reason for Visit / Chief Complaint *</label>
              <input
                type="text"
                required
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                placeholder="e.g. Hypertension management, elevated blood pressure checks"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Vitals Recording Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase text-2xs tracking-wider">
                <Activity className="w-3.5 h-3.5 text-rose-500" /> Vital Signs & Biometrics
              </span>
              <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-2xs">
                Auto-calculated BMI: {calculatedBmi} kg/m²
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={vitals.systolicBP}
                  onChange={(e) => setVitals({ ...vitals, systolicBP: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={vitals.diastolicBP}
                  onChange={(e) => setVitals({ ...vitals, diastolicBP: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Oxygen Saturation (%)</label>
                <input
                  type="number"
                  value={vitals.oxygenSaturation}
                  onChange={(e) => setVitals({ ...vitals, oxygenSaturation: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperatureF}
                  onChange={(e) => setVitals({ ...vitals, temperatureF: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Respiratory Rate</label>
                <input
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={(e) => setVitals({ ...vitals, respiratoryRate: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={vitals.weightKg}
                  onChange={(e) => setVitals({ ...vitals, weightKg: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={vitals.heightCm}
                  onChange={(e) => setVitals({ ...vitals, heightCm: +e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>

          {/* SOAP Notes Inputs */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-2xs flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> Structured SOAP Documentation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-blue-900 mb-1">Subjective (S)</label>
                <textarea
                  rows="3"
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  placeholder="Patient history of present illness (HPI), symptoms reported..."
                  className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50/20"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-900 mb-1">Objective (O)</label>
                <textarea
                  rows="3"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Physical examination findings, observations..."
                  className="w-full p-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-900 mb-1">Assessment (A)</label>
                <textarea
                  rows="3"
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  placeholder="Clinical diagnosis, ICD-10 impressions..."
                  className="w-full p-2.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/20"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-900 mb-1">Plan (P)</label>
                <textarea
                  rows="3"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  placeholder="Therapeutic orders, medications, patient education, follow-up..."
                  className="w-full p-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-purple-50/20"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2"
            >
              {loading ? 'Signing...' : 'Sign & Complete Encounter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
