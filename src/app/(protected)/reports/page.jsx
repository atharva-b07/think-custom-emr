'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, FileText, Download, ChevronDown, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { reports as initialReports } from '@/data/reportsData';
import { useAppContext } from '@/context/AppContext';
import Modal from '@/components/common/Modal';

export default function Reports() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('clinical');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRunModal, setShowRunModal] = useState(false);
  const [form, setForm] = useState({ reportName: '', reportType: '', periodFrom: '', periodTo: '' });

  const reports = state.reports || initialReports;
  const tabs = ['Clinical Reports', 'Financial Reports', 'Other Reports', 'Analytics'];

  const handleRunReport = () => {
    dispatch({ type: 'ADD_REPORT', payload: {
      id: Date.now(), reportName: form.reportName || 'New Report',
      reportType: form.reportType || 'Custom', period: `${form.periodFrom || 'N/A'} - ${form.periodTo || 'N/A'}`,
      runBy: 'Current User', dateRun: new Date().toISOString().split('T')[0], format: 'pdf',
    }});
    setShowRunModal(false);
    setForm({ reportName: '', reportType: '', periodFrom: '', periodTo: '' });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate and manage clinical and financial reports</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center border-b border-gray-200">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase())}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition cursor-pointer ${activeTab === tab.split(' ')[0].toLowerCase() ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <Calendar className="w-4 h-4 text-gray-400" /> Schedule Report
          </button>
          <button onClick={() => setShowRunModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
            <FileText className="w-4 h-4" /> Run Report
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-60 text-[13px] bg-gray-50/80 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition cursor-pointer"><Filter className="w-4 h-4" /></button>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer">
          <Download className="w-4 h-4 text-gray-400" /> Export <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr>
              {['Report Name','Report Type','Period','Run By','Date Run','Format'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.filter(r => r.reportName.toLowerCase().includes(searchQuery.toLowerCase())).map(report => (
              <tr key={report.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors duration-150">
                <td className="px-4 py-3"><span className="text-blue-600 font-semibold cursor-pointer hover:underline">{report.reportName}</span></td>
                <td className="px-4 py-3 text-gray-600">{report.reportType}</td>
                <td className="px-4 py-3 text-gray-600">{report.period}</td>
                <td className="px-4 py-3 text-gray-600">{report.runBy}</td>
                <td className="px-4 py-3 text-gray-600">{report.dateRun}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1 hover:bg-gray-100 rounded-md transition cursor-pointer" title="View PDF"><FileText className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-1 hover:bg-gray-100 rounded-md transition cursor-pointer" title="Download"><Download className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </td>
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

      <Modal isOpen={showRunModal} onClose={() => setShowRunModal(false)} title="Run Report" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/60 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">Configure and run a new report</p>
          </div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Report Name</label><input type="text" placeholder="Report name" value={form.reportName} onChange={e=>setForm(p=>({...p,reportName:e.target.value}))} className="input-field" /></div>
          <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Report Type</label><select value={form.reportType} onChange={e=>setForm(p=>({...p,reportType:e.target.value}))} className="input-field"><option value="">Select Type</option><option>Appointment Type</option><option>Encounter</option><option>Provider Performance</option><option>Sources of Patients</option><option>CPOE Order</option></select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Period From</label><input type="date" value={form.periodFrom} onChange={e=>setForm(p=>({...p,periodFrom:e.target.value}))} className="input-field" /></div>
            <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Period To</label><input type="date" value={form.periodTo} onChange={e=>setForm(p=>({...p,periodTo:e.target.value}))} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100"><button onClick={()=>setShowRunModal(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button><button onClick={handleRunReport} className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Run Report</button></div>
        </div>
      </Modal>
    </div>
  );
}
