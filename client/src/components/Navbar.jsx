import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, FileText, FlaskConical, Pill, 
  Network, BarChart3, UserCheck, Stethoscope, 
  ShieldCheck, Clock, Search, Bell, Sparkles, HeartPulse
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, portalMode, setPortalMode, onOpenQuickSearch }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users, badge: 'MPI' },
    { id: 'encounters', label: 'Clinical Encounters', icon: FileText, badge: 'SOAP' },
    { id: 'orders', label: 'CPOE & Diagnostics', icon: FlaskConical, badge: 'LOINC' },
    { id: 'medications', label: 'Medications & e-Rx', icon: Pill, badge: 'CDS' },
    { id: 'interoperability', label: 'HL7 & FHIR Hub', icon: Network, badge: 'v2.5/R4' },
    { id: 'agile', label: 'Agile Metrics', icon: BarChart3, badge: 'Sprint' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top System Status Bar */}
      <div className="bg-slate-900 text-slate-300 text-2xs py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 status-dot-pulse"></span>
              HL7 v2.5.1 MLLP & FHIR R4 Engine: Operational
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              CPOE & PACS PACS-RS Interface: Synced
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Clock className="w-3 h-3 text-sky-400" />
              {currentTime || '11:20:00'} (Local System Time)
            </span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              HIPAA Protected Mode
            </span>
          </div>
        </div>
      </div>

      {/* Main Brand & Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-md glow-blue flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  CarePulse <span className="text-blue-600 font-light">EHR</span>
                </span>
                <span className="bg-blue-50 text-blue-700 text-2xs font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                  v2.0 Enterprise
                </span>
                <span className="hidden lg:inline-flex bg-emerald-50 text-emerald-700 text-2xs font-semibold px-2 py-0.5 rounded-md border border-emerald-200 items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live REST API
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Clinical Health Records & Interoperability Suite
              </p>
            </div>
          </div>

          {/* Role Switcher & User Profile Pill */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center text-xs font-semibold border border-slate-200/80 shadow-inner">
              <button
                onClick={() => setPortalMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  !portalMode 
                    ? 'bg-white text-blue-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Clinician View</span>
                <span className="sm:hidden">Clinician</span>
              </button>
              <button
                onClick={() => setPortalMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  portalMode 
                    ? 'bg-blue-600 text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Patient Portal</span>
                <span className="sm:hidden">Patient</span>
              </button>
            </div>

            {/* Profile Pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {!portalMode ? 'RA' : 'EV'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-bold text-slate-800">
                  {!portalMode ? 'Dr. Rachel Adams, MD' : 'Eleanor Vance'}
                </p>
                <p className="text-slate-500 text-2xs">
                  {!portalMode ? 'Internal Medicine • Attending' : 'Patient • MRN-2026-8941'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinician Navigation Tabs */}
      {!portalMode && (
        <div className="border-t border-slate-100 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-2xs font-mono px-1.5 py-0.2 rounded-md ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
