'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  ClipboardList,
  Receipt,
  ArrowRightLeft,
  BarChart3,
  Settings,
  Bot,
  ChevronDown,
  Activity,
  Shield,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    label: 'Scheduling',
    path: '/scheduling',
    icon: CalendarDays,
    children: [
      { label: 'Appointments', path: '/scheduling' },
      { label: 'Unsigned Visits', path: '/scheduling/unsigned' },
    ],
  },
  { label: 'Patients', path: '/patients', icon: Users },
  {
    label: 'Communications',
    path: '/communications/tasks',
    icon: MessageSquare,
    children: [
      { label: 'Tasks', path: '/communications/tasks' },
      { label: 'Fax', path: '/communications/fax' },
      { label: 'Chat', path: '/communications/chat' },
      { label: 'Email', path: '/communications/email' },
      { label: 'Broadcast', path: '/communications/broadcast' },
      { label: 'Contact Directory', path: '/communications/directory' },
    ],
  },
  { label: 'CPOE', path: '/cpoe', icon: ClipboardList },
  {
    label: 'Billing',
    path: '/billing',
    icon: Receipt,
    children: [
      { label: 'Billing', path: '/billing' },
      { label: 'Account Receivable', path: '/billing/account-receivable' },
      { label: 'Patient Payments', path: '/billing/patient-payments' },
      { label: 'Insurance Payments', path: '/billing/insurance-payments' },
    ],
  },
  { label: 'Referral', path: '/referral', icon: ArrowRightLeft },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'AI Agents', path: '/ai-agents', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState({});

  function toggleExpand(label) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isParentActive(item) {
    if (item.children) {
      return item.children.some((child) => pathname === child.path);
    }
    return false;
  }

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200/80 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
          <Activity size={18} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 tracking-tight leading-tight">RCM Portal</span>
          <span className="text-[10px] text-blue-600 font-semibold tracking-wide uppercase leading-none mt-0.5">Healthcare EMR</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-2 px-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Navigation</span>
        </div>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const parentActive = isParentActive(item);
            const isOpen = expanded[item.label] || parentActive;

            if (hasChildren) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                      parentActive
                        ? 'text-blue-700 bg-blue-50/80'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      parentActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100'
                    }`}>
                      <Icon size={16} className="shrink-0" />
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="mt-1 ml-[18px] pl-4 border-l-2 border-gray-100 space-y-0.5">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.path;
                        return (
                          <li key={child.path}>
                            <Link
                              href={child.path}
                              className={`block px-3 py-1.5 rounded-md text-[13px] transition-all duration-150 ${
                                isChildActive
                                  ? 'text-blue-700 bg-blue-50/60 font-semibold'
                                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/60'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const isActive = item.path === '/' ? pathname === '/' : pathname === item.path;

            return (
              <li key={item.label}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}>
                    <Icon size={16} className="shrink-0" />
                  </div>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: System Status */}
      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 bg-emerald-50/60 rounded-lg">
          <div className="relative">
            <Shield size={14} className="text-emerald-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse ring-2 ring-emerald-50"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-emerald-700 leading-tight">HIPAA Compliant</span>
            <span className="text-[10px] text-emerald-600/70 leading-tight">AI Systems Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
