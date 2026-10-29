import React, { useState, useEffect } from 'react';
import { X, Pill, AlertTriangle, ShieldCheck, Check, Info } from 'lucide-react';
import { api } from '../../api';

export default function NewPrescriptionModal({ isOpen, onClose, onPrescribed, patients = [] }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [drugName, setDrugName] = useState('Lisinopril');
  const [dosage, setDosage] = useState('20 mg');
  const [route, setRoute] = useState('Oral');
  const [frequency, setFrequency] = useState('Once daily');
  const [duration, setDuration] = useState('30 days');
  const [refills, setRefills] = useState(2);
  const [notes, setNotes] = useState('');

  // Contraindication & Safety Alert State
  const [contraindicationAlert, setContraindicationAlert] = useState(null);
  const [overrideWarning, setOverrideWarning] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const commonMeds = [
    { name: 'Lisinopril', dosage: '20 mg', route: 'Oral', freq: 'Once daily' },
    { name: 'Metformin HCl', dosage: '500 mg', route: 'Oral', freq: 'Twice daily with meals' },
    { name: 'Atorvastatin', dosage: '20 mg', route: 'Oral', freq: 'Once daily at bedtime' },
    { name: 'Amoxicillin', dosage: '500 mg', route: 'Oral', freq: 'Three times daily' },
    { name: 'Albuterol Sulfate HFA', dosage: '90 mcg/actuation', route: 'Inhalation', freq: '1-2 puffs q4-6h PRN' },
    { name: 'Bactrim DS (Sulfamethoxazole/Trimethoprim)', dosage: '800/160 mg', route: 'Oral', freq: 'Twice daily' },
    { name: 'Aspirin Cardio', dosage: '81 mg', route: 'Oral', freq: 'Once daily with breakfast' }
  ];

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients]);

  // Real-time Allergy Cross Check whenever drug or patient changes
  useEffect(() => {
    if (selectedPatientId && drugName) {
      checkSafety();
    }
  }, [selectedPatientId, drugName]);

  const checkSafety = async () => {
    try {
      const res = await api.checkContraindication(selectedPatientId, drugName);
      if (res.success && res.contraindication.hasConflict) {
        setContraindicationAlert(res.contraindication);
      } else {
        setContraindicationAlert(null);
        setOverrideWarning(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const handleMedSelect = (item) => {
    setDrugName(item.name);
    setDosage(item.dosage);
    setRoute(item.route);
    setFrequency(item.freq);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (contraindicationAlert && !overrideWarning) {
      setError('Cannot submit: Patient has a severe allergy contraindication. You must override or choose another medication.');
      return;
    }

    if (overrideWarning && !overrideReason.trim()) {
      setError('Please document the clinical override reason to proceed.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patientId: selectedPatientId,
        drugName,
        dosage,
        route,
        frequency,
        duration,
        refills: parseInt(refills),
        notes,
        prescribedBy: 'Dr. Rachel Adams, MD',
        overrideAllergyWarning: overrideWarning,
        overrideReason: overrideReason || null
      };

      const res = await api.prescribeMedication(payload);
      if (res.success) {
        setSuccessNotice(`Prescription #${res.data.id} transmitted to pharmacy network!`);
        setTimeout(() => {
          onPrescribed(res.data);
          onClose();
        }, 1200);
      }
    } catch (err) {
      if (err.data?.isContraindicated) {
        setContraindicationAlert(err.data.allergyDetails);
        setError(err.data.error);
      } else {
        setError(err.message || 'Prescription error');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-indigo-200" />
            <div>
              <h2 className="text-base font-bold">Electronic Prescribing (e-Rx) & Medication Order</h2>
              <p className="text-xs text-indigo-200">Epic 4: Medication Management & Safety Interoperability</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Patient Selection & Documented Allergies Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-600 block mb-1">Patient Safety Profile:</span>
              {selectedPatient?.allergies && selectedPatient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.allergies.map((a, i) => (
                    <span key={i} className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-2xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> {a.allergen} ({a.severity})
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-emerald-700 text-2xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> No recorded drug allergies (NKDA)
                </span>
              )}
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div>
            <span className="text-2xs text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Quick Select Formulary:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {commonMeds.map((med, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleMedSelect(med)}
                  className={`px-2.5 py-1 rounded-lg border text-2xs font-medium transition ${
                    drugName === med.name 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {med.name}
                </button>
              ))}
            </div>
          </div>

          {/* CONTRAINDICATION SAFETY WARNING DIALOG */}
          {contraindicationAlert && (
            <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-xl space-y-3 animate-pulse">
              <div className="flex items-start gap-2.5 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">CLINICAL DECISION SUPPORT: CONTRAINDICATION DETECTED</h4>
                  <p className="text-xs text-rose-700 mt-1">{contraindicationAlert.message}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-rose-200 text-2xs text-rose-900 space-y-1">
                <p><strong>Known Allergen:</strong> {contraindicationAlert.allergen}</p>
                <p><strong>Reaction:</strong> {contraindicationAlert.reaction}</p>
                <p><strong>Severity:</strong> {contraindicationAlert.severity}</p>
              </div>

              <div className="pt-2 border-t border-rose-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-900">
                  <input
                    type="checkbox"
                    checked={overrideWarning}
                    onChange={(e) => setOverrideWarning(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Clinician Override: I acknowledge the contraindication and have clinical justification</span>
                </label>

                {overrideWarning && (
                  <div className="mt-2">
                    <label className="block font-semibold text-rose-900 mb-1">
                      Override Documentation & Justification *
                    </label>
                    <input
                      type="text"
                      required
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. Desensitization complete / alternative unavailable / critical need"
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drug Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Drug Name *</label>
              <input
                type="text"
                required
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dosage / Strength *</label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 20 mg, 500 mg"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Route</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Oral">Oral (PO)</option>
                <option value="Inhalation">Inhalation</option>
                <option value="Intravenous">Intravenous (IV)</option>
                <option value="Subcutaneous">Subcutaneous (Sub-Q)</option>
                <option value="Topical">Topical</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. Once daily, BID, TID"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30 days, 90 days"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Authorized Refills</label>
              <input
                type="number"
                min="0"
                max="12"
                value={refills}
                onChange={(e) => setRefills(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Patient Instructions / SIG Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Take with breakfast. Avoid alcohol."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
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
              className={`px-5 py-2 text-white rounded-xl font-bold shadow-sm flex items-center gap-2 ${
                contraindicationAlert && !overrideWarning 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Transmitting...' : 'Sign & e-Prescribe to Pharmacy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
