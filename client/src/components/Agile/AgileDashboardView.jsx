import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Target, Users, CheckCircle2, TrendingUp, 
  Clock, ShieldAlert, Award, Layers, Zap, GitCommit, FileCode 
} from 'lucide-react';
import { api } from '../../api';

export default function AgileDashboardView() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('metrics'); // metrics, epics, team, tenets, bestPractices

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.getMetrics();
      if (res.success) {
        setMetrics(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
        Loading Agile performance metrics...
      </div>
    );
  }

  const { projectSummary, strategicMetrics, tacticalMetrics, operationalMetrics, epicsProgress, sprintVelocityHistory, teamStructure } = metrics;

  return (
    <div className="space-y-6">
      {/* Top Project Executive Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                {projectSummary.code}
              </span>
              <span className="bg-white/10 text-slate-300 text-xs px-2.5 py-0.5 rounded-full border border-white/15">
                {projectSummary.domain}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Managed: EdTech
              </span>
              <span className="text-slate-400 text-xs">
                PM: <strong>Gaurav Kumar</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
              {projectSummary.name}
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              <strong>Organization Vision:</strong> To provide innovative healthcare solutions that improve patient outcomes, enhance clinical workflows, and promote care coordination.
            </p>
          </div>

          {/* Sprints & Days Progress */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0">
            <div className="text-center px-2">
              <span className="text-2xs uppercase text-slate-400 font-bold block">Current Sprint</span>
              <span className="text-2xl font-black text-blue-400 font-mono">
                {projectSummary.currentSprint} <span className="text-xs text-slate-500">/ {projectSummary.totalSprints}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-white/15"></div>
            <div className="text-center px-2">
              <span className="text-2xs uppercase text-slate-400 font-bold block">Completion</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {projectSummary.overallCompletion}%
              </span>
            </div>
            <div className="h-8 w-px bg-white/15"></div>
            <div className="text-center px-2">
              <span className="text-2xs uppercase text-slate-400 font-bold block">Time-Bound</span>
              <span className="text-2xl font-black text-indigo-300 font-mono">
                20 <span className="text-xs text-slate-400">days</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex gap-2 mt-6 overflow-x-auto pt-4 border-t border-white/10 text-xs font-semibold">
          {[
            { id: 'metrics', label: 'Delivery Metrics (Strategic, Tactical, Operational)', icon: BarChart3 },
            { id: 'epics', label: '6 Epics & Sprint Roadmap', icon: Layers },
            { id: 'team', label: 'Team Structure & Toolchain (24 Staff)', icon: Users },
            { id: 'tenets', label: 'Agile Tenets & SMART Objectives', icon: Target },
            { id: 'bestPractices', label: 'Best Practices & Offshore Governance', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  active 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: DELIVERY METRICS */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-6">
          {/* Strategic Metrics Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" /> Strategic Level Metrics (Business Outcomes)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strategicMetrics.map((m, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                    <span className="text-2xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Target: {m.target} {m.unit}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{m.current}</span>
                    <span className="text-xs text-slate-500 font-semibold">{m.unit}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Metrics Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Tactical Level Metrics (Sprint & Release Performance)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tacticalMetrics.map((m, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-2xs text-slate-500 font-bold uppercase block">{m.name}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-slate-900">{m.current}</span>
                    <span className="text-2xs text-slate-400">{m.unit}</span>
                  </div>
                  <span className="text-2xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold inline-block">
                    Target: {m.target}
                  </span>
                  <p className="text-2xs text-slate-500 pt-1 border-t border-slate-100">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Metrics Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" /> Operational Level Engineering Metrics (CI/CD & Quality)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {operationalMetrics.map((m, i) => (
                <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="font-bold text-slate-800 text-xs block truncate" title={m.name}>{m.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-blue-700">{m.current}</span>
                    <span className="text-2xs text-slate-400">{m.unit}</span>
                  </div>
                  <span className="text-2xs text-slate-500 block">Target: {m.target}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Velocity History Bar Chart Simulation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Sprint Velocity Burn-up Trend (Sprints 1 to 14)</h4>
                <p className="text-xs text-slate-500">Story point commitment vs actual completed per sprint</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Average Velocity: 38.5 pts
              </span>
            </div>

            <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto border-b border-slate-200">
              {sprintVelocityHistory.map((s, idx) => {
                const heightPct = Math.round((s.completed / 50) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 min-w-[38px] group">
                    <span className="text-2xs font-bold text-slate-600 group-hover:text-blue-600 transition">
                      {s.completed}
                    </span>
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-blue-600 group-hover:bg-blue-700 rounded-t-md transition-all shadow-xs"
                      title={`${s.sprint}: ${s.completed} points completed (committed: ${s.commitment})`}
                    ></div>
                    <span className="text-2xs text-slate-400 font-mono truncate max-w-[42px] mt-1">
                      S{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: EPICS IN SCOPE */}
      {activeSubTab === 'epics' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs p-6 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Epics in Scope & Duration for Development</h3>
              <p className="text-xs text-slate-500">As specified in the Electronic Health Record System guidelines</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
              Total Duration: 20 Sprints Scope
            </span>
          </div>

          <div className="space-y-4">
            {epicsProgress.map((epic, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2.5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{epic.epic}</span>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Duration: {epic.plannedSprints} Sprints
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500">
                      Stories: <strong>{epic.storiesCompleted}</strong> / {epic.totalStories}
                    </span>
                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                      epic.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {epic.status} ({epic.completion}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${epic.completion}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      epic.completion === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TEAM STRUCTURE */}
      {activeSubTab === 'team' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Hierarchical Project Team Details & Tooling</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of roles, responsibilities, quantity, location (Onsite / Offshore), and tools used (Total: 24 personnel)
            </p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs uppercase">
                <tr>
                  <th className="p-3">Role</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Responsibilities & Key Tasks</th>
                  <th className="p-3">Tools Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamStructure.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{t.role}</td>
                    <td className="p-3 font-mono font-semibold text-blue-700">{t.count}</td>
                    <td className="p-3">
                      <span className="text-2xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                        {t.location}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 max-w-sm">{t.focus}</td>
                    <td className="p-3 font-mono text-2xs text-slate-600 font-semibold">{t.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: AGILE TENETS & SMART */}
      {activeSubTab === 'tenets' && (
        <div className="space-y-6">
          {/* SMART Objectives Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> SMART Objective for Electronic Health Record System
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <strong className="text-blue-900 block mb-1 uppercase text-2xs tracking-wider">Specific</strong>
                <p className="text-slate-700">Develop and implement a comprehensive, web-based Electronic Health Records (EHR) system to manage patient data, streamline clinical workflows, and improve care coordination.</p>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <strong className="text-emerald-900 block mb-1 uppercase text-2xs tracking-wider">Attainable</strong>
                <p className="text-slate-700">Attainable with dedicated 24-person cross-functional team, standardized HL7/FHIR interfaces, and proven healthcare architectures.</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <strong className="text-purple-900 block mb-1 uppercase text-2xs tracking-wider">Relevant</strong>
                <p className="text-slate-700">Directly aligns with organization's vision of providing innovative healthcare solutions and improving patient outcomes.</p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                <strong className="text-amber-900 block mb-1 uppercase text-2xs tracking-wider">Time-bound</strong>
                <p className="text-slate-700">Project milestone structured for delivery within 20 days across agile iterations.</p>
              </div>
            </div>
          </div>

          {/* Agile Tenets Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Need for Adopting Agile (Qualitative vs Quantitative Benefits)</h3>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-2xs uppercase">
                  <tr>
                    <th className="p-3">Key Agile Tenet</th>
                    <th className="p-3">Quantitative Benefits</th>
                    <th className="p-3">Qualitative Benefits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Customer collaboration over contract negotiation</td>
                    <td className="p-3 text-slate-700">+25% increase in customer satisfaction; -30% reduction in change requests and rework.</td>
                    <td className="p-3 text-slate-700">Enhanced trust through transparent communication; more relevant and valuable clinical features.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Responding to change over following a plan</td>
                    <td className="p-3 text-slate-700">+20% improved time-to-market; -15% reduction in unused features.</td>
                    <td className="p-3 text-slate-700">Increased agility to respond to clinical feedback; continuous innovation culture.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Working software over comprehensive documentation</td>
                    <td className="p-3 text-slate-700">+25% accelerated delivery of working increments; -20% reduced maintenance costs.</td>
                    <td className="p-3 text-slate-700">Early user feedback on working clinical screens; lean living documentation.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Individuals and interactions over processes and tools</td>
                    <td className="p-3 text-slate-700">+15% increased team productivity; -10% reduced turnover rate.</td>
                    <td className="p-3 text-slate-700">Enhanced creative problem solving; empowered onsite and offshore engineering teams.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: BEST PRACTICES & OFFSHORE GOVERNANCE */}
      {activeSubTab === 'bestPractices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Practices */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 7 Core Engineering & Agile Best Practices
            </h3>
            <ol className="space-y-2.5 text-xs text-slate-700 list-decimal list-inside">
              <li className="leading-relaxed"><strong>Involve key stakeholders</strong> (clinicians, nurses, lab techs) throughout development.</li>
              <li className="leading-relaxed"><strong>Prioritize user stories based on business value</strong> and deliver incrementally.</li>
              <li className="leading-relaxed"><strong>Implement a robust CI/CD pipeline</strong> to enable frequent deployments and maintain high code quality.</li>
              <li className="leading-relaxed"><strong>Conduct regular code reviews</strong> and automated static analysis (SonarQube) to catch defects early.</li>
              <li className="leading-relaxed"><strong>Perform comprehensive testing</strong> (unit, integration, and user acceptance testing).</li>
              <li className="leading-relaxed"><strong>Provide adequate training and support</strong> to healthcare end-users to ensure adoption.</li>
              <li className="leading-relaxed"><strong>Continuously monitor system performance</strong> and clinical feedback for iterative enhancements.</li>
            </ol>
          </div>

          {/* Onsite - Offshore Coordination Challenges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Onsite-Offshore & Contract Management
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-0.5">Time Zone Overlap:</span>
                <p className="text-amber-800">4-hour daily overlap window established between US onsite (PO, PM, Leads) and offshore delivery teams for stand-ups and unblocking.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="font-bold text-blue-900 block mb-0.5">Contract Type Alignment:</span>
                <p className="text-blue-800">Hybrid Fixed Price Per Sprint (FPP) with Time & Material (T&M) flexibility for evolving HL7/PACS compliance requirements.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Automated Quality Gates:</span>
                <p className="text-slate-700">Automated Jenkins/GitHub Actions pipeline enforces &gt;=85% code coverage and zero critical SonarQube bugs before merging.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
