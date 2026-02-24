'use client';

import { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight, MoreVertical, Plus, Receipt } from 'lucide-react';
import { billingStats, encounters as initialEnc, claims as initialClaims } from '@/data/billingData';
import { useAppContext } from '@/context/AppContext';
import Modal from '@/components/common/Modal';

const statusColors = {
  Accepted: 'bg-green-50 text-green-700 ring-1 ring-green-200/50',
  Rejected: 'bg-red-50 text-red-600 ring-1 ring-red-200/50',
  Closed: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200/50',
  'Re-submitted': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/50',
  Submitted: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
  'Secondary Claim': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
  'Partial - Paid': 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/50',
};
const billedAsColors = {
  Primary: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
  Secondary: 'bg-green-50 text-green-700 ring-1 ring-green-200/50',
};

export default function Billing() {
  const { state, dispatch } = useAppContext();
  const [activeCard, setActiveCard] = useState('encounters');
  const [activePayTab, setActivePayTab] = useState('insurance');
  const [activeSubTab, setActiveSubTab] = useState('encounter-list');
  const [claimsTab, setClaimsTab] = useState('claims');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ patientName: '', dateOfService: '', provider: '', reason: '', coverage: '' });

  const encounters = state.encounters || initialEnc;
  const claims = state.claims || initialClaims;

  const handleAddEncounter = () => {
    dispatch({ type: 'ADD_ENCOUNTER', payload: {
      id: Date.now(), dateOfService: form.dateOfService || new Date().toISOString().split('T')[0],
      patientName: form.patientName || 'New Patient', insuranceCoverage: form.coverage || 'In-Network',
      renderingProvider: form.provider || 'Dr. Provider', reasonForVisit: form.reason || 'General Visit',
      placeOfService: 'Office', appointmentType: 'New',
    }});
    setShowAddModal(false);
    setForm({ patientName: '', dateOfService: '', provider: '', reason: '', coverage: '' });
  };

  const showEncounters = activeCard === 'encounters';
  const showClaims = activeCard === 'claims';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage encounters, claims, and billing workflows</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-3">
        {billingStats.map(s => (
          <div key={s.key} onClick={() => setActiveCard(s.key)}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              activeCard === s.key ? 'border-blue-400 border-l-4 border-l-blue-500 shadow-md' : 'border-gray-200/80'
            }`} style={{ boxShadow: activeCard !== s.key ? '0 1px 3px rgba(0,0,0,0.04)' : undefined }}>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${activeCard === s.key ? 'text-blue-600' : 'text-gray-800'}`}>{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Encounters View */}
      {showEncounters && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center border-b border-gray-200">
              {['Insurance Pay', 'Self Pay'].map(tab => (
                <button key={tab} onClick={() => setActivePayTab(tab.toLowerCase().replace(' ', '-'))}
                  className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition cursor-pointer ${activePayTab === tab.toLowerCase().replace(' ', '-') ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
              <Plus className="w-4 h-4" /> Add Encounter
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-50/80 rounded-lg p-1 w-fit border border-gray-200/60">
            {['Encounter List', 'Scrub Encounter', 'Ready to Submit', 'Clearing House Response'].map(sub => (
              <button key={sub} onClick={() => setActiveSubTab(sub.toLowerCase().replace(/\s+/g, '-'))}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition cursor-pointer ${activeSubTab === sub.toLowerCase().replace(/\s+/g, '-') ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}>{sub}</button>
            ))}
            <button className="ml-1 p-1.5 border border-gray-200 rounded-md hover:bg-white transition cursor-pointer"><Filter className="w-3.5 h-3.5 text-gray-400" /></button>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th className="w-10 px-3 py-3 bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
                  {['Date of Service','Patient Name','Insurance Coverage','Rendering Provider','Reason for Visit','Place of Service','Appointment Type'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">{h}</th>
                  ))}
                  <th className="w-10 px-3 py-3 bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200"></th>
                </tr>
              </thead>
              <tbody>
                {encounters.map(enc => (
                  <tr key={enc.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150">
                    <td className="px-3 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-3 text-gray-600">{enc.dateOfService}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-[11px] font-bold text-blue-600 ring-1 ring-blue-200/50">{enc.patientName.split(' ').map(n=>n[0]).join('')}</div>
                        <span className="font-medium text-gray-800">{enc.patientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${enc.insuranceCoverage === 'In-Network' ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50' : 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/50'}`}>{enc.insuranceCoverage}</span></td>
                    <td className="px-4 py-3 text-gray-600">{enc.renderingProvider}</td>
                    <td className="px-4 py-3 text-gray-600">{enc.reasonForVisit}</td>
                    <td className="px-4 py-3 text-gray-600">{enc.placeOfService}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-600 ring-1 ring-gray-200/50">{enc.appointmentType}</span></td>
                    <td className="px-3 py-3"><button className="p-1 hover:bg-gray-100 rounded-md transition cursor-pointer"><MoreVertical className="w-4 h-4 text-gray-400" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100/60">
              <span className="text-xs text-gray-500 font-medium">Page 1 of 10</span>
              <div className="flex items-center gap-0.5">
                <button className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md flex items-center gap-1 transition cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /> Previous</button>
                {[1,2,3].map(n => <button key={n} className={`px-2.5 py-1.5 text-xs rounded-md transition cursor-pointer ${n===1?'bg-blue-600 text-white font-semibold shadow-sm':'text-gray-600 hover:bg-gray-100'}`}>{n}</button>)}
                <span className="px-1.5 text-xs text-gray-400">...</span>
                {[8,9,10].map(n => <button key={n} className="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer">{n}</button>)}
                <button className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md flex items-center gap-1 transition cursor-pointer">Next <ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claims View */}
      {showClaims && (
        <div className="space-y-4">
          <div className="flex items-center border-b border-gray-200">
            {['Claims', 'Submitted Claims'].map(tab => (
              <button key={tab} onClick={() => setClaimsTab(tab.toLowerCase().replace(' ', '-'))}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition cursor-pointer ${claimsTab === tab.toLowerCase().replace(' ', '-') ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
            ))}
            <div className="ml-auto"><button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"><Filter className="w-4 h-4 text-gray-400" /></button></div>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th className="w-10 px-3 py-3 bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200"><input type="checkbox" className="rounded border-gray-300" /></th>
                  {['Claim ID','Bill Date','Date of Service','Patient Name','Payer Name','Rendering Provider','Billed As','Insurance Amount ($)','Status','Updated'].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150">
                    <td className="px-3 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-3 py-3 font-semibold text-gray-800">{c.claimId}</td>
                    <td className="px-3 py-3 text-gray-600">{c.billDate}</td>
                    <td className="px-3 py-3 text-gray-600">{c.dateOfService}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-[11px] font-bold text-blue-600 ring-1 ring-blue-200/50">{c.patientName.split(' ').map(n=>n[0]).join('')}</div>
                        <span className="font-medium text-gray-800">{c.patientName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{c.payerName}</td>
                    <td className="px-3 py-3 text-gray-600">{c.renderingProvider}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${billedAsColors[c.billedAs] || 'bg-gray-50 text-gray-600'}`}>{c.billedAs}</span></td>
                    <td className="px-3 py-3 text-gray-800 font-semibold">{c.insuranceAmount}</td>
                    <td className="px-3 py-3"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[c.status] || 'bg-gray-50 text-gray-600'}`}>{c.status}</span></td>
                    <td className="px-3 py-3 text-gray-500 text-[11px]">{c.updatedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100/60">
              <span className="text-xs text-gray-500 font-medium">Page 1 of 10</span>
              <div className="flex items-center gap-0.5">
                <button className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md flex items-center gap-1 transition cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /> Previous</button>
                {[1,2,3].map(n => <button key={n} className={`px-2.5 py-1.5 text-xs rounded-md transition cursor-pointer ${n===1?'bg-blue-600 text-white font-semibold shadow-sm':'text-gray-600 hover:bg-gray-100'}`}>{n}</button>)}
                <span className="px-1.5 text-xs text-gray-400">...</span>
                {[8,9,10].map(n => <button key={n} className="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer">{n}</button>)}
                <button className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md flex items-center gap-1 transition cursor-pointer">Next <ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showEncounters && !showClaims && (
        <div className="bg-white border border-gray-200/80 rounded-xl p-12 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <p className="text-gray-400 text-sm">Select Encounter of Billing or Claims above to view data.</p>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Encounter" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/60 mb-1">
            <Receipt className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">Enter encounter details for billing</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Patient Name</label><input type="text" placeholder="Patient name" value={form.patientName} onChange={e=>setForm(p=>({...p,patientName:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Date of Service</label><input type="date" value={form.dateOfService} onChange={e=>setForm(p=>({...p,dateOfService:e.target.value}))} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Rendering Provider</label><input type="text" placeholder="Provider" value={form.provider} onChange={e=>setForm(p=>({...p,provider:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Insurance Coverage</label><select value={form.coverage} onChange={e=>setForm(p=>({...p,coverage:e.target.value}))} className="input-field"><option value="">Select</option><option>In-Network</option><option>Out-of-Network</option></select></div>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Reason for Visit</label><input type="text" placeholder="Reason" value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} className="input-field" /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100"><button onClick={()=>setShowAddModal(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button><button onClick={handleAddEncounter} className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Add Encounter</button></div>
        </div>
      </Modal>
    </div>
  );
}
