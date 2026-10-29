import React, { useState, useEffect } from 'react';
import { 
  Calendar, MessageSquare, Pill, Activity, Clock, Plus, 
  Send, User, Shield, CheckCircle2, ChevronRight, AlertCircle, Check 
} from 'lucide-react';
import { api } from '../../api';

export default function PatientPortalView() {
  const patientId = 'PAT-1001'; // Eleanor Vance
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [medications, setMedications] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const [orders, setOrders] = useState([]);

  // Subtabs inside Portal
  const [portalTab, setPortalTab] = useState('summary'); // summary, appointments, messages, records

  // Appointment Booking State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookDoctor, setBookDoctor] = useState('Dr. Rachel Adams, MD');
  const [bookDept, setBookDept] = useState('Internal Medicine');
  const [bookType, setBookType] = useState('In-Person');
  const [bookDate, setBookDate] = useState('2026-11-20T10:00');
  const [bookReason, setBookReason] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');

  // Messaging State
  const [newMsgSubject, setNewMsgSubject] = useState('');
  const [newMsgBody, setNewMsgBody] = useState('');
  const [replyBody, setReplyBody] = useState({});
  const [msgSuccess, setMsgSuccess] = useState('');

  const fetchPatientData = async () => {
    try {
      const [patRes, aptRes, msgRes, medRes, encRes, ordRes] = await Promise.all([
        api.getPatientById(patientId),
        api.getAppointments(patientId),
        api.getMessages(patientId),
        api.getMedications({ patientId }),
        api.getEncounters(patientId),
        api.getOrders({ patientId })
      ]);

      if (patRes.success) setPatient(patRes.data);
      if (aptRes.success) setAppointments(aptRes.data);
      if (msgRes.success) setMessages(msgRes.data);
      if (medRes.success) setMedications(medRes.data);
      if (encRes.success) setEncounters(encRes.data);
      if (ordRes.success) setOrders(ordRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.bookAppointment({
        patientId,
        providerName: bookDoctor,
        department: bookDept,
        type: bookType,
        dateTime: new Date(bookDate).toISOString(),
        reason: bookReason || 'Routine consultation'
      });
      if (res.success) {
        setBookSuccess('Appointment scheduled successfully!');
        setTimeout(() => {
          setBookSuccess('');
          setIsBookModalOpen(false);
          fetchPatientData();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsgBody.trim()) return;
    try {
      const res = await api.sendMessage({
        patientId,
        sender: `${patient?.firstName} ${patient?.lastName} (Patient)`,
        recipient: 'Dr. Rachel Adams, MD',
        subject: newMsgSubject || 'General Inquiry',
        body: newMsgBody
      });
      if (res.success) {
        setNewMsgSubject('');
        setNewMsgBody('');
        setMsgSuccess('Message sent to care team!');
        setTimeout(() => setMsgSuccess(''), 2500);
        fetchPatientData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
              {patient?.firstName?.charAt(0)}{patient?.lastName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-2xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  Patient Health Portal
                </span>
                <span className="text-blue-200 text-xs font-mono">
                  {patient?.mrn}
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1">
                Welcome back, {patient?.firstName} {patient?.lastName}
              </h1>
              <p className="text-xs text-blue-100 mt-0.5">
                Primary Care: Dr. Rachel Adams, MD • Next visit in 27 days
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md transition"
          >
            <Calendar className="w-4 h-4" />
            Book New Appointment
          </button>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex gap-2 mt-6 overflow-x-auto pt-4 border-t border-white/15 text-xs font-semibold">
          {[
            { id: 'summary', label: 'Health Summary', icon: Activity },
            { id: 'appointments', label: `My Appointments (${appointments.length})`, icon: Calendar },
            { id: 'messages', label: `Secure Messages (${messages.length})`, icon: MessageSquare },
            { id: 'records', label: 'Prescriptions & Labs', icon: Pill },
          ].map(tab => {
            const Icon = tab.icon;
            const active = portalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPortalTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  active 
                    ? 'bg-white text-blue-800 shadow-sm' 
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: HEALTH SUMMARY */}
      {portalTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Vitals Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Latest Health Readings
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Blood Pressure</span>
                <span className="font-bold text-slate-900 text-sm">138 / 86 <span className="text-2xs font-normal text-slate-500">mmHg</span></span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Resting Heart Rate</span>
                <span className="font-bold text-slate-900 text-sm">74 <span className="text-2xs font-normal text-slate-500">bpm</span></span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Hemoglobin A1c</span>
                <span className="font-bold text-blue-700 text-sm">6.9 %</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Body Mass Index (BMI)</span>
                <span className="font-bold text-slate-900 text-sm">28.8</span>
              </div>
            </div>
          </div>

          {/* Active Medications Preview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-indigo-600" /> Active Prescriptions
            </h3>
            <div className="space-y-2 text-xs">
              {medications.filter(m => m.status === 'Active').map(m => (
                <div key={m.id} className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{m.drugName}</span>
                    <span className="text-indigo-700 font-semibold text-2xs">{m.dosage}</span>
                  </div>
                  <p className="text-2xs text-slate-500 mt-1">{m.frequency}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Known Allergies & Insurance Info */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Safety & Insurance Card
            </h3>
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-rose-800 block text-2xs uppercase tracking-wider">Allergies on File</span>
              {patient?.allergies?.map((a, i) => (
                <p key={i} className="text-rose-900 font-semibold">• {a.allergen} ({a.reaction})</p>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 text-2xs block uppercase tracking-wider">Coverage</span>
              <p className="font-bold text-slate-900">{patient?.insurance?.provider}</p>
              <p className="text-slate-600 text-2xs font-mono">{patient?.insurance?.policyNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: APPOINTMENTS */}
      {portalTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Your Appointments</h3>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Book Appointment
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="p-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{apt.reason}</span>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {apt.type}
                      </span>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {apt.providerName} • {apt.department}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <p className="font-semibold text-slate-800">
                    {new Date(apt.dateTime).toLocaleDateString()} at {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span className="text-2xs text-slate-400">Confirmation: #{apt.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SECURE MESSAGING */}
      {portalTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message Thread List */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Conversation with Care Team</h3>
            
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{msg.subject}</span>
                    <span className="text-2xs text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                    {msg.body}
                  </p>

                  {/* Provider Replies */}
                  {msg.replies && msg.replies.map(rep => (
                    <div key={rep.id} className="ml-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-bold text-blue-900 text-2xs">
                        <span>{rep.sender}</span>
                        <span className="text-slate-400 font-normal">
                          {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700">{rep.body}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Compose New Message Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" /> Send Message
            </h3>
            {msgSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{msgSuccess}</span>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">To Provider</label>
                <input
                  type="text"
                  readOnly
                  value="Dr. Rachel Adams, MD (Internal Medicine)"
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newMsgSubject}
                  onChange={(e) => setNewMsgSubject(e.target.value)}
                  placeholder="e.g. Question about medication dosage"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows="4"
                  required
                  value={newMsgBody}
                  onChange={(e) => setNewMsgBody(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 4: RECORDS & LABS */}
      {portalTab === 'records' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Laboratory & Diagnostic Reports</h3>
            {orders.map(ord => (
              <div key={ord.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{ord.testName}</span>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {ord.status}
                  </span>
                </div>
                <p className="text-2xs text-slate-500">Ordered: {new Date(ord.orderDate).toLocaleDateString()} by {ord.orderedBy}</p>
                {ord.results && ord.results.map((r, i) => (
                  <div key={i} className="flex justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-800">{r.test}</span>
                    <span className="font-bold text-slate-900">{r.value} {r.unit} ({r.flag})</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-sm">Book an Appointment</h2>
              <button onClick={() => setIsBookModalOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-3 text-xs">
              {bookSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{bookSuccess}</span>
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor / Provider</label>
                <select
                  value={bookDoctor}
                  onChange={(e) => setBookDoctor(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Dr. Rachel Adams, MD">Dr. Rachel Adams, MD (Internal Medicine)</option>
                  <option value="Dr. Marcus Vance, MD">Dr. Marcus Vance, MD (Pulmonology)</option>
                  <option value="Dr. Sophia Rivera, MD">Dr. Sophia Rivera, MD (General Surgery)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="In-Person">In-Person Clinic Visit</option>
                  <option value="Telehealth">Telehealth Video Visit</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Visit</label>
                <input
                  type="text"
                  required
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  placeholder="e.g. Medication review, follow-up"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
