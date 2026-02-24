'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Calendar, List,
  Filter, FileText, Shield, MoreVertical, Plus, Link, Mail
} from 'lucide-react';
import { locations, rooms, appointmentTypes } from '@/data/schedulingData';
import Modal from '@/components/common/Modal';

export default function Scheduling() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newApptModal, setNewApptModal] = useState(false);
  const [instantModal, setInstantModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [appts, setAppts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.set('date', selectedDate);
      const res = await fetch(`/api/appointments?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAppts(data.appointments || []);
      }
    } catch {
      // Keep existing data
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const [newAppt, setNewAppt] = useState({
    eventType: 'Individual', mode: 'In-Person', patientName: '', location: '',
    room: '', provider: '', appointmentType: '', priority: '', date: '',
    repeat: false, paymentMode: 'Insurance', insurance: '', reason: '',
  });
  const [instantForm, setInstantForm] = useState({ email: '', note: '' });
  const [blockForm, setBlockForm] = useState({
    blockFor: '', location: '', day: '', startTime: '', endTime: '', repeat: false, reason: '',
  });

  const handleNewApptSubmit = async () => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: newAppt.patientId,
          providerName: newAppt.provider || 'Dr. Rebecca Shaw',
          location: newAppt.location || 'Location 1',
          room: newAppt.room || 'Room 1',
          date: newAppt.date || new Date().toISOString(),
          startTime: '09:00 AM',
          endTime: '09:30 AM',
          duration: '30 min',
          appointmentType: newAppt.appointmentType || 'New',
          visitType: newAppt.mode === 'Video Call' ? 'Virtual' : 'In-Person',
          reason: newAppt.reason,
        }),
      });
      if (res.ok) {
        setNewApptModal(false);
        setNewAppt({ eventType: 'Individual', mode: 'In-Person', patientName: '', location: '',
          room: '', provider: '', appointmentType: '', priority: '', date: '',
          repeat: false, paymentMode: 'Insurance', insurance: '', reason: '' });
        fetchAppointments();
      }
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your daily schedule and patient appointments</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
            <Plus className="w-4 h-4" /> Schedule Appointment <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg border border-gray-200 py-1 z-20" style={{ boxShadow: '0 10px 40px -4px rgba(0,0,0,0.1)' }}>
              {[{ label: 'New Appointment', fn: () => { setNewApptModal(true); setShowDropdown(false); } },
                { label: 'Instant Appointment', fn: () => { setInstantModal(true); setShowDropdown(false); } },
                { label: 'Block Appointment', fn: () => { setBlockModal(true); setShowDropdown(false); } }
              ].map(item => (
                <button key={item.label} onClick={item.fn} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition cursor-pointer">{item.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date Controls */}
      <div className="flex items-center justify-between bg-white border border-gray-200/80 rounded-lg px-4 py-2.5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer">Today</button>
          <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-1 hover:bg-gray-100 rounded-md transition cursor-pointer"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
          <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} className="p-1 hover:bg-gray-100 rounded-md transition cursor-pointer"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
          <span className="text-[13px] font-medium text-gray-700 flex items-center gap-1">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} <ChevronDown className="w-3 h-3 text-gray-400" /></span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition cursor-pointer"><Calendar className="w-4 h-4 text-gray-500" /></button>
          <button className="p-2 border border-gray-200 rounded-md bg-blue-50 text-blue-600 cursor-pointer"><List className="w-4 h-4" /></button>
          <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-1 transition cursor-pointer">Day <ChevronDown className="w-3 h-3 text-gray-400" /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        {/* Filters Sidebar */}
        <div className="w-60 shrink-0 bg-white border border-gray-200/80 rounded-xl p-4 space-y-3.5 self-start" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 text-gray-700 pb-2 border-b border-gray-100">
            <Filter className="w-4 h-4 text-gray-400" /><span className="text-[13px] font-bold">Filters</span>
          </div>
          {['Clinician', 'Location', 'Room', 'Status', 'Appointment Type', 'Eligibility'].map(f => (
            <div key={f}>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{f}</label>
              <select className="w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition">
                <option>Select</option>
                {f === 'Location' && locations.map(l => <option key={l}>{l}</option>)}
                {f === 'Room' && rooms.map(r => <option key={r}>{r}</option>)}
                {f === 'Appointment Type' && appointmentTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          ))}
          <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">Clear All Filters</button>
        </div>

        {/* Table */}
        <div className="flex-1 bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  {['', 'Location', 'Provider Name', 'Time', 'Appt Type', 'Intake Forms', 'Insurance', 'Patient Name', 'Actions'].map((h, i) => (
                    <th key={h || i} className={`${i === 0 ? 'w-10 px-3' : i === 5 || i === 6 ? 'text-center px-3' : 'text-left px-3'} py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200`}>
                      {i === 0 ? <input type="checkbox" className="rounded border-gray-300" /> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appts.map(apt => (
                  <tr key={apt.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150">
                    <td className="px-3 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-3 py-3"><div className="font-semibold text-gray-800 text-[13px]">{apt.location}</div>{apt.room && <div className="text-[11px] text-gray-400">{apt.room}</div>}</td>
                    <td className="px-3 py-3 text-gray-600">{apt.providerName}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap font-medium">{apt.time}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${apt.appointmentType === 'New' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50' : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/50'}`}>{apt.appointmentType}</span></td>
                    <td className="px-3 py-3 text-center"><FileText className={`w-4 h-4 mx-auto ${apt.intakeFormStatus === 'Completed' ? 'text-green-600' : 'text-amber-500'}`} /></td>
                    <td className="px-3 py-3 text-center"><Shield className={`w-4 h-4 mx-auto ${apt.insuranceEligibilityStatus === 'Verified' ? 'text-green-600' : 'text-red-500'}`} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-[11px] font-bold text-blue-600 ring-1 ring-blue-200/50">{apt.patientName.split(' ').map(n => n[0]).join('')}</div>
                        <div><div className="font-semibold text-gray-800 text-[13px]">{apt.patientName}</div><div className="text-[11px] text-gray-400">{apt.patientDOB} ({apt.patientAge}) ({apt.patientGender?.[0]})</div></div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 flex items-center gap-1 transition cursor-pointer"><FileText className="w-3 h-3" /> Start</button>
                        <button className="p-1 hover:bg-gray-100 rounded-md transition cursor-pointer"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={newApptModal} onClose={() => setNewApptModal(false)} title="Schedule New Appointment" size="xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/60 mb-1">
            <Calendar className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">Fill in appointment details to schedule a new visit</p>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1.5">Event Type</label><div className="flex gap-4">{['Individual','Group'].map(t=>(<label key={t} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="eventType" checked={newAppt.eventType===t} onChange={()=>setNewAppt(p=>({...p,eventType:t}))} className="text-blue-600" /><span className="text-[13px] text-gray-700">{t}</span></label>))}</div></div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1.5">Appointment Mode</label><div className="flex gap-4">{['In-Person','Video Call'].map(m=>(<label key={m} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="mode" checked={newAppt.mode===m} onChange={()=>setNewAppt(p=>({...p,mode:m}))} className="text-blue-600" /><span className="text-[13px] text-gray-700">{m}</span></label>))}</div></div>
          <div className="flex gap-3 items-end"><div className="flex-1"><label className="block text-[13px] font-medium text-gray-700 mb-1">Patient Name</label><input type="text" placeholder="Search Patient" value={newAppt.patientName} onChange={e=>setNewAppt(p=>({...p,patientName:e.target.value}))} className="input-field" /></div><button className="px-3 py-2 border border-blue-200 text-blue-600 rounded-lg text-[13px] font-medium hover:bg-blue-50 flex items-center gap-1 whitespace-nowrap transition cursor-pointer"><Plus className="w-4 h-4" /> New Patient</button></div>
          <div className="grid grid-cols-3 gap-3">{[{l:'Location',k:'location',o:locations},{l:'Room',k:'room',o:rooms},{l:'Provider',k:'provider',o:['Dr. Rebecca Shaw','Dr. James Carter','Dr. Priya Patel']}].map(f=>(<div key={f.k}><label className="block text-[13px] font-medium text-gray-700 mb-1">{f.l}</label><select value={newAppt[f.k]} onChange={e=>setNewAppt(p=>({...p,[f.k]:e.target.value}))} className="input-field"><option value="">Select {f.l}</option>{f.o.map(o=><option key={o} value={o}>{o}</option>)}</select></div>))}</div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[13px] font-medium text-gray-700 mb-1">Appointment Type</label><select value={newAppt.appointmentType} onChange={e=>setNewAppt(p=>({...p,appointmentType:e.target.value}))} className="input-field"><option value="">Select Type</option>{appointmentTypes.map(t=><option key={t} value={t}>{t}</option>)}</select></div><div><label className="block text-[13px] font-medium text-gray-700 mb-1">Priority</label><select value={newAppt.priority} onChange={e=>setNewAppt(p=>({...p,priority:e.target.value}))} className="input-field"><option value="">Select</option><option>Normal</option><option>Urgent</option><option>Emergency</option></select></div></div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Date & Time</label><input type="datetime-local" value={newAppt.date} onChange={e=>setNewAppt(p=>({...p,date:e.target.value}))} className="input-field" /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={newAppt.repeat} onChange={e=>setNewAppt(p=>({...p,repeat:e.target.checked}))} className="rounded border-gray-300 text-blue-600" /><span className="text-[13px] text-gray-700">Repeat</span></label>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1.5">Payment Mode</label><div className="flex gap-4">{['Self Pay','Insurance'].map(m=>(<label key={m} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="paymentMode" checked={newAppt.paymentMode===m} onChange={()=>setNewAppt(p=>({...p,paymentMode:m}))} className="text-blue-600" /><span className="text-[13px] text-gray-700">{m}</span></label>))}</div></div>
          {newAppt.paymentMode==='Insurance' && <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Insurance</label><select value={newAppt.insurance} onChange={e=>setNewAppt(p=>({...p,insurance:e.target.value}))} className="input-field"><option value="">Select Insurance</option><option>Blue Cross Blue Shield</option><option>Aetna</option><option>United Healthcare</option></select></div>}
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Reason For Visit</label><input type="text" placeholder="Reason" value={newAppt.reason} onChange={e=>setNewAppt(p=>({...p,reason:e.target.value}))} className="input-field" /></div>
          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button onClick={handleNewApptSubmit} className="px-5 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Schedule Appointment</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={instantModal} onClose={() => setInstantModal(false)} title="Instant Appointment" size="md">
        <div className="space-y-4">
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Enter Email Address or Search Client</label><input type="text" placeholder="Search Email, Client" value={instantForm.email} onChange={e=>setInstantForm(p=>({...p,email:e.target.value}))} className="input-field" /></div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Note</label><textarea rows={4} placeholder="Type Note" value={instantForm.note} onChange={e=>setInstantForm(p=>({...p,note:e.target.value}))} className="input-field resize-none" /></div>
          <div className="flex items-center gap-4 text-[13px]"><button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"><Link className="w-4 h-4" /> Copied Appointment URL</button><button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"><Mail className="w-4 h-4" /> Invite Via CustomEHR</button></div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100"><button onClick={()=>setInstantModal(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button><button className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Start Visit</button></div>
        </div>
      </Modal>

      <Modal isOpen={blockModal} onClose={() => setBlockModal(false)} title="Block Time" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[13px] font-medium text-gray-700 mb-1">Block Time For</label><select value={blockForm.blockFor} onChange={e=>setBlockForm(p=>({...p,blockFor:e.target.value}))} className="input-field"><option value="">Select</option><option>All Providers</option><option>Dr. Rebecca Shaw</option></select></div><div><label className="block text-[13px] font-medium text-gray-700 mb-1">Location</label><select value={blockForm.location} onChange={e=>setBlockForm(p=>({...p,location:e.target.value}))} className="input-field"><option value="">Select Location</option>{locations.map(l=><option key={l} value={l}>{l}</option>)}</select></div></div>
          <div className="grid grid-cols-3 gap-3"><div><label className="block text-[13px] font-medium text-gray-700 mb-1">Day</label><input type="date" value={blockForm.day} onChange={e=>setBlockForm(p=>({...p,day:e.target.value}))} className="input-field" /></div><div><label className="block text-[13px] font-medium text-gray-700 mb-1">Start Time</label><input type="time" value={blockForm.startTime} onChange={e=>setBlockForm(p=>({...p,startTime:e.target.value}))} className="input-field" /></div><div><label className="block text-[13px] font-medium text-gray-700 mb-1">End Time</label><input type="time" value={blockForm.endTime} onChange={e=>setBlockForm(p=>({...p,endTime:e.target.value}))} className="input-field" /></div></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={blockForm.repeat} onChange={e=>setBlockForm(p=>({...p,repeat:e.target.checked}))} className="rounded border-gray-300 text-blue-600" /><span className="text-[13px] text-gray-700">Repeat</span></label>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Reason For Block</label><input type="text" placeholder="Reason" value={blockForm.reason} onChange={e=>setBlockForm(p=>({...p,reason:e.target.value}))} className="input-field" /></div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100"><button onClick={()=>setBlockModal(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button><button className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Save</button></div>
        </div>
      </Modal>
    </div>
  );
}
