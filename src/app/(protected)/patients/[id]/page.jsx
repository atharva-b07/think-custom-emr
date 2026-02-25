'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, User, Plus, Printer,
  AlertTriangle, ChevronDown, Sparkles, Syringe, Stethoscope,
  Heart, Pill, Activity, FileText, History, FlaskConical, Image,
  ClipboardList, FileBarChart, CreditCard, UserCircle, ChevronRight,
  Pencil, Loader2,
} from 'lucide-react';
import Modal from '@/components/common/Modal';

// Sidebar tabs matching the screenshot
const sidebarTabs = [
  { id: 'facesheet', label: 'Facesheet', icon: ClipboardList },
  { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
  { id: 'visit-notes', label: 'Visit Notes', icon: FileText },
  { id: 'lab-orders', label: 'Lab Orders', icon: FlaskConical },
  { id: 'imaging-orders', label: 'Imaging Orders', icon: Image },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'documents', label: 'Documents', icon: FileBarChart },
  { id: 'referrals', label: 'Referrals', icon: ChevronRight, expandable: true },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'card-details', label: 'Card Details', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

// Mock facesheet data
const mockData = {
  allergies: [
    { name: 'Asthma : Environment : Chest Pain : Mild', date: '07-11-2007' },
    { name: 'Dust Allergy : Environment : Sneezing, Runny Nose: Mild', date: '16-04-2005' },
  ],
  vaccines: [
    { name: 'COVID-19, MRNA, LNP-S, PF,', date: '10-10-2023' },
    { name: 'MENINGOCOCCAL POLYSACCHARIDE', date: '15-11-2016' },
  ],
  diagnoses: [
    { code: 'A0100', name: 'Typhoid fever', type: 'Chronic', date: '04-10-2025', detail: '' },
    { code: 'M19.90', name: 'DA (degenerative arthritis)', type: 'Chronic', date: '23-08-2025', detail: 'Skin reactions, Redness or swelling' },
    { code: 'M19.90', name: 'DA (degenerative arthritis)', type: 'Chronic', date: '23-08-2025', detail: 'Skin reactions, Redness or swelling' },
  ],
  socialHistory: [
    { label: 'Education Level', value: 'No education level recorded' },
    { label: 'Financial Strain', value: 'No financial strain recorded' },
    { label: 'Exposure To Violence', value: 'No exposure violence recorded' },
    { label: 'Tobacco Use', value: 'Ex-Smoker : 10-04-2023' },
    { label: 'Alcohol Use', value: 'No alcohol use recorded' },
    { label: 'Physical Activity', value: 'No physical activity recorded' },
    { label: 'Stress', value: 'No stress recorded' },
  ],
  surgicalHistory: [
    { name: 'Knee Injury', date: '30-02-2023' },
    { name: 'Coronary Artery Bypass', date: '18-07-2021' },
    { name: 'Tonsillectomy', date: '10-04-2020' },
  ],
  medications: [
    { name: 'Abelcet (Amphotericin Injection)', date: '12-05-2025' },
    { name: 'Abacavir Sulfate (Ziagen)', date: '05-12-2025' },
  ],
  vitals: [
    { label: 'Blood Pressure', date: '12-05-2025 · 12:00 PM', value: '120/80 mmHg' },
  ],
  notes: [
    { provider: 'Dr. Rebecca Shaw', summary: 'Carefully monitor the patient for any increased chest pain that requi...' },
  ],
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTopTab, setActiveTopTab] = useState('facesheet');
  const [activeSideTab, setActiveSideTab] = useState('facesheet');

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/patients/${id}`);
        if (!res.ok) {
          router.replace('/patients');
          return;
        }
        const data = await res.json();
        setPatient(data.patient);
        setAppointments(data.upcomingAppointments || []);
      } catch {
        router.replace('/patients');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatient();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) return null;

  const genderLabel = patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other';

  return (
    <div className="space-y-0 -m-6">
      {/* Patient Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/patients" className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-gray-900">{patient.name}</h1>
                <span className="text-xs text-gray-400">({genderLabel})</span>
                {patient.tags?.slice(0, 2).map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 ring-1 ring-red-200/50">
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3.5 mt-0.5 text-[11px] text-gray-500">
                {patient.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {patient.email}
                  </span>
                )}
                {patient.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {patient.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {patient.dob} ({patient.age} yrs)
                </span>
                {patient.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {patient.address}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white rounded-lg cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
              <Plus className="w-3.5 h-3.5" /> Non Clinical Note
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print Chart
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Info Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-2.5 flex items-center gap-0 text-[11px] divide-x divide-gray-200">
        <div className="pr-5">
          <span className="text-gray-400 uppercase font-semibold tracking-wide">Primary Provider</span>
          <span className="ml-2 text-gray-900 font-semibold">Dr. Rebecca Shaw</span>
          <span className="ml-1.5 text-gray-400">Last Visit: 24 Feb 2026, 12:35 PM</span>
        </div>
        <div className="px-5">
          <span className="text-gray-400 uppercase font-semibold tracking-wide">Note</span>
          <span className="ml-2 text-gray-600">Carefully monitor the patient for ...</span>
        </div>
        <div className="px-5">
          <span className="text-gray-400 uppercase font-semibold tracking-wide">Balance</span>
          <span className="ml-2 text-gray-900 font-semibold">Patient: $59</span>
          <span className="ml-2 text-gray-900 font-semibold">Insurance: $107</span>
          <span className="ml-1.5 text-gray-400 italic">{patient.insurance || 'BlueLink TPA'}</span>
        </div>
        <div className="pl-5">
          <span className="text-gray-400 uppercase font-semibold tracking-wide">Portal (Last Log)</span>
          <span className="ml-2 text-gray-900 font-semibold">24 Feb 2026, 12:35 PM</span>
        </div>
      </div>

      {/* Top Tabs: Face Sheet | Timeline | Intake Forms */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex items-center gap-1">
          {[
            { key: 'facesheet', label: 'Face Sheet' },
            { key: 'timeline', label: 'Timeline' },
            { key: 'intake', label: 'Intake Forms' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTopTab(tab.key)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                activeTopTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area: Left sidebar + Main */}
      <div className="flex">
        {/* Left Sidebar — each item is a separate tab */}
        <div className="w-44 bg-white border-r border-gray-200 min-h-[calc(100vh-220px)] py-2 flex-shrink-0">
          <nav className="space-y-0.5 px-1.5">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSideTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSideTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors cursor-pointer rounded-md ${
                    isActive
                      ? 'text-blue-700 font-semibold border-l-3 border-blue-600 bg-blue-50/40 rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5 overflow-y-auto max-h-[calc(100vh-220px)] bg-[#f8fafc]">
          {activeSideTab === 'facesheet' && (
            <FacesheetView appointments={appointments} />
          )}
          {activeSideTab === 'allergies' && (
            <AllergiesTabView patientId={id} onBackToFacesheet={() => setActiveSideTab('facesheet')} />
          )}
          {activeSideTab !== 'facesheet' && activeSideTab !== 'allergies' && (
            <PlaceholderView label={sidebarTabs.find(t => t.id === activeSideTab)?.label || activeSideTab} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FACESHEET VIEW — 3-column grid matching screenshot
   ═══════════════════════════════════════════════════════════════ */
function FacesheetView({ appointments }) {
  return (
    <div className="space-y-4">
      {/* AI Highlights — full width */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-start gap-3 p-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 mb-1.5">AI Highlights</h3>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              The patient has documented chronic medical conditions along with noted environmental allergies, which are currently being managed. Based on the most recent clinical data and recorded vital signs, the patient appears clinically stable with no acute issues identified at this time. The medication list is active and up to date, indicating ongoing treatment and management of existing conditions. Continued monitoring is planned, with reassessment scheduled during the upcoming visit to ensure stability is maintained and care plans are adjusted as needed.
            </p>
          </div>
          <button className="p-1 text-gray-300 hover:text-gray-500 transition flex-shrink-0 cursor-pointer">
            <span className="text-lg">&times;</span>
          </button>
        </div>
      </div>

      {/* Row 1: Allergies | Vaccines | Upcoming Appointments */}
      <div className="grid grid-cols-3 gap-4">
        <FacesheetCard title="Allergies" icon={AlertTriangle} iconColor="text-amber-600 bg-amber-50">
          <div className="space-y-3">
            {mockData.allergies.map((a, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <p className="text-[12px] text-gray-700 leading-snug">{a.name}</p>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">{a.date}</span>
              </div>
            ))}
          </div>
        </FacesheetCard>

        <FacesheetCard title="Vaccines" icon={Syringe} iconColor="text-green-600 bg-green-50">
          <div className="space-y-3">
            {mockData.vaccines.map((v, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <p className="text-[12px] text-gray-700 leading-snug">{v.name}</p>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">{v.date}</span>
              </div>
            ))}
          </div>
        </FacesheetCard>

        <FacesheetCard title="Upcoming Appointments" icon={Calendar} iconColor="text-blue-600 bg-blue-50">
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 2).map((apt, i) => (
                <div key={i}>
                  <p className="text-[12px] font-semibold text-gray-900">
                    {formatDateLong(apt.date)}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {apt.startTime} – {apt.endTime} · {apt.reason || 'General Visit'}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {apt.provider} · <span className={apt.status === 'Scheduled' ? 'text-amber-600 font-medium' : 'text-gray-500'}>{apt.status === 'Scheduled' ? 'Pending Confirmation' : apt.status}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-gray-400 py-2">No upcoming appointments</p>
          )}
        </FacesheetCard>
      </div>

      {/* Row 2: Diagnoses | Social History | Past Surgical History */}
      <div className="grid grid-cols-3 gap-4">
        <FacesheetCard title="Diagnoses" icon={Stethoscope} iconColor="text-rose-600 bg-rose-50">
          <div className="space-y-3">
            {mockData.diagnoses.map((dx, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">{dx.code}</span>
                  <span className="text-[12px] font-medium text-gray-900">{dx.name}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{dx.type} · {dx.date}</p>
                {dx.detail && <p className="text-[11px] text-gray-400">{dx.detail}</p>}
              </div>
            ))}
          </div>
        </FacesheetCard>

        <FacesheetCard title="Social History" icon={Heart} iconColor="text-pink-600 bg-pink-50">
          <div className="space-y-2">
            {mockData.socialHistory.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <span className="text-[12px] font-medium text-gray-700">{item.label}</span>
                <span className="text-[11px] text-gray-400 text-right italic">{item.value}</span>
              </div>
            ))}
          </div>
        </FacesheetCard>

        <FacesheetCard title="Past Surgical History" icon={History} iconColor="text-slate-600 bg-slate-50">
          <div className="space-y-3">
            {mockData.surgicalHistory.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[12px] text-gray-700">{s.name}</span>
                <span className="text-[11px] text-gray-400">{s.date}</span>
              </div>
            ))}
          </div>
        </FacesheetCard>
      </div>

      {/* Row 3: Medications | Vitals | Notes */}
      <div className="grid grid-cols-3 gap-4">
        <FacesheetCard title="Medications" icon={Pill} iconColor="text-indigo-600 bg-indigo-50">
          <div className="space-y-3">
            {mockData.medications.map((m, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <p className="text-[12px] text-gray-700">{m.name}</p>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">{m.date}</span>
              </div>
            ))}
          </div>
        </FacesheetCard>

        <FacesheetCard title="Vitals" icon={Activity} iconColor="text-emerald-600 bg-emerald-50">
          <div className="space-y-3">
            {mockData.vitals.map((v, i) => (
              <div key={i}>
                <p className="text-[12px] font-medium text-gray-700">{v.label}</p>
                <p className="text-[11px] text-gray-400">{v.date}</p>
                <p className="text-[13px] font-bold text-gray-900 mt-0.5">{v.value}</p>
              </div>
            ))}
          </div>
        </FacesheetCard>

        <FacesheetCard title="Notes" icon={FileText} iconColor="text-orange-600 bg-orange-50">
          <div className="space-y-3">
            {mockData.notes.map((n, i) => (
              <div key={i}>
                <p className="text-[12px] font-semibold text-gray-900">{n.provider}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{n.summary}</p>
              </div>
            ))}
          </div>
        </FacesheetCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ALLERGIES TAB VIEW — Full CRUD with list + add/edit modal
   ═══════════════════════════════════════════════════════════════ */
const emptyAllergyForm = {
  allergyType: 'Drug',
  allergyName: '',
  reaction: '',
  severity: '',
  onsetDate: '',
  recordedBy: '',
  recordedByRole: '',
  note: '',
};

function AllergiesTabView({ patientId, onBackToFacesheet }) {
  const [allergies, setAllergies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState(null);
  const [formData, setFormData] = useState(emptyAllergyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchAllergies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/patients/${patientId}/allergies`);
      if (res.ok) {
        const data = await res.json();
        setAllergies(data.allergies || []);
      }
    } catch {
      // keep existing data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, [patientId]);

  const openAddModal = () => {
    setEditingAllergy(null);
    setFormData(emptyAllergyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (allergy) => {
    setEditingAllergy(allergy);
    // Convert DD-MM-YYYY back to YYYY-MM-DD for the date input
    const onsetParts = allergy.onsetDate ? allergy.onsetDate.split('-') : [];
    const onsetDateForInput = onsetParts.length === 3 ? `${onsetParts[2]}-${onsetParts[1]}-${onsetParts[0]}` : '';

    setFormData({
      allergyType: allergy.allergyType,
      allergyName: allergy.allergyName,
      reaction: allergy.reaction,
      severity: allergy.severity,
      onsetDate: onsetDateForInput,
      recordedBy: allergy.recordedBy,
      recordedByRole: allergy.recordedByRole,
      note: allergy.note || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAllergy(null);
    setFormData(emptyAllergyForm);
    setFormError('');
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setFormError('');
    setIsSaving(true);

    try {
      const url = editingAllergy
        ? `/api/patients/${patientId}/allergies/${editingAllergy.id}`
        : `/api/patients/${patientId}/allergies`;

      const method = editingAllergy ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Something went wrong');
        return;
      }

      closeModal();
      fetchAllergies();
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-white rounded-t-xl border border-gray-200 px-5 py-3.5 flex items-center justify-between" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBackToFacesheet} className="p-1 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600 cursor-pointer">
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md text-amber-600 bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-[14px] font-bold text-gray-900">Allergies</h2>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white rounded-lg cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          <Plus className="w-3.5 h-3.5" /> Add Allergies
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : allergies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-[13px] text-gray-500">No allergies recorded for this patient.</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Click &quot;+ Add Allergies&quot; to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">No.</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Allergy Type</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Allergies</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Reaction</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Severity</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Onset Date</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Recorded Date</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Recorded By</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allergies.map((allergy, index) => (
                  <tr key={allergy.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-2.5 text-[12px] text-gray-500 font-mono">{String(index + 1).padStart(3, '0')}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        allergy.allergyType === 'Drug' ? 'bg-purple-50 text-purple-700' :
                        allergy.allergyType === 'Food' ? 'bg-orange-50 text-orange-700' :
                        'bg-teal-50 text-teal-700'
                      }`}>
                        {allergy.allergyType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-gray-900 font-medium">{allergy.allergyName}</td>
                    <td className="px-4 py-2.5 text-[12px] text-gray-600">{allergy.reaction}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        allergy.severity === 'Severe' ? 'bg-red-50 text-red-700' :
                        allergy.severity === 'Moderate' ? 'bg-amber-50 text-amber-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {allergy.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-gray-500">{allergy.onsetDate}</td>
                    <td className="px-4 py-2.5 text-[12px] text-gray-500">{allergy.recordedDate}</td>
                    <td className="px-4 py-2.5 text-[12px] text-gray-600">{allergy.recordedBy}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => openEditModal(allergy)}
                        className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAllergy ? 'Edit Allergy' : 'Add Allergies'} size="lg">
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          {/* Allergy Type — Radio buttons */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-2">Allergy Type</label>
            <div className="flex items-center gap-4">
              {['Drug', 'Food', 'Environment'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="allergyType"
                    value={type}
                    checked={formData.allergyType === type}
                    onChange={() => handleFormChange('allergyType', type)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergy Name + Reaction */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Allergy Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.allergyName}
                onChange={(e) => handleFormChange('allergyName', e.target.value)}
                placeholder="Select or Search Allergy"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Reaction <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.reaction}
                onChange={(e) => handleFormChange('reaction', e.target.value)}
                placeholder="Select Reaction"
                className="input-field"
              />
            </div>
          </div>

          {/* Severity + Onset Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Severity <span className="text-red-500">*</span></label>
              <select
                value={formData.severity}
                onChange={(e) => handleFormChange('severity', e.target.value)}
                className="input-field"
              >
                <option value="">Select Severity</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Onset Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.onsetDate}
                onChange={(e) => handleFormChange('onsetDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Recorded By + Recorded By Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Recorded By <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.recordedBy}
                onChange={(e) => handleFormChange('recordedBy', e.target.value)}
                placeholder="Enter name"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Recorded By <span className="text-red-500">*</span></label>
              <select
                value={formData.recordedByRole}
                onChange={(e) => handleFormChange('recordedByRole', e.target.value)}
                className="input-field"
              >
                <option value="">Select Role</option>
                <option value="Staff">Staff</option>
                <option value="Patient">Patient</option>
                <option value="Provider">Provider</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => handleFormChange('note', e.target.value)}
              placeholder="Type here"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2 text-[13px] font-medium text-white rounded-lg transition cursor-pointer disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingAllergy ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLACEHOLDER VIEW — for other sidebar tabs
   ═══════════════════════════════════════════════════════════════ */
function PlaceholderView({ label }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{label}</h3>
        <p className="text-sm text-gray-400">This section is under development.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FACESHEET CARD — collapsible card with icon + title + chevron
   ═══════════════════════════════════════════════════════════════ */
function FacesheetCard({ title, icon: Icon, iconColor, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50/50 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md ${iconColor} flex items-center justify-center`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-[13px] font-semibold text-gray-900">{title}</h3>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && (
        <div className="px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function formatDateLong(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}
