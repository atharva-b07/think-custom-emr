'use client';

import { Calendar, UserCog, Building, FileText, MessageSquare, Database, Layout, CreditCard, MoreHorizontal, ChevronRight } from 'lucide-react';
import { settingsSections } from '@/data/settingsData';

const iconMap = {
  Calendar, UserCog, Building, FileText, MessageSquare, Database, Layout, CreditCard, MoreHorizontal,
};

const sectionColors = {
  Appointment: 'text-blue-600 bg-blue-50 ring-1 ring-blue-200/50',
  'Provider Account': 'text-purple-600 bg-purple-50 ring-1 ring-purple-200/50',
  Practice: 'text-green-600 bg-green-50 ring-1 ring-green-200/50',
  'Form Builder': 'text-orange-600 bg-orange-50 ring-1 ring-orange-200/50',
  'Patient Communications': 'text-cyan-600 bg-cyan-50 ring-1 ring-cyan-200/50',
  Master: 'text-indigo-600 bg-indigo-50 ring-1 ring-indigo-200/50',
  Templates: 'text-pink-600 bg-pink-50 ring-1 ring-pink-200/50',
  Billing: 'text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200/50',
  More: 'text-gray-600 bg-gray-100 ring-1 ring-gray-200/50',
};

export default function Settings() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure your practice, providers, and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {settingsSections.map(section => {
          const IconComp = iconMap[section.icon] || Calendar;
          const colorClass = sectionColors[section.title] || 'text-gray-600 bg-gray-50 ring-1 ring-gray-200/50';

          return (
            <div key={section.title} className="bg-white border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <IconComp className="w-[18px] h-[18px]" />
                </div>
                <h2 className="text-[13px] font-bold text-gray-800">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {section.items.map(item => (
                  <button key={item.label}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50/80 transition group cursor-pointer">
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
