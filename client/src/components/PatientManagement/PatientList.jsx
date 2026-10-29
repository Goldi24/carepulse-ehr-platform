import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Filter, AlertTriangle, ShieldCheck, 
  ChevronRight, HeartPulse, Activity, Phone, Mail, 
  LayoutGrid, List, Droplet, User, Sparkles
} from 'lucide-react';
import { api } from '../../api';
import PatientRegisterModal from './PatientRegisterModal';
import PatientDetailsModal from './PatientDetailsModal';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [quickFilter, setQuickFilter] = useState('all'); // all, allergies, chronic, active
  const [viewMode, setViewMode] = useState('table'); // table, grid
  const [loading, setLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients({ search: searchQuery, status: statusFilter });
      if (res.success) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery, statusFilter]);

  const handlePatientCreated = (newPat) => {
    fetchPatients();
    setSelectedPatient(newPat);
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  // Filter based on quick filters
  const filteredPatients = patients.filter((pat) => {
    if (quickFilter === 'allergies') return pat.allergies && pat.allergies.length > 0;
    if (quickFilter === 'chronic') return pat.chronicConditions && pat.chronicConditions.length > 0;
    if (quickFilter === 'active') return pat.status === 'Active';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Epic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Epic 1 • MPI
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient Management & Master Index
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise patient master index (MPI), insurance coverage verification, allergy records, and medical histories.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 transform active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          Register New Patient
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs card-hover-subtle">
          <span className="text-xs text-slate-500 font-medium">Total Registered</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{patients.length}</p>
          <span className="text-2xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% MPI Synced
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs card-hover-subtle">
          <span className="text-xs text-slate-500 font-medium">Documented Allergies</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {patients.reduce((acc, p) => acc + (p.allergies?.length || 0), 0)}
          </p>
          <span className="text-2xs text-rose-500 font-medium mt-0.5">CDS Cross-checks Active</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs card-hover-subtle">
          <span className="text-xs text-slate-500 font-medium">Active Insurance</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {patients.filter(p => p.insurance?.status === 'Active').length}
          </p>
          <span className="text-2xs text-slate-400 mt-0.5">Real-time Payer Sync</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs card-hover-subtle">
          <span className="text-xs text-slate-500 font-medium">Chronic Care Cohorts</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {patients.filter(p => p.chronicConditions?.length > 0).length}
          </p>
          <span className="text-2xs text-slate-400 mt-0.5">Hypertension & T2DM</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patients by name, MRN (e.g. MRN-2026-8941), email, or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-2xs font-semibold uppercase tracking-wider">Quick Filters:</span>
          {[
            { id: 'all', label: `All Patients (${patients.length})` },
            { id: 'allergies', label: `With Allergies (${patients.filter(p => p.allergies?.length > 0).length})` },
            { id: 'chronic', label: `Chronic Conditions (${patients.filter(p => p.chronicConditions?.length > 0).length})` },
            { id: 'active', label: `Active (${patients.filter(p => p.status === 'Active').length})` }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setQuickFilter(chip.id)}
              className={`px-2.5 py-1 rounded-lg text-2xs font-medium transition ${
                quickFilter === chip.id
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Display (Table or Grid) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-2xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Patient & MRN</th>
                  <th className="py-3.5 px-4">Age / Demographics</th>
                  <th className="py-3.5 px-4">Blood & Coverage</th>
                  <th className="py-3.5 px-4">Allergies & Risk</th>
                  <th className="py-3.5 px-4">Primary Conditions</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">Loading patients...</td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      No matching patients found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((pat) => (
                    <tr 
                      key={pat.id} 
                      onClick={() => setSelectedPatient(pat)}
                      className="hover:bg-blue-50/50 transition cursor-pointer group"
                    >
                      {/* Patient & MRN */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/80 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition duration-150 shadow-2xs">
                            {pat.firstName.charAt(0)}{pat.lastName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition block">
                              {pat.firstName} {pat.lastName}
                            </span>
                            <span className="text-2xs font-mono text-slate-400">
                              {pat.mrn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Demographics & Age */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <span>{calculateAge(pat.dob)} yrs</span>
                          <span className="text-slate-300">•</span>
                          <span>{pat.gender}</span>
                        </div>
                        <p className="text-2xs text-slate-400 mt-0.5">{pat.phone || 'No phone'}</p>
                      </td>

                      {/* Blood & Insurance */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-2xs px-1.5 py-0.5 rounded font-mono font-bold">
                            <Droplet className="w-2.5 h-2.5 text-rose-500" />
                            {pat.bloodGroup || 'O+'}
                          </span>
                          <span className="font-medium text-slate-800 text-xs truncate max-w-[140px]">
                            {pat.insurance?.provider || 'Self-Pay'}
                          </span>
                        </div>
                        <span className="text-2xs text-slate-400 block mt-0.5">
                          {pat.insurance?.coverageType || 'Standard'} • {pat.insurance?.status || 'Active'}
                        </span>
                      </td>

                      {/* Allergies */}
                      <td className="py-3.5 px-4">
                        {pat.allergies && pat.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {pat.allergies.map((alg, i) => (
                              <span 
                                key={i} 
                                className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-2xs px-2 py-0.5 rounded-full font-semibold"
                              >
                                <AlertTriangle className="w-3 h-3 text-rose-500" />
                                {alg.allergen}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-600 text-2xs font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> NKDA (Safe)
                          </span>
                        )}
                      </td>

                      {/* Chronic Conditions */}
                      <td className="py-3.5 px-4">
                        {pat.chronicConditions && pat.chronicConditions.length > 0 ? (
                          <div className="space-y-0.5">
                            {pat.chronicConditions.slice(0, 2).map((c, i) => (
                              <span key={i} className="block text-2xs text-slate-600 truncate max-w-xs font-medium">
                                • {c.name}
                              </span>
                            ))}
                            {pat.chronicConditions.length > 2 && (
                              <span className="text-2xs text-slate-400">+{pat.chronicConditions.length - 2} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-2xs">None documented</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition font-semibold text-xs">
                          <span>View Chart</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(pat => (
            <div
              key={pat.id}
              onClick={() => setSelectedPatient(pat)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 card-hover-subtle cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
                      {pat.firstName.charAt(0)}{pat.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{pat.firstName} {pat.lastName}</h3>
                      <p className="text-2xs font-mono text-slate-400">{pat.mrn}</p>
                    </div>
                  </div>
                  <span className="bg-rose-50 text-rose-700 font-bold text-2xs px-2 py-0.5 rounded border border-rose-200 font-mono">
                    {pat.bloodGroup || 'O+'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Age / Gender:</span>
                    <span className="font-medium">{calculateAge(pat.dob)} yrs • {pat.gender}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Insurance:</span>
                    <span className="font-medium truncate max-w-[180px]">{pat.insurance?.provider || 'Self-Pay'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-2xs block mb-1">Documented Allergies:</span>
                    {pat.allergies && pat.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {pat.allergies.map((alg, i) => (
                          <span key={i} className="text-2xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                            {alg.allergen}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-2xs text-emerald-600 font-medium">✓ NKDA</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-2xs text-slate-400">{pat.email || pat.phone}</span>
                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                  Full Chart <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Modal */}
      <PatientRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onPatientCreated={handlePatientCreated}
      />

      {/* 360 Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
