import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PatientList from './components/PatientManagement/PatientList';
import ClinicalEncountersView from './components/Clinical/ClinicalEncountersView';
import CpoeOrderView from './components/Orders/CpoeOrderView';
import MedicationManager from './components/Medications/MedicationManager';
import InteroperabilityHub from './components/Interoperability/InteroperabilityHub';
import AgileDashboardView from './components/Agile/AgileDashboardView';
import PatientPortalView from './components/PatientPortal/PatientPortalView';
import { ShieldCheck, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('patients');
  const [portalMode, setPortalMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalMode={portalMode}
        setPortalMode={setPortalMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {portalMode ? (
          <PatientPortalView />
        ) : (
          <>
            {activeTab === 'patients' && <PatientList />}
            {activeTab === 'encounters' && <ClinicalEncountersView />}
            {activeTab === 'orders' && <CpoeOrderView />}
            {activeTab === 'medications' && <MedicationManager />}
            {activeTab === 'interoperability' && <InteroperabilityHub />}
            {activeTab === 'agile' && <AgileDashboardView />}
          </>
        )}
      </main>

      {/* Modernized Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-8 mt-14 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">CarePulse EHR Platform</span>
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-2xs border border-emerald-200">
                  HL7 v2.5.1 & FHIR R4 Compliant
                </span>
              </div>
              <p className="text-2xs text-slate-400 mt-0.5">
                Enterprise Electronic Health Record System with CPOE, CDS Allergy Checking, and PACS DICOM integration.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-2xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              HIPAA & ONC Certified Workflows
            </span>
            <span>•</span>
            <span>Curated by <a href="https://github.com/Goldi24" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Goldi24</a></span>
            <span>•</span>
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-semibold border border-blue-100">
              Healthcare & Pharma Suite
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
