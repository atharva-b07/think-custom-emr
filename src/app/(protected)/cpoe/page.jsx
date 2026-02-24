'use client';

import { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, Pill } from 'lucide-react';
import { prescriptions as initialRx, stats } from '@/data/cpoeData';
import { useAppContext } from '@/context/AppContext';
import Modal from '@/components/common/Modal';

const requestTypeColors = {
  Change: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
  Renewal: 'bg-green-50 text-green-700 ring-1 ring-green-200/50',
  Pending: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/50',
  Refill: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/50',
};
const statusColors = {
  'Partially Approved': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
  Completed: 'bg-green-50 text-green-700 ring-1 ring-green-200/50',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50',
};
const statBorderColors = { yellow: 'border-l-amber-400', blue: 'border-l-blue-400', red: 'border-l-red-400', green: 'border-l-green-400' };

export default function CPOE() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('e-prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: '', requestType: '', medication: '', pharmacy: '', provider: '' });

  const prescriptions = state.prescriptions || initialRx;

  const handleSave = () => {
    dispatch({ type: 'ADD_PRESCRIPTION', payload: {
      id: Date.now(), prescriptionId: `RX-${10260 + Math.floor(Math.random() * 100)}`,
      requestType: form.requestType || 'Pending', dateTime: new Date().toLocaleDateString(),
      patientName: form.patientName || 'New Patient', totalMedication: 1,
      overallStatus: 'Pending', from: form.provider || 'Dr. Provider', pharmacy: form.pharmacy || 'CVS Pharmacy',
    }});
    setShowModal(false);
    setForm({ patientName: '', requestType: '', medication: '', pharmacy: '', provider: '' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center border-b border-gray-200">
          {['E-Prescriptions', 'Lab Order', 'Imaging Order', 'Prior Authorization'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition cursor-pointer ${activeTab === tab.toLowerCase().replace(/\s+/g, '-') ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
          <Plus className="w-4 h-4" /> Add Prescription <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-xl border border-gray-200/80 border-l-4 ${statBorderColors[s.color]} p-4 hover:shadow-md transition-all duration-200`} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search prescriptions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-gray-50/80 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition cursor-pointer"><Filter className="w-4 h-4" /></button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr>
              {['Prescription ID','Request Type','Date & Time','Patient Name','Total Medication','Overall Status','From','Pharmacy'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prescriptions.filter(p => p.patientName.toLowerCase().includes(searchQuery.toLowerCase())).map(rx => (
              <tr key={rx.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150">
                <td className="px-4 py-3"><span className="text-blue-600 font-semibold cursor-pointer hover:underline">{rx.prescriptionId}</span></td>
                <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${requestTypeColors[rx.requestType] || 'bg-gray-50 text-gray-600'}`}>{rx.requestType}</span></td>
                <td className="px-4 py-3 text-gray-600">{rx.dateTime}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-[11px] font-bold text-blue-600 ring-1 ring-blue-200/50">{rx.patientName.split(' ').map(n=>n[0]).join('')}</div>
                    <span className="text-gray-800 font-medium">{rx.patientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-gray-50 rounded-full text-[11px] font-semibold text-gray-600 ring-1 ring-gray-200/50">{rx.totalMedication} meds</span></td>
                <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[rx.overallStatus] || 'bg-gray-50 text-gray-600'}`}>{rx.overallStatus}</span></td>
                <td className="px-4 py-3 text-gray-600">{rx.from}</td>
                <td className="px-4 py-3 text-gray-600">{rx.pharmacy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Prescription" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/60 mb-1">
            <Pill className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">Enter prescription details for the patient</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Patient Name</label><input type="text" placeholder="Search patient" value={form.patientName} onChange={e=>setForm(p=>({...p,patientName:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Request Type</label><select value={form.requestType} onChange={e=>setForm(p=>({...p,requestType:e.target.value}))} className="input-field"><option value="">Select</option><option>Change</option><option>Renewal</option><option>Pending</option><option>Refill</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Provider</label><input type="text" placeholder="Provider" value={form.provider} onChange={e=>setForm(p=>({...p,provider:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Pharmacy</label><input type="text" placeholder="Pharmacy" value={form.pharmacy} onChange={e=>setForm(p=>({...p,pharmacy:e.target.value}))} className="input-field" /></div>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Medication</label><input type="text" placeholder="Medication name" value={form.medication} onChange={e=>setForm(p=>({...p,medication:e.target.value}))} className="input-field" /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100"><button onClick={()=>setShowModal(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button><button onClick={handleSave} className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Save Prescription</button></div>
        </div>
      </Modal>
    </div>
  );
}
