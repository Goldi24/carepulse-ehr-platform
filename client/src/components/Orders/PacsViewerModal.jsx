import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Contrast, Eye, Layers, ShieldCheck, Download } from 'lucide-react';

export default function PacsViewerModal({ order, isOpen, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [invertContrast, setInvertContrast] = useState(false);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 text-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-800 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* PACS Top Bar */}
        <div className="bg-slate-900 px-6 py-3.5 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              PACS DICOM Web
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">{order.testName}</h2>
              <p className="text-2xs text-slate-400 font-mono">
                Order ID: {order.id} • Patient: {order.patientId} • LOINC: {order.loincCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 15, 180))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 15, 60))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setInvertContrast(!invertContrast)}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                invertContrast ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Invert Window / Contrast"
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Simulation */}
        <div className="p-6 flex-1 flex flex-col md:flex-row gap-6 overflow-y-auto">
          {/* Simulated DICOM Radiograph Display */}
          <div className="flex-1 bg-black rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[360px] overflow-hidden select-none">
            {/* Viewport Metadata HUD */}
            <div className="absolute top-3 left-3 text-2xs font-mono text-emerald-400 space-y-0.5 pointer-events-none">
              <p>STU: {order.id}</p>
              <p>MODALITY: DX (DIGITAL X-RAY)</p>
              <p>KVP: 120 | MAS: 4.5</p>
            </div>
            <div className="absolute top-3 right-3 text-2xs font-mono text-emerald-400 text-right pointer-events-none">
              <p>ZOOM: {zoomLevel}%</p>
              <p>WW: 400 | WL: 40</p>
              <p>STATUS: FINAL VERIFIED</p>
            </div>

            {/* Simulated High-Res Medical Anatomy Vector Canvas */}
            <div 
              style={{ 
                transform: `scale(${zoomLevel / 100})`, 
                filter: invertContrast ? 'invert(1) hue-rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease'
              }}
              className="w-64 h-64 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-inner"
            >
              <Layers className="w-24 h-24 text-slate-400 stroke-1 animate-pulse" />
              <div className="mt-3 text-center">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-widest block font-bold">
                  Chest PA / LAT Study
                </span>
                <span className="text-2xs font-mono text-slate-500">
                  DICOM 3.0 Standard • Verified Lossless Transfer
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 text-2xs font-mono text-slate-400 pointer-events-none">
              PACS ARCHIVE: STU-99201-US-EAST • 2048x2048 16-bit
            </div>
          </div>

          {/* Radiology Report Card */}
          <div className="w-full md:w-80 space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-2xs font-bold uppercase text-slate-400 tracking-wider block">
                Radiologist Findings & Impression
              </span>
              <p className="text-slate-200 leading-relaxed font-sans text-xs">
                {order.radiologistImpression || "No infiltrates or consolidations seen. Normal cardiothoracic ratio. Lungs demonstrate hyperinflation compatible with mild reactive airway disease."}
              </p>
              <div className="pt-2 border-t border-slate-800 text-2xs text-slate-400 flex items-center justify-between">
                <span>Interpreting Radiologist:</span>
                <span className="font-semibold text-white">Dr. K. Patel, MD</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-2xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider block">DICOM Study Attributes</span>
              <div className="space-y-1 text-slate-300">
                <p>Accession: ACC-{order.id.replace('ORD-', '')}</p>
                <p>SOP Instance UID: 1.2.840.10008.5.1.4.1.1.1</p>
                <p>Transfer Syntax: Explicit VR Little Endian</p>
                <p>Study Date: {new Date(order.orderDate).toISOString().split('T')[0]}</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-2xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full DICOM Web WADO-RS PACS integration active and synchronized.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
