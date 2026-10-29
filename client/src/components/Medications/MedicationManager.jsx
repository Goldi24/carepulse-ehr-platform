import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Filter, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Sparkles, Clock } from 'lucide-react';
import { api } from '../../api';
import NewPrescriptionModal from './NewPrescriptionModal';

export default function MedicationManager() {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [searchDrug, setSearchDrug] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [medRes, patRes] = await Promise.all([
        api.getMedications({ 
          patientId: selectedPatientFilter, 
          status: selectedStatusFilter 
        }),
        api.getPatients()
      ]);
      if (medRes.success) setMedications(medRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      console.error('Failed to load medications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientFilter, selectedStatusFilter]);

  const handleDiscontinue = async (medId, drugName) => {
    const reason = window.prompt(`Reason for discontinuing ${drugName}:`, "Therapy completed / clinical re-evaluation");
    if (!reason) return;

    try {
      const res = await api.discontinueMedication(medId, reason);
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      alert(e.message || "Failed to discontinue");
    }
  };

  const getPatientDisplay = (id) => {
    const p = patients.find(pat => pat.id === id);
    return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : id;
  };

  const filteredMeds = medications.filter(m => {
    if (!searchDrug.trim()) return true;
    const term = searchDrug.toLowerCase();
    return m.drugName.toLowerCase().includes(term) || (m.dosage && m.dosage.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-6">
      {/* Epic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 4 • e-Prescribing
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Medication Management & Electronic Prescribing (e-Rx)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time allergy contraindication safety checking (CDS), active medication lists, and pharmacy network dispatch.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          Create e-Prescription (e-Rx)
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Prescriptions</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{medications.length}</p>
          <span className="text-2xs text-slate-400">RxNorm Mapped</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Active Regimens</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {medications.filter(m => m.status === 'Active').length}
          </p>
          <span className="text-2xs text-emerald-600 font-medium">Currently Dispensed</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">CDS Safety Overrides</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {medications.filter(m => m.overrideReason).length}
          </p>
          <span className="text-2xs text-amber-600 font-medium">Logged Clinical Justification</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Discontinued Regimens</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {medications.filter(m => m.status === 'Discontinued').length}
          </p>
          <span className="text-2xs text-slate-400">Therapy Completed</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search medications by drug name (e.g. Lisinopril, Metformin)..."
            value={searchDrug}
            onChange={(e) => setSearchDrug(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-600 text-xs">Patient:</span>
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500 max-w-xs"
          >
            <option value="">All Patients ({patients.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {p.mrn}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-600 text-xs">Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Regimens</option>
            <option value="Discontinued">Discontinued Regimens</option>
          </select>
        </div>
      </div>

      {/* Medications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading medications...
          </div>
        ) : filteredMeds.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No medication orders found matching your criteria. Click "Create e-Prescription" to issue an order.
          </div>
        ) : (
          filteredMeds.map(med => (
            <div key={med.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 card-hover-subtle">
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                  med.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{med.drugName}</span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 font-mono">
                      {med.dosage}
                    </span>
                    <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {med.id}
                    </span>
                    <span className={`text-2xs font-semibold px-2.5 py-0.5 rounded-full ${
                      med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {med.status}
                    </span>
                    {med.overrideReason && (
                      <span className="text-2xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-700" /> Allergy Override
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mt-1.5 font-medium">
                    Patient: <strong className="text-slate-900">{getPatientDisplay(med.patientId)}</strong> • <strong>Instructions:</strong> {med.frequency} ({med.route}) • Duration: {med.duration} • Refills Remaining: {med.refills}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-2xs text-slate-400 mt-1.5">
                    <span>Prescribed: {med.prescribedDate} by {med.prescribedBy}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">Pharmacy Gateway: {med.pharmacyStatus}</span>
                  </div>

                  {med.overrideReason && (
                    <p className="text-2xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
                      <strong>Clinical Override Note:</strong> {med.overrideReason}
                    </p>
                  )}

                  {med.discontinuedReason && (
                    <p className="text-2xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2">
                      <strong>Discontinuation Reason:</strong> {med.discontinuedReason}
                    </p>
                  )}
                </div>
              </div>

              {med.status === 'Active' && (
                <button
                  onClick={() => handleDiscontinue(med.id, med.drugName)}
                  className="px-3.5 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition shrink-0 self-end sm:self-auto shadow-2xs"
                >
                  Discontinue Regimen
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Prescription Modal */}
      <NewPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrescribed={() => fetchData()}
        patients={patients}
      />
    </div>
  );
}
