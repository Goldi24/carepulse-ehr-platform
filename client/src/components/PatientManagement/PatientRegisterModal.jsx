import React, { useState } from 'react';
import { X, UserPlus, Shield, HeartPulse, AlertCircle, Check } from 'lucide-react';
import { api } from '../../api';

export default function PatientRegisterModal({ isOpen, onClose, onPatientCreated }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female',
    dob: '1985-05-15',
    phone: '+1 (555) ',
    email: '',
    street: '',
    city: '',
    state: 'IL',
    zip: '',
    emergencyName: '',
    emergencyRelation: 'Spouse',
    emergencyPhone: '',
    bloodGroup: 'O+',
    insuranceProvider: 'BlueCross BlueShield',
    policyNumber: 'POL-',
    groupNumber: 'GRP-100',
    coverageType: 'PPO',
    allergyName: '',
    allergySeverity: 'Moderate',
    allergyReaction: '',
    conditionName: '',
    conditionCode: 'I10'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dob: formData.dob,
        phone: formData.phone,
        email: formData.email,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelation,
          phone: formData.emergencyPhone
        },
        bloodGroup: formData.bloodGroup,
        insurance: {
          provider: formData.insuranceProvider,
          policyNumber: formData.policyNumber,
          groupNumber: formData.groupNumber,
          coverageType: formData.coverageType,
          status: 'Active',
          expirationDate: '2028-12-31'
        },
        allergies: formData.allergyName ? [
          {
            allergen: formData.allergyName,
            severity: formData.allergySeverity,
            reaction: formData.allergyReaction || 'Known sensitivity'
          }
        ] : [],
        chronicConditions: formData.conditionName ? [
          {
            code: formData.conditionCode,
            name: formData.conditionName,
            diagnosedDate: new Date().toISOString().split('T')[0]
          }
        ] : []
      };

      const res = await api.createPatient(payload);
      if (res.success) {
        setSuccessNotice('Patient successfully registered! HL7 ADT message dispatched.');
        setTimeout(() => {
          onPatientCreated(res.data);
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Failed to create patient');
      }
    } catch (err) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-200" />
            <div>
              <h2 className="text-lg font-bold">Register New Patient</h2>
              <p className="text-xs text-blue-200">Epic 1: Patient Management & Demographics (Sprints 1-3)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" /> Personal Demographics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Robert"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Miller"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. robert.miller@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address & Emergency Contact */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address & Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. 542 Michigan Ave"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Chicago"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="60601"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="e.g. Karen Miller"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Relation</label>
                <input
                  type="text"
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                  placeholder="Spouse / Parent"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Insurance Information */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Insurance Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Payer / Insurance Provider</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Policy / Member ID</label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Known Allergies & Conditions */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Allergies & Chronic Conditions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Allergy (e.g. Penicillin, Sulfa)</label>
                <input
                  type="text"
                  name="allergyName"
                  value={formData.allergyName}
                  onChange={handleChange}
                  placeholder="Leave empty if None"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Severity</label>
                <select
                  name="allergySeverity"
                  value={formData.allergySeverity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe (Anaphylaxis risk)">Severe (Anaphylaxis risk)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Allergy Reaction</label>
                <input
                  type="text"
                  name="allergyReaction"
                  value={formData.allergyReaction}
                  onChange={handleChange}
                  placeholder="e.g. Urticaria, dyspnea"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
            >
              {loading ? 'Registering...' : 'Register Patient & Broadcast HL7'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
