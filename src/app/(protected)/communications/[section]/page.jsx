'use client';

import { useParams } from 'next/navigation';
import { MessageSquare, Send, Phone, Mail, Radio, BookOpen, Search, ArrowRight } from 'lucide-react';

const sectionConfig = {
  tasks: { title: 'Tasks', icon: BookOpen, description: 'Manage and assign tasks to your team members', color: 'from-blue-500 to-blue-600' },
  fax: { title: 'Fax', icon: Send, description: 'Send and receive faxes securely through the portal', color: 'from-emerald-500 to-emerald-600' },
  chat: { title: 'Chat', icon: MessageSquare, description: 'Real-time messaging with patients and staff', color: 'from-purple-500 to-purple-600' },
  email: { title: 'Email', icon: Mail, description: 'Send and manage patient email communications', color: 'from-amber-500 to-amber-600' },
  broadcast: { title: 'Broadcast', icon: Radio, description: 'Send bulk messages to patient groups', color: 'from-rose-500 to-rose-600' },
  directory: { title: 'Contact Directory', icon: Phone, description: 'Manage your organization contact directory', color: 'from-teal-500 to-teal-600' },
};

export default function Communications() {
  const { section } = useParams();
  const config = sectionConfig[section] || sectionConfig.tasks;
  const Icon = config.icon;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Communications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage all patient and staff communications</p>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl p-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
          <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{config.title}</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{config.description}</p>
          <div className="relative w-full max-w-sm mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder={`Search ${config.title.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-gray-50/80 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition">
            Learn more about {config.title} <ArrowRight className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-gray-400 mt-8 px-6 py-2 bg-gray-50 rounded-full">This module is available in the full version of CustomEMR</p>
        </div>
      </div>
    </div>
  );
}
