'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Eye,
  FileText,
  ChevronRight,
  ChevronDown,
  Clock,
  User,
  Users,
  UserCheck,
  CalendarDays,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Circle,
  UserPlus,
  ClipboardList,
  StickyNote,
  BarChart3,
  Video,
  Check,
} from 'lucide-react';
import {
  notifications,
  todoTasks,
  messages,
  providers,
  todaySchedule,
  staffTodoTasks,
  recentActivities,
} from '@/data/dashboardData';
import {
  appointments as mockAppointments,
  unsignedEncounters as mockUnsignedEncounters,
  adminStats as mockAdminStats,
  staffStats as mockStaffStats,
} from '@/data/dashboardData';

const countColor = (color) => {
  const map = {
    '#4A90D9': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
    '#F5A623': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
    '#7B68EE': 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/60',
    '#50C878': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
    '#FF6B6B': 'bg-red-50 text-red-600 ring-1 ring-red-200/60',
    '#20B2AA': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/60',
    '#FF8C00': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/60',
    '#9370DB': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/60',
  };
  return map[color] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/60';
};

const statusBadge = (status) => {
  switch (status) {
    case 'In Exam': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50';
    case 'Checked In': return 'bg-green-50 text-green-700 ring-1 ring-green-200/50';
    default: return 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/50';
  }
};

const typeBadge = (type) =>
  type === 'In-Person'
    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50'
    : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50';

const taskStatusBadge = (status) =>
  status === 'NEW'
    ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50'
    : 'bg-orange-50 text-orange-700 ring-1 ring-orange-200/50';

const encounterStatusBadge = (status) =>
  status === 'Unsigned'
    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50'
    : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50';

const avatarColors = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-600',
  'from-rose-400 to-rose-500',
  'from-amber-400 to-amber-500',
  'from-teal-500 to-teal-600',
  'from-indigo-500 to-indigo-600',
  'from-pink-400 to-pink-500',
];
const pickAvatarColor = (index) => avatarColors[index % avatarColors.length];

const dashboardOptions = [
  { key: 'provider', label: 'Provider Dashboard' },
  { key: 'admin', label: 'Admin Dashboard' },
  { key: 'staff', label: 'Staff Dashboard' },
];

export default function Dashboard() {
  const [view, setView] = useState('provider');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch {
        // Fallback to mock data on error
      }
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = dashboardOptions.find((o) => o.key === view)?.label;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{currentLabel}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, here's your practice overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition cursor-pointer">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            Calendar Range
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-white rounded-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {currentLabel}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1" style={{ boxShadow: '0 10px 40px -4px rgba(0,0,0,0.1)' }}>
                {dashboardOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setView(opt.key); setDropdownOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors cursor-pointer ${
                      view === opt.key ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                    {view === opt.key && <Check size={14} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {view === 'admin' && <AdminDashboard data={dashboardData} />}
      {view === 'staff' && <StaffDashboard data={dashboardData} />}
      {view === 'provider' && <ProviderDashboard data={dashboardData} />}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROVIDER DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
function ProviderDashboard({ data }) {
  const appointments = data?.appointments?.length ? data.appointments : mockAppointments;
  const unsignedEncounters = data?.unsignedEncounters?.length ? data.unsignedEncounters : mockUnsignedEncounters;

  return (
    <>
      {/* Notification Cards Row */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-3 min-w-max">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200/80 min-w-[180px] cursor-pointer hover:shadow-md hover:border-gray-300/80 transition-all duration-200"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
            >
              <span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-sm font-bold ${countColor(n.color)}`}>
                {String(n.count).padStart(2, '0')}
              </span>
              <span className="text-[13px] font-medium text-gray-600 whitespace-nowrap">{n.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Three-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl border border-gray-200/80 flex flex-col" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800">Today's Appointments</h2>
              <span className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 ring-1 ring-blue-200/50">12</span>
            </div>
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[480px] divide-y divide-gray-50">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`flex gap-3 px-5 py-3.5 transition-all duration-150 ${
                  apt.isHighlighted
                    ? 'border-l-[3px] border-l-blue-500 bg-blue-50/30'
                    : 'border-l-[3px] border-l-transparent hover:bg-gray-50/50'
                }`}
              >
                <div className="flex flex-col items-end shrink-0 w-[65px] pt-0.5">
                  <span className="text-[13px] font-semibold text-gray-700">{apt.time}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                    <Clock className="h-3 w-3" />{apt.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-semibold text-gray-800">{apt.patientName}</span>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${typeBadge(apt.type)}`}>{apt.type}</span>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${statusBadge(apt.status)}`}>{apt.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 truncate">{apt.description}</p>
                </div>
                <div className="flex items-start gap-1 shrink-0 pt-0.5">
                  <button className="p-1 rounded-md hover:bg-gray-100 transition cursor-pointer"><Eye className="h-3.5 w-3.5 text-gray-400" /></button>
                  <button className="p-1 rounded-md hover:bg-gray-100 transition cursor-pointer"><FileText className="h-3.5 w-3.5 text-gray-400" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* To Do Tasks */}
        <div className="bg-white rounded-xl border border-gray-200/80 flex flex-col" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800">To Do Tasks</h2>
              <span className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 ring-1 ring-blue-200/50">08</span>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-0.5 cursor-pointer">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 divide-y divide-gray-50">
            {todoTasks.map((task, idx) => (
              <div key={task.id} className="flex gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-all duration-150">
                <div className={`shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br ${pickAvatarColor(idx)} flex items-center justify-center shadow-sm`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-blue-600 hover:underline cursor-pointer truncate">{task.title}</p>
                  <p className="text-xs text-gray-700 font-medium mt-0.5">{task.patientName}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">#{task.patientId} | {task.patientInfo}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Assign By: <span className="text-gray-500">{task.assignedBy}</span></p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{task.date}</p>
                </div>
                <div className="shrink-0 pt-1">
                  <span className={`text-[10px] font-semibold rounded-full px-2.5 py-1 ${taskStatusBadge(task.status)}`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl border border-gray-200/80 flex flex-col" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Messages</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-0.5 cursor-pointer">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[480px] divide-y divide-gray-50">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="flex gap-3 px-5 py-3 hover:bg-gray-50/50 transition-all duration-150 cursor-pointer">
                <div className={`shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br ${pickAvatarColor(idx)} flex items-center justify-center shadow-sm`}>
                  <span className="text-[11px] font-bold text-white">{msg.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-gray-800 truncate">{msg.senderName}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{msg.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{msg.preview}</p>
                </div>
                {msg.unreadCount > 0 && (
                  <div className="shrink-0 flex items-center">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">{msg.unreadCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unsigned Encounters */}
      <div className="bg-white rounded-xl border border-gray-200/80" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-800">Unsigned Encounters</h2>
            <span className="inline-flex items-center justify-center rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 ring-1 ring-amber-200/50">05</span>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-0.5 cursor-pointer">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unsignedEncounters.map((enc, idx) => (
              <div key={enc.id} className="flex items-center gap-3.5 rounded-lg border border-gray-100 bg-gray-50/40 px-4 py-3.5 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className={`shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br ${pickAvatarColor(idx + 3)} flex items-center justify-center shadow-sm`}>
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-blue-600 hover:underline cursor-pointer truncate">{enc.patientName}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">DOB: {enc.dob} ({enc.age}) | {enc.gender}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{enc.provider} &middot; {enc.date}</p>
                </div>
                <div className="shrink-0">
                  <span className={`text-[10px] font-semibold rounded-full px-2.5 py-1 ${encounterStatusBadge(enc.status)}`}>{enc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
const statIcons = [
  <Users key="p" size={28} className="text-blue-600" />,
  <UserCheck key="pa" size={28} className="text-blue-600" />,
  <CalendarDays key="a" size={28} className="text-blue-600" />,
  <Activity key="e" size={28} className="text-blue-600" />,
];

function AdminDashboard({ data }) {
  const adminStats = data?.adminStats?.length ? data.adminStats : mockAdminStats;
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const sorted = [...providers].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    if (typeof aVal === 'boolean') return sortDir === 'asc' ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => (
          <div key={stat.label} className="stat-card flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              {statIcons[idx]}
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              <div className="flex items-center gap-1 mt-0.5">
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={13} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={13} className="text-red-500" />
                )}
                <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.change}% {stat.trend === 'up' ? 'higher' : 'lower'} than last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                {[
                  { key: 'id', label: 'Provider ID' },
                  { key: 'name', label: 'Provider Name' },
                  { key: 'npi', label: 'NPI Number' },
                  { key: 'contact', label: 'Contact' },
                  { key: 'specialty', label: 'Specialty' },
                  { key: 'experience', label: 'Year Of Experience' },
                  { key: 'totalPatient', label: 'Total Patient' },
                  { key: 'status', label: 'Status' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="cursor-pointer select-none hover:text-gray-800 transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <div className="flex flex-col">
                        <ArrowUp size={9} className={sortField === col.key && sortDir === 'asc' ? 'text-blue-600' : 'text-gray-300'} />
                        <ArrowDown size={9} className={sortField === col.key && sortDir === 'desc' ? 'text-blue-600' : 'text-gray-300'} />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-gray-700">{p.id}</td>
                  <td className="text-gray-700">{p.name}</td>
                  <td className="font-mono text-gray-500 text-xs">{p.npi}</td>
                  <td className="text-gray-500">{p.contact}</td>
                  <td className="text-gray-600">{p.specialty}</td>
                  <td className="text-gray-600">{p.experience}</td>
                  <td className="text-gray-600">{p.totalPatient}</td>
                  <td><ToggleSwitch active={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAFF DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
const staffStatIcons = [
  <Users key="p" size={20} className="text-gray-400" />,
  <CalendarDays key="a" size={20} className="text-gray-400" />,
  <ClipboardList key="t" size={20} className="text-gray-400" />,
  <Activity key="l" size={20} className="text-gray-400" />,
];

function StaffDashboard({ data }) {
  const staffStats = data?.staffStats?.length ? data.staffStats : mockStaffStats;
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffStats.map((stat, idx) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              {staffStatIcons[idx]}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className={`text-xs mt-1 font-medium ${stat.urgent ? 'text-red-500' : 'text-blue-600'}`}>
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Today's Schedule */}
        <div className="lg:col-span-5 card flex flex-col">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800">Today's Schedule</h2>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">12</span>
            </div>
            <Calendar size={16} className="text-gray-400" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[540px] divide-y divide-gray-50">
            {todaySchedule.map((item) => (
              <div key={item.id} className="px-4 py-3.5 hover:bg-gray-50/50 transition">
                <div className="flex gap-3">
                  <div className="shrink-0 w-[72px] pt-0.5">
                    <div className="text-[13px] font-semibold text-gray-800">{item.time}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{item.duration}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-gray-900">{item.patient}</span>
                      <span className={`badge ${item.type === 'In-Person' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50'}`}>
                        {item.type === 'Virtual' && <Video size={10} />}
                        {item.type}
                      </span>
                      <ScheduleStatusBadge status={item.status} />
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">{item.appointmentType}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-gray-600">{item.provider.split(' ').map(w => w[0]).join('')}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{item.provider}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-gray-100 transition cursor-pointer"><Eye size={14} className="text-gray-400" /></button>
                      <button className="p-1 rounded hover:bg-gray-100 transition cursor-pointer"><FileText size={14} className="text-gray-400" /></button>
                    </div>
                    <button className={`text-[11px] font-medium px-3 py-1 rounded-md transition cursor-pointer ${
                      item.action === 'Check Out'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}>
                      {item.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* To Do Tasks */}
        <div className="lg:col-span-4 card flex flex-col">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800">To Do Task</h2>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">08</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[540px] divide-y divide-gray-50">
            {staffTodoTasks.map((task) => (
              <div key={task.id} className="px-4 py-3 hover:bg-gray-50/50 transition">
                <div className="flex items-start gap-2.5">
                  {task.completed ? (
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={18} className="text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[13px] font-medium ${task.completed ? 'line-through text-gray-400' : 'text-blue-600 hover:text-blue-800 cursor-pointer'}`}>
                        {task.title}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-gray-500">{task.patient.split(' ').map(w => w[0]).join('')}</span>
                      </div>
                      <span className="text-[11px] text-gray-500">{task.patient}</span>
                      <span className="text-[11px] text-gray-400">Due Date: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Actions + Recent Activities */}
        <div className="lg:col-span-3 space-y-5">
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Add Patient', icon: UserPlus, color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
                { label: 'New Appointment', icon: CalendarDays, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
                { label: 'Quick Note', icon: StickyNote, color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
                { label: 'View Reports', icon: BarChart3, color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer ${action.color}`}>
                    <Icon size={15} />{action.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-gray-800">Recent Activities</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recentActivities.map((item) => (
                <div key={item.id} className="px-4 py-2.5 hover:bg-gray-50/50 transition flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer truncate">{item.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.priority && <PriorityBadge priority={item.priority} />}
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */
function ToggleSwitch({ active }) {
  return (
    <div className={`w-10 h-[22px] rounded-full relative cursor-pointer transition-colors ${active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${active ? 'left-[22px]' : 'left-[3px]'}`} />
    </div>
  );
}

function ScheduleStatusBadge({ status }) {
  const map = {
    Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50',
    'Checked In': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50',
    Scheduled: 'bg-gray-100 text-gray-600',
  };
  return <span className={`badge ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const map = { High: 'text-red-600', Medium: 'text-amber-600', Low: 'text-blue-600' };
  return <span className={`text-[11px] font-semibold ${map[priority] || 'text-gray-500'}`}>{priority}</span>;
}
