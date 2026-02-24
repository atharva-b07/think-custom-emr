'use client';

import { useState } from 'react';
import { Filter, Plus, ChevronLeft, ChevronRight, User, ArrowRightLeft } from 'lucide-react';
import { referrals as initialRefs } from '@/data/referralData';
import { useAppContext } from '@/context/AppContext';
import Modal from '@/components/common/Modal';

const statusColors = {
  Pending: 'text-orange-600 font-semibold',
  Completed: 'text-green-600 font-semibold',
  'To Be Previewed': 'text-blue-600 font-semibold',
};

export default function Referral() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('out');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: '', phone: '', email: '', fromName: '', toName: '', toSpecialty: '', date: '' });

  const referrals = state.referrals || initialRefs;

  const handleSave = () => {
    dispatch({ type: 'ADD_REFERRAL', payload: {
      id: Date.now(), patientName: form.patientName || 'New Patient', phone: form.phone || '(555) 000-0000',
      email: form.email || 'patient@email.com', referralFromName: form.fromName || 'Dr. Provider',
      referralFromType: 'Primary Provider', referralToName: form.toName || 'Dr. Specialist',
      referralToSpecialty: form.toSpecialty || 'General', date: form.date || new Date().toISOString().split('T')[0],
      responseStatus: 'Pending',
    }});
    setShowModal(false);
    setForm({ patientName: '', phone: '', email: '', fromName: '', toName: '', toSpecialty: '', date: '' });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Referral</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track and manage patient referrals</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center border-b border-gray-200">
          {[{ key: 'out', label: 'Referral Out' }, { key: 'in', label: 'Referral In' }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition cursor-pointer ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition cursor-pointer"><Filter className="w-4 h-4" /></button>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
            <Plus className="w-4 h-4" /> Add Referral Out
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr>
              {['Patient Name','Contact','Referral From','Referral To','Date','Response Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">{h}</th>
              ))}
              <th className="w-10 px-3 py-3 bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(ref => (
              <tr key={ref.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center ring-1 ring-gray-200/50"><User className="w-4 h-4 text-gray-500" /></div>
                    <span className="font-semibold text-gray-800">{ref.patientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><div className="text-gray-700">{ref.phone}</div><div className="text-[11px] text-gray-400">{ref.email}</div></td>
                <td className="px-4 py-3"><div className="text-gray-800 font-medium">{ref.referralFromName}</div><div className="text-[11px] text-gray-400">{ref.referralFromType}</div></td>
                <td className="px-4 py-3"><div className="text-gray-800 font-medium">{ref.referralToName}</div><div className="text-[11px] text-gray-400">{ref.referralToSpecialty}</div></td>
                <td className="px-4 py-3 text-gray-600">{ref.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${ref.responseStatus === 'Completed' ? 'bg-green-500' : ref.responseStatus === 'Pending' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                    <span className={statusColors[ref.responseStatus] || 'text-gray-600'}>{ref.responseStatus}</span>
                  </div>
                </td>
                <td className="px-3 py-3"><button className="text-gray-400 hover:text-gray-600 cursor-pointer">...</button></td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Referral Out" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/60 mb-1">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">Enter referral details for the patient</p>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Patient Name</label><input type="text" placeholder="Patient name" value={form.patientName} onChange={e=>setForm(p=>({...p,patientName:e.target.value}))} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Phone</label><input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} className="input-field" /></div>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Referral From</label><input type="text" placeholder="Provider name" value={form.fromName} onChange={e=>setForm(p=>({...p,fromName:e.target.value}))} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Referral To</label><input type="text" placeholder="Specialist name" value={form.toName} onChange={e=>setForm(p=>({...p,toName:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Specialty</label><input type="text" placeholder="Cardiology, Neurology..." value={form.toSpecialty} onChange={e=>setForm(p=>({...p,toSpecialty:e.target.value}))} className="input-field" /></div>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Date</label><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} className="input-field" /></div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100"><button onClick={()=>setShowModal(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button><button onClick={handleSave} className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Add Referral</button></div>
        </div>
      </Modal>
    </div>
  );
}
