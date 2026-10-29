import React, { useState, useEffect } from 'react';
import { 
  X, User, Shield, AlertTriangle, HeartPulse, FileText, 
  Pill, FlaskConical, Code2, Calendar, Phone, Mail, MapPin 
} from 'lucide-react';
import { api } from '../../api';

export default function PatientDetailsModal({ patient, isOpen, onClose }) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [encounters, setEncounters] = useState([]);
  const [medications, setMedications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [fhirData, setFhirData] = useState(null);
  const [hl7String, setHl7String] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient && isOpen) {
      loadPatientDetails();
    }
  }, [patient, isOpen]);

  const loadPatientDetails = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const [encRes, medRes, ordRes, hl7Sample] = await Promise.all([
        api.getEncounters(patient.id),
        api.getMedications({ patientId: patient.id }),
        api.getOrders({ patientId: patient.id }),
        api.getHl7Sample('ADT_A08')
      ]);

      if (encRes.success) setEncounters(encRes.data);
      if (medRes.success) setMedications(medRes.data);
      if (ordRes.success) setOrders(ordRes.data);
      if (hl7Sample?.rawMessage) setHl7String(hl7Sample.rawMessage);

      // fetch FHIR Patient
      const fhirRes = await fetch(`/api/patients/${patient.id}/fhir`).then(r => r.json());
      setFhirData(fhirRes);
    } catch (err) {
      console.error("Failed to load patient chart details", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{patient.firstName} {patient.lastName}</h2>
                <span className="bg-blue-500/30 text-blue-300 text-xs px-2.5 py-0.5 rounded-full border border-blue-400/30 font-mono">
                  {patient.mrn}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  patient.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span>DOB: {patient.dob}</span>
                <span>•</span>
                <span>Gender: {patient.gender}</span>
                <span>•</span>
                <span className="text-rose-300 font-semibold">Blood: {patient.bloodGroup || 'N/A'}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 flex gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Overview & Demographics', icon: User },
            { id: 'clinical', label: `Encounters (${encounters.length})`, icon: FileText },
            { id: 'meds', label: `Prescriptions (${medications.length})`, icon: Pill },
            { id: 'orders', label: `Diagnostics & Labs (${orders.length})`, icon: FlaskConical },
            { id: 'interop', label: 'HL7 & FHIR Standard View', icon: Code2 },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  active 
                    ? 'border-blue-600 text-blue-700 bg-white/70' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Allergies Alert Banner */}
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-xl">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Documented Allergies ({patient.allergies.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {patient.allergies.map((alg, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-rose-200 shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 text-sm">{alg.allergen}</span>
                          <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            {alg.severity}
                          </span>
                        </div>
                        <p className="text-xs text-rose-700 mt-1">Reaction: {alg.reaction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                  ✓ No Known Drug Allergies (NKDA) recorded for this patient.
                </div>
              )}

              {/* Grid Cards: Contact & Insurance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Card */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" /> Contact & Emergency Details
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium text-slate-800">{patient.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium text-slate-800">{patient.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                      <div>
                        <span className="text-slate-500">Address:</span>
                        <p className="font-medium text-slate-800">
                          {patient.address?.street}, {patient.address?.city}, {patient.address?.state} {patient.address?.zip}
                        </p>
                      </div>
                    </div>
                    {patient.emergencyContact && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-500 block mb-1">Emergency Contact:</span>
                        <p className="font-semibold text-slate-900">{patient.emergencyContact.name} ({patient.emergencyContact.relation})</p>
                        <p className="text-slate-600">{patient.emergencyContact.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insurance Card */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" /> Health Coverage & Insurance
                  </h3>
                  {patient.insurance ? (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-slate-500">Payer Name:</span>
                        <p className="font-bold text-slate-900 text-sm">{patient.insurance.provider}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-500">Policy / ID:</span>
                          <p className="font-mono font-medium text-slate-800">{patient.insurance.policyNumber}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Group #:</span>
                          <p className="font-mono font-medium text-slate-800">{patient.insurance.groupNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-500">Plan Type:</span>
                          <p className="font-medium text-slate-800">{patient.insurance.coverageType}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Status:</span>
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-2xs">
                            {patient.insurance.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No insurance recorded (Self-Pay).</p>
                  )}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" /> Chronic Medical Conditions
                </h3>
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {patient.chronicConditions.map((cond, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{cond.name}</span>
                          <p className="text-2xs text-slate-500">Diagnosed: {cond.diagnosedDate}</p>
                        </div>
                        <span className="bg-slate-200 font-mono text-slate-700 px-2 py-0.5 rounded text-2xs font-semibold">
                          {cond.code}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No active chronic conditions noted.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENCOUNTERS & SOAP */}
          {activeSubTab === 'clinical' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Encounter History & SOAP Documentation
                </h3>
                <span className="text-xs text-slate-500">Epic 2: Clinical Documentation</span>
              </div>
              {encounters.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No clinical encounters recorded yet.</div>
              ) : (
                encounters.map(enc => (
                  <div key={enc.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                    <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{enc.type}</span>
                          <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {enc.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{enc.provider} • {enc.department}</p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(enc.date).toLocaleDateString()} {new Date(enc.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Vitals Summary Pill */}
                    {enc.vitals && (
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs">
                        <div>
                          <span className="text-2xs text-slate-400 uppercase">BP</span>
                          <p className="font-bold text-slate-800">{enc.vitals.systolicBP}/{enc.vitals.diastolicBP}</p>
                        </div>
                        <div>
                          <span className="text-2xs text-slate-400 uppercase">HR</span>
                          <p className="font-bold text-slate-800">{enc.vitals.heartRate} bpm</p>
                        </div>
                        <div>
                          <span className="text-2xs text-slate-400 uppercase">O2 Sat</span>
                          <p className="font-bold text-slate-800">{enc.vitals.oxygenSaturation}%</p>
                        </div>
                        <div>
                          <span className="text-2xs text-slate-400 uppercase">Temp</span>
                          <p className="font-bold text-slate-800">{enc.vitals.temperatureF}°F</p>
                        </div>
                        <div>
                          <span className="text-2xs text-slate-400 uppercase">Resp</span>
                          <p className="font-bold text-slate-800">{enc.vitals.respiratoryRate}/min</p>
                        </div>
                        <div>
                          <span className="text-2xs text-slate-400 uppercase">BMI</span>
                          <p className="font-bold text-blue-600">{enc.vitals.bmi || 'N/A'}</p>
                        </div>
                      </div>
                    )}

                    {/* SOAP Breakdown */}
                    {enc.soapNote && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                          <span className="font-bold text-blue-900 block mb-1">Subjective (S)</span>
                          <p className="text-slate-700 whitespace-pre-wrap">{enc.soapNote.subjective}</p>
                        </div>
                        <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                          <span className="font-bold text-emerald-900 block mb-1">Objective (O)</span>
                          <p className="text-slate-700 whitespace-pre-wrap">{enc.soapNote.objective}</p>
                        </div>
                        <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                          <span className="font-bold text-amber-900 block mb-1">Assessment (A)</span>
                          <p className="text-slate-700 whitespace-pre-wrap">{enc.soapNote.assessment}</p>
                        </div>
                        <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                          <span className="font-bold text-purple-900 block mb-1">Plan (P)</span>
                          <p className="text-slate-700 whitespace-pre-wrap">{enc.soapNote.plan}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: MEDICATIONS */}
          {activeSubTab === 'meds' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active & Prescribed Medications (e-Prescribing)
                </h3>
                <span className="text-xs text-slate-500">Epic 4: Medication Management</span>
              </div>
              {medications.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No medications documented.</div>
              ) : (
                medications.map(med => (
                  <div key={med.id} className="p-3.5 border border-slate-200 rounded-xl bg-white shadow-2xs flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{med.drugName}</span>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {med.dosage}
                        </span>
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                          med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {med.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>Directions:</strong> {med.frequency} • {med.route}
                      </p>
                      <p className="text-2xs text-slate-400 mt-1">
                        Prescribed: {med.prescribedDate} by {med.prescribedBy} • Refills: {med.refills}
                      </p>
                      <p className="text-2xs text-indigo-600 mt-0.5 font-medium">
                        Pharmacy: {med.pharmacyStatus}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: ORDERS & LABS */}
          {activeSubTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  CPOE Diagnostic Orders & Reports (PACS / LIS)
                </h3>
                <span className="text-xs text-slate-500">Epic 3: Order Management</span>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No diagnostic orders placed.</div>
              ) : (
                orders.map(ord => (
                  <div key={ord.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ord.testName}</span>
                        <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {ord.type} ({ord.category})
                        </span>
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                          ord.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(ord.orderDate).toLocaleDateString()}
                      </span>
                    </div>

                    {ord.results && ord.results.length > 0 && (
                      <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs uppercase">
                            <tr>
                              <th className="p-2">Analyte / Test</th>
                              <th className="p-2">Observed Value</th>
                              <th className="p-2">Reference Range</th>
                              <th className="p-2">Flag</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {ord.results.map((r, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2 font-medium text-slate-800">{r.test}</td>
                                <td className="p-2 font-bold text-slate-900">{r.value} {r.unit}</td>
                                <td className="p-2 text-slate-500">{r.referenceRange}</td>
                                <td className="p-2">
                                  <span className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
                                    r.flag === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {r.flag}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {ord.radiologistImpression && (
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                        <strong className="text-amber-900 block mb-0.5">Radiologist Impression:</strong>
                        <p className="text-amber-800">{ord.radiologistImpression}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: HL7 & FHIR VIEW */}
          {activeSubTab === 'interop' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Epic 5: System Integration & Healthcare Standards
                  </h3>
                  <p className="text-xs text-slate-500">Live HL7 v2.5.1 and HL7 FHIR Release 4 (R4) resource models.</p>
                </div>
              </div>

              {/* HL7 v2 Pipe Delimited */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center text-xs">
                  <span className="font-mono text-emerald-400 font-semibold">HL7 v2.5.1 ADT^A08 Patient Update Message</span>
                  <span className="text-slate-400">ER7 Pipe-Delimited</span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 whitespace-pre-wrap">
                  {hl7String || 'Loading HL7 representation...'}
                </pre>
              </div>

              {/* FHIR R4 JSON */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center text-xs">
                  <span className="font-mono text-blue-400 font-semibold">HL7 FHIR R4 Patient Resource JSON</span>
                  <span className="text-slate-400">application/fhir+json</span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto text-blue-300 max-h-64 overflow-y-auto">
                  {fhirData ? JSON.stringify(fhirData, null, 2) : 'Loading FHIR data...'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
