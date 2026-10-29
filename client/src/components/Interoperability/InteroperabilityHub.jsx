import React, { useState, useEffect } from 'react';
import { 
  Network, Server, RefreshCw, CheckCircle2, Terminal, 
  Code2, ExternalLink, ArrowRight, Activity, Database, Check, 
  Copy, Layers, Sparkles, ShieldCheck
} from 'lucide-react';
import { api } from '../../api';

export default function InteroperabilityHub() {
  const [systems, setSystems] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);
  const [loadingSystems, setLoadingSystems] = useState(false);
  const [activeTab, setActiveTab] = useState('systems'); // systems, hl7, fhir

  // HL7 state
  const [hl7Type, setHl7Type] = useState('ADT_A01');
  const [rawHl7, setRawHl7] = useState('');
  const [parsedHl7, setParsedHl7] = useState(null);
  const [customHl7Input, setCustomHl7Input] = useState('');
  const [customParseResult, setCustomParseResult] = useState(null);
  const [copiedHl7, setCopiedHl7] = useState(false);

  // FHIR state
  const [fhirEndpoint, setFhirEndpoint] = useState('/Patient');
  const [fhirJson, setFhirJson] = useState(null);
  const [loadingFhir, setLoadingFhir] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');
  const [copiedFhir, setCopiedFhir] = useState(false);

  const fetchIntegrations = async () => {
    setLoadingSystems(true);
    try {
      const [sysRes, logRes] = await Promise.all([
        api.getIntegrations(),
        api.getSyncLogs()
      ]);
      if (sysRes.success) setSystems(sysRes.data);
      if (logRes.success) setSyncLogs(logRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSystems(false);
    }
  };

  const loadHl7Sample = async (type) => {
    setHl7Type(type);
    try {
      const res = await api.getHl7Sample(type);
      if (res.success) {
        setRawHl7(res.rawMessage);
        setParsedHl7(res.parsed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadFhirData = async (endpoint) => {
    setFhirEndpoint(endpoint);
    setLoadingFhir(true);
    try {
      const json = await api.getFhirResource(endpoint);
      setFhirJson(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFhir(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    loadHl7Sample('ADT_A01');
    loadFhirData('/Patient');
  }, []);

  const handleTriggerSync = async (systemId) => {
    try {
      const res = await api.triggerSync(systemId);
      if (res.success) {
        setSyncNotice(`Sync handshake with ${systemId} completed successfully!`);
        setTimeout(() => setSyncNotice(''), 3000);
        fetchIntegrations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleParseCustomHL7 = async () => {
    if (!customHl7Input.trim()) return;
    try {
      const res = await api.parseHl7(customHl7Input);
      if (res.success) {
        setCustomParseResult(res.parsed);
      }
    } catch (e) {
      alert("Failed to parse HL7: " + e.message);
    }
  };

  const copyToClipboard = (text, type) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'hl7') {
      setCopiedHl7(true);
      setTimeout(() => setCopiedHl7(false), 2000);
    } else {
      setCopiedFhir(true);
      setTimeout(() => setCopiedFhir(false), 2000);
    }
  };

  const getSegmentDesc = (seg) => {
    const map = {
      MSH: 'Message Header',
      PID: 'Patient Identification',
      PV1: 'Patient Visit',
      OBR: 'Observation Request',
      OBX: 'Observation Result',
      RXE: 'Pharmacy / Treatment Order',
      DG1: 'Diagnosis'
    };
    return map[seg] || 'Standard Segment';
  };

  return (
    <div className="space-y-6">
      {/* Epic Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Epic 5 • Interoperability
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Healthcare Interoperability & Integration Hub
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bidirectional bridges for HL7 v2.5.1 messaging, HL7 FHIR R4 standard resources, and hospital IT connectors.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab('systems')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'systems' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              System Connectors
            </button>
            <button
              onClick={() => setActiveTab('hl7')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'hl7' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              HL7 v2 Gateway
            </button>
            <button
              onClick={() => setActiveTab('fhir')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'fhir' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              FHIR R4 REST API
            </button>
          </div>
        </div>

        {syncNotice && (
          <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{syncNotice}</span>
          </div>
        )}
      </div>

      {/* TAB 1: SYSTEM CONNECTORS */}
      {activeTab === 'systems' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((sys) => (
              <div key={sys.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 card-hover-subtle">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{sys.name}</span>
                      <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {sys.id}
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">{sys.protocol}</p>
                  </div>

                  <span className="flex items-center gap-1 text-2xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {sys.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs font-mono text-slate-600 break-all border border-slate-100">
                  Endpoint: {sys.endpoint}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-2xs text-slate-400 block font-medium">Roundtrip Latency</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{sys.latencyMs} ms</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-2xs text-slate-400 block font-medium">Total Records</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{sys.syncRecords}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-2xs text-slate-400 block font-medium">Last Sync Time</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                      {new Date(sys.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSync(sys.id)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition duration-150 shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Test Handshake & Trigger Sync
                </button>
              </div>
            ))}
          </div>

          {/* Real-time Sync Event Log */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-2xs">
                Real-Time Integration Event Log
              </span>
              <span className="text-slate-400 text-2xs font-mono">{syncLogs.length} events logged</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {syncLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                      {log.system}
                    </span>
                    <span className="text-slate-800 font-medium">{log.event}</span>
                  </div>
                  <span className="text-2xs text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HL7 V2 GATEWAY */}
      {activeTab === 'hl7' && (
        <div className="space-y-6">
          {/* HL7 Sample Message Generator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">HL7 v2.5.1 Message Generator & Dissector</h3>
                <p className="text-xs text-slate-500">Industry standard pipe-delimited healthcare transactions</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ADT_A01', label: 'ADT^A01 (Admit / Visit)' },
                  { id: 'ADT_A08', label: 'ADT^A08 (Patient Update)' },
                  { id: 'ORU_R01', label: 'ORU^R01 (Lab Result)' },
                  { id: 'RDE_O11', label: 'RDE^O11 (Pharmacy Order)' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => loadHl7Sample(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      hl7Type === m.id ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Raw Message Display with Copy Button */}
            <div className="bg-slate-950 text-slate-100 rounded-xl overflow-hidden font-mono text-xs border border-slate-800 shadow-inner">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-slate-400 text-2xs flex justify-between items-center">
                <span className="font-semibold">RAW PIPE-DELIMITED HL7 v2.5.1 ENCODED STRING</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-mono font-bold">STATUS: VALID ER7</span>
                  <button
                    onClick={() => copyToClipboard(rawHl7, 'hl7')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  >
                    {copiedHl7 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHl7 ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-emerald-400 whitespace-pre-wrap leading-relaxed select-all">
                {rawHl7}
              </pre>
            </div>

            {/* Segment Breakdown */}
            {parsedHl7 && parsedHl7.segments && (
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-2xs block mb-2">
                  Segment Dissector & Extracted Clinical Entities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                  {parsedHl7.segments.map((seg, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-700 font-mono text-sm">{seg.segment}</span>
                        <span className="text-2xs text-slate-400 font-medium">{getSegmentDesc(seg.segment)}</span>
                      </div>
                      <p className="text-2xs text-slate-500 mt-1">{seg.fields.length} Fields parsed</p>
                      <p className="text-2xs text-slate-700 font-mono truncate mt-0.5">{seg.fields.join('|')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive HL7 Custom Parser */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">HL7 Live Parsing Tool</h3>
            <p className="text-xs text-slate-500">Paste any external HL7 message string to test the parser engine</p>
            <textarea
              rows="4"
              value={customHl7Input}
              onChange={(e) => setCustomHl7Input(e.target.value)}
              placeholder="Paste raw HL7 string here (e.g. MSH|^~\&|EXT_SYS...)..."
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleParseCustomHL7}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
            >
              Parse HL7 Segments
            </button>

            {customParseResult && (
              <pre className="p-4 bg-slate-900 text-blue-300 rounded-xl text-xs font-mono overflow-x-auto max-h-60">
                {JSON.stringify(customParseResult, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FHIR R4 REST API EXPLORER */}
      {activeTab === 'fhir' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">HL7 FHIR Release 4 (R4) REST Explorer</h3>
                <p className="text-xs text-slate-500">Standard REST API endpoints serving application/fhir+json</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { path: '/Patient', label: 'GET /Patient' },
                  { path: '/Observation', label: 'GET /Observation' },
                  { path: '/MedicationRequest', label: 'GET /MedicationRequest' },
                  { path: '/DiagnosticReport', label: 'GET /DiagnosticReport' },
                  { path: '/$everything', label: 'GET /$everything' },
                  { path: '/metadata', label: 'GET /metadata (Capability)' }
                ].map(ep => (
                  <button
                    key={ep.path}
                    onClick={() => loadFhirData(ep.path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                      fhirEndpoint === ep.path ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active URL bar */}
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono">
              <span className="font-bold text-emerald-700">GET</span>
              <span className="text-slate-700">http://localhost:5000/api/fhir{fhirEndpoint}</span>
              <span className="ml-auto text-2xs text-slate-400">FHIR R4 JSON</span>
            </div>

            {/* JSON Output Viewer with Copy */}
            <div className="bg-slate-950 text-slate-100 rounded-xl overflow-hidden font-mono text-xs border border-slate-800 shadow-inner">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-slate-400 text-2xs flex justify-between items-center">
                <span>FHIR RESOURCE RESPONSE</span>
                <div className="flex items-center gap-3">
                  <span className="text-blue-400">
                    {fhirJson?.resourceType || 'Resource'} ({fhirJson?.total ? `${fhirJson.total} entries` : 'Single'})
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(fhirJson, null, 2), 'fhir')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  >
                    {copiedFhir ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFhir ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-blue-300 max-h-96 overflow-y-auto leading-relaxed select-all">
                {loadingFhir ? 'Querying FHIR server...' : JSON.stringify(fhirJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
