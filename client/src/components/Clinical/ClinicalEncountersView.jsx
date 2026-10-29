import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, User, Calendar, Stethoscope, Activity, 
  Search, CheckCircle2, HeartPulse, Clock, AlertTriangle, 
  ChevronRight, Sparkles, Filter
} from 'lucide-react';
import { api } from '../../api';
import NewEncounterModal from './NewEncounterModal';

export default function ClinicalEncountersView() {
  const [encounters, setEncounters] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [encRes, patRes] = await Promise.all([
        api.getEncounters(selectedPatientFilter),
        api.getPatients()
      ]);
      if (encRes.success) setEncounters(encRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      console.error('Failed to load encounters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientFilter]);

  const getPatientName = (patientId) => {
    const p = patients.find(pat => pat.id === patientId);
    return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : patientId;
  };

  const filteredEncounters = encounters.filter(enc => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const reason = (enc.reasonForVisit || '').toLowerCase();
    const provider = (enc.provider || '').toLowerCase();
    const assess = (enc.soapNote?.assessment || '').toLowerCase();
    const pat = getPatientName(enc.patientId).toLowerCase();
    return reason.includes(term) || provider.includes(term) || assess.includes(term) || pat.includes(term);
  });

  const getBpStatus = (systolic, diastolic) => {
    if (systolic >= 140 || diastolic >= 90) return { label: 'Stage 2 HTN', color: 'bg-rose-100 text-rose-800' };
    if (systolic >= 130 || diastolic >= 80) return { label: 'Elevated BP', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Normal BP', color: 'bg-emerald-100 text-emerald-800' };
  };

  return (
    <div className="space-y-6">
      {/* Epic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 2 • Clinical
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Clinical Documentation & SOAP Notes
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized physician encounter tracking, biometric vital trends, and structured 4-quadrant SOAP clinical assessments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          Document New Encounter
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search encounters by patient, diagnosis, symptom, or clinician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-600 text-xs whitespace-nowrap">Patient:</span>
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Patients ({patients.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {p.mrn}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 text-2xs whitespace-nowrap hidden md:inline">
          Showing {filteredEncounters.length} clinical records
        </span>
      </div>

      {/* Encounters Timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading clinical encounters...
          </div>
        ) : filteredEncounters.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No clinical documentation found matching your search. Click "Document New Encounter" to record a consultation.
          </div>
        ) : (
          filteredEncounters.map(enc => {
            const bpStatus = enc.vitals ? getBpStatus(enc.vitals.systolicBP, enc.vitals.diastolicBP) : null;
            return (
              <div key={enc.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden card-hover-subtle">
                {/* Encounter Header Strip */}
                <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{enc.type}</span>
                        <span className="text-2xs font-mono bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                          {enc.id}
                        </span>
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {enc.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Patient: <strong className="text-slate-800">{getPatientName(enc.patientId)}</strong> • {enc.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-700 font-medium flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(enc.date).toLocaleDateString()} at {new Date(enc.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-2xs text-slate-400 block mt-0.5">Attending: <strong>{enc.provider}</strong></span>
                  </div>
                </div>

                {/* Encounter Body */}
                <div className="p-6 space-y-4">
                  {/* Reason for Visit */}
                  <div className="text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-2xs block mb-1">
                      Chief Complaint / Clinical Indication:
                    </span>
                    <p className="font-semibold text-slate-900 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                      "{enc.reasonForVisit}"
                    </p>
                  </div>

                  {/* Vitals Summary */}
                  {enc.vitals && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-2xs flex items-center gap-1">
                          <Activity className="w-3 h-3 text-rose-500" /> Objective Biometric Vitals
                        </span>
                        {bpStatus && (
                          <span className={`text-2xs px-2 py-0.5 rounded-full font-bold ${bpStatus.color}`}>
                            {bpStatus.label}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-2xs text-slate-400 uppercase font-semibold">Blood Pressure</span>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{enc.vitals.systolicBP}/{enc.vitals.diastolicBP} <span className="text-2xs font-normal text-slate-400">mmHg</span></p>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-2xs text-slate-400 uppercase font-semibold">Heart Rate</span>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{enc.vitals.heartRate} <span className="text-2xs font-normal text-slate-400">bpm</span></p>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-2xs text-slate-400 uppercase font-semibold">SpO2 (Pulse Ox)</span>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{enc.vitals.oxygenSaturation}%</p>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-2xs text-slate-400 uppercase font-semibold">Temperature</span>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{enc.vitals.temperatureF}°F</p>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-2xs text-slate-400 uppercase font-semibold">Resp Rate</span>
                          <p className="font-bold text-slate-800 text-sm mt-0.5">{enc.vitals.respiratoryRate} <span className="text-2xs font-normal text-slate-400">/min</span></p>
                        </div>
                        <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                          <span className="text-2xs text-blue-600 uppercase font-bold">Body Mass Index</span>
                          <p className="font-bold text-blue-800 text-sm mt-0.5">{enc.vitals.bmi || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SOAP Note 4-Quadrant Cards */}
                  {enc.soapNote && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      {/* Subjective */}
                      <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-200/80 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xs font-bold">S</span>
                          <span>Subjective (HPI & Clinical Narrative)</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.subjective}</p>
                      </div>

                      {/* Objective */}
                      <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-emerald-900 mb-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xs font-bold">O</span>
                          <span>Objective (Physical Exam & Findings)</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.objective}</p>
                      </div>

                      {/* Assessment */}
                      <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/80 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-2xs font-bold">A</span>
                          <span>Assessment (Diagnoses & ICD-10 Classification)</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{enc.soapNote.assessment}</p>
                      </div>

                      {/* Plan */}
                      <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-200/80 shadow-2xs">
                        <div className="flex items-center gap-2 font-bold text-purple-900 mb-2">
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xs font-bold">P</span>
                          <span>Plan (Orders, Prescriptions & Follow-up)</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.plan}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Encounter Modal */}
      <NewEncounterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEncounterCreated={() => fetchData()}
        patients={patients}
      />
    </div>
  );
}
