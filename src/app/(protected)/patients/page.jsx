'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, ChevronDown, ChevronLeft, ChevronRight, User, UserPlus } from 'lucide-react';
import Modal from '@/components/common/Modal';

const tagColorMap = {
  Diabetic: 'bg-red-50 text-red-700 ring-1 ring-red-200/50',
  'Insurance Pending': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
  Hypertension: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/50',
  Migraine: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/50',
  Anxiety: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200/50',
  Asthma: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200/50',
  'Social Stressors': 'bg-green-50 text-green-700 ring-1 ring-green-200/50',
  COPD: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50',
  'Prior Authorization': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50',
  Hyperlipidemia: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/50',
  'Portal Inactive': 'bg-red-50 text-red-700 ring-1 ring-red-200/50',
  'Verification Required': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/50',
  'Referral Required': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/50',
  'Substance Use': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/50',
  Anemia: 'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200/50',
};

const portalStatusStyles = {
  Active: 'text-emerald-600 font-semibold',
  Inactive: 'text-red-500 font-semibold',
  Pending: 'text-gray-500 font-medium',
};

const MAX_VISIBLE_TAGS = 2;

const emptyFormData = {
  firstName: '', lastName: '', dob: '', gender: '', email: '', phone: '', address: '',
};

export default function Patients() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        status: activeTab,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/patients?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients || []);
        setPagination(data.pagination || { total: 0, totalPages: 1 });
      }
    } catch {
      // Keep existing data on error
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, activeTab, debouncedSearch]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const [counts, setCounts] = useState({ active: 0, inactive: 0 });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [activeRes, inactiveRes] = await Promise.all([
          fetch('/api/patients?status=active&limit=1'),
          fetch('/api/patients?status=inactive&limit=1'),
        ]);
        const [activeData, inactiveData] = await Promise.all([activeRes.json(), inactiveRes.json()]);
        setCounts({
          active: activeData.pagination?.total || 0,
          inactive: inactiveData.pagination?.total || 0,
        });
      } catch { /* ignore */ }
    }
    fetchCounts();
  }, [patients]);

  const activeCount = counts.active;
  const inactiveCount = counts.inactive;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePatient = async () => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender === 'Male' ? 'M' : formData.gender === 'Female' ? 'F' : 'O',
          dob: formData.dob,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      if (res.ok) {
        setFormData(emptyFormData);
        setIsModalOpen(false);
        fetchPatients();
      }
    } catch {
      // Handle error silently
    }
  };

  const formatLastAppointment = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const filteredPatients = patients;

  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return <span className="text-gray-300">—</span>;
    const visible = tags.slice(0, MAX_VISIBLE_TAGS);
    const remaining = tags.length - MAX_VISIBLE_TAGS;
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {visible.map((tag, idx) => (
          <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${tagColorMap[tag.label] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/50'}`}>
            {tag.label}
          </span>
        ))}
        {remaining > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500">+{remaining}</span>
        )}
      </div>
    );
  };

  const totalPages = pagination.totalPages || 1;
  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <button key="prev" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
        className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer">
        <ChevronLeft className="w-3.5 h-3.5" /> Previous
      </button>
    );
    // Show first few pages
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);
    for (let n = start; n <= end; n++) {
      pages.push(
        <button key={n} onClick={() => setCurrentPage(n)}
          className={`px-2.5 py-1.5 text-xs rounded-md transition cursor-pointer ${currentPage === n ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
          {n}
        </button>
      );
    }
    if (end < totalPages - 2) {
      pages.push(<span key="dots" className="px-1.5 text-xs text-gray-400">...</span>);
    }
    if (end < totalPages) {
      for (let n = Math.max(end + 1, totalPages - 1); n <= totalPages; n++) {
        pages.push(
          <button key={n} onClick={() => setCurrentPage(n)}
            className={`px-2.5 py-1.5 text-xs rounded-md transition cursor-pointer ${currentPage === n ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            {n}
          </button>
        );
      }
    }
    pages.push(
      <button key="next" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
        className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition cursor-pointer">
        Next <ChevronRight className="w-3.5 h-3.5" />
      </button>
    );
    return pages;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Patients</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your patient records and demographics</p>
      </div>

      {/* Tabs + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 border-b border-gray-200">
          {[{ key: 'active', label: 'Active Patients', count: activeCount }, { key: 'inactive', label: 'Inactive Patients', count: inactiveCount }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === tab.key ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50' : 'bg-gray-100 text-gray-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-60 text-[13px] bg-gray-50/80 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
          <button onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
            <Plus className="w-4 h-4" /> New Patient <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative bg-white border border-gray-200/80 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {/* Side Tab */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white text-[10px] font-semibold px-1.5 py-3 rounded-l-md cursor-pointer hover:from-blue-700 hover:to-blue-800 transition shadow-md tracking-wide"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            Recent Patient Chart
          </div>
        </div>

        <div className="overflow-x-auto pr-8">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">MRN</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">Patient Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">Date of Birth</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">Contact Details</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">Last Appointment</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">Tags</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gradient-to-b from-gray-50 to-gray-100/80 border-b border-gray-200">Patient Portal</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-150">
                  <td className="px-4 py-3 text-[13px] text-gray-600 font-mono font-medium whitespace-nowrap">{patient.mrn}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0 ring-1 ring-blue-200/50">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <Link href={`/patients/${patient.id}`} className="text-[13px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer hover:underline">{patient.name}</Link>
                        <span className="text-gray-400 ml-1.5 text-[11px]">
                          ({patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">
                    {patient.dob} <span className="text-gray-400 text-[11px]">({patient.age} yrs)</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">{patient.contactDetails}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">{formatLastAppointment(patient.lastAppointment)}</td>
                  <td className="px-4 py-3">{renderTags(patient.tags)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        patient.portalStatus === 'Active' ? 'bg-emerald-500' :
                        patient.portalStatus === 'Inactive' ? 'bg-red-400' : 'bg-gray-400'
                      }`}></span>
                      <span className={`text-[13px] ${portalStatusStyles[patient.portalStatus] || 'text-gray-500 font-medium'}`}>
                        {patient.portalStatus}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100/60">
          <div className="text-xs text-gray-500 font-medium">{((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, pagination.total)} of {pagination.total} Rows</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Rows per page:</span>
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border border-gray-200 rounded-md px-1.5 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value={10}>10</option><option value={15}>15</option><option value={25}>25</option><option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-0.5">{renderPageNumbers()}</div>
          </div>
        </div>
      </div>

      {/* New Patient Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData(emptyFormData); }} title="New Patient" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-100/60 mb-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">Enter the patient's demographic information below</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="Enter first name"
                className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Enter last name"
                className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleFormChange} className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleFormChange} className="input-field">
                <option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Enter email address" className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="(555) 000-0000" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleFormChange} placeholder="Enter full address" className="input-field" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button onClick={() => { setIsModalOpen(false); setFormData(emptyFormData); }}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">Cancel</button>
            <button onClick={handleSavePatient}
              className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>Save Patient</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
