'use client';

import { useState } from 'react';
import { Bot, Users, HelpCircle, Clock, DollarSign, Stethoscope, Heart, Edit, Code, Phone, Briefcase, Pill, Settings, Zap, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { agentStats, agents, agentCards, spendingData } from '@/data/aiAgentsData';

const statIcons = { Bot, Users, HelpCircle, Clock, DollarSign };
const agentIcons = { Stethoscope, Heart, Edit, Code, Phone, Briefcase, Pill };

const statCardColors = [
  'border-l-blue-500', 'border-l-purple-500', 'border-l-green-500', 'border-l-amber-500', 'border-l-emerald-500'
];

export default function AIAgents() {
  const [activeAgent, setActiveAgent] = useState('dashboard');
  const [timePeriod, setTimePeriod] = useState('12 Months');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">AI Agents</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitor and manage your AI-powered healthcare assistants</p>
      </div>

      <div className="flex gap-5">
        {/* Left Sidebar */}
        <div className="w-60 shrink-0 bg-white border border-gray-200/80 rounded-xl overflow-hidden self-start" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <button onClick={() => setActiveAgent('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium transition cursor-pointer ${activeAgent === 'dashboard' ? 'bg-blue-50/80 text-blue-700 border-l-[3px] border-l-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Bot className="w-[18px] h-[18px]" /> Dashboard
          </button>
          {agents.map(agent => {
            const Icon = agentIcons[agent.icon] || Bot;
            return (
              <button key={agent.id} onClick={() => setActiveAgent(agent.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] transition cursor-pointer ${activeAgent === agent.name ? 'bg-blue-50/80 text-blue-700 border-l-[3px] border-l-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">{agent.name}</span>
                {agent.isActive && <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />}
              </button>
            );
          })}
          <div className="border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition cursor-pointer"><Zap className="w-[18px] h-[18px]" /> Integrations</button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition cursor-pointer"><Settings className="w-[18px] h-[18px]" /> Settings</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-3">
            {agentStats.map((stat, i) => {
              const Icon = statIcons[stat.icon] || Bot;
              return (
                <div key={stat.label} className={`bg-white rounded-xl border border-gray-200/80 border-l-4 ${statCardColors[i]} p-4 hover:shadow-md transition-all duration-200`} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-5">
            {/* Spending Chart */}
            <div className="col-span-2 bg-white border border-gray-200/80 rounded-xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total AI Agents Spent</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">$847.50</div>
                </div>
                <div className="flex items-center gap-0.5 bg-gray-50/80 rounded-lg p-1 border border-gray-200/60">
                  {['12 Months', '6 Months', '30 Days', '7 Days'].map(p => (
                    <button key={p} onClick={() => setTimePeriod(p)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${timePeriod === p ? 'bg-white text-gray-800 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Amount']} />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Widget */}
            <div className="bg-white border border-gray-200/80 rounded-xl p-5 space-y-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-gray-800">JUNE BUDGET</div>
                <select className="text-[11px] border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20"><option>Last 30 Days</option></select>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">$245.80 <span className="text-base font-normal text-gray-400">/ $1200</span></div>
                <div className="text-[11px] text-gray-500 mt-1">Resets in 17 days. <span className="text-blue-600 cursor-pointer hover:underline font-medium">Edit budget</span></div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Total interactions</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-bold text-gray-800">24,567</span>
                    <span className="text-[11px] text-green-600 font-semibold">+3.4%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Total requests</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-bold text-gray-800">1,847</span>
                    <span className="text-[11px] text-green-600 font-semibold">+3.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-3 gap-4">
            {agentCards.map(card => (
              <div key={card.name} className="bg-white border border-gray-200/80 rounded-xl p-5 hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="text-[13px] font-bold text-blue-700 mb-1">{card.name}</div>
                <div className="text-[11px] text-gray-500 mb-4">{card.interactions} interactions &middot; {card.tokens.toLocaleString()} tokens</div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div><div className="text-base font-bold text-green-600">{card.monthlySpend}</div><div className="text-[10px] text-gray-500">Monthly spend</div></div>
                  <div><div className="text-base font-bold text-gray-800">{card.accuracyRate}</div><div className="text-[10px] text-gray-500">Accuracy rate</div></div>
                  <div><div className="text-base font-bold text-gray-800">{card.avgResponse}</div><div className="text-[10px] text-gray-500">Avg response</div></div>
                </div>
                <ResponsiveContainer width="100%" height={50}>
                  <BarChart data={[{v:40},{v:30},{v:50},{v:45},{v:35},{v:55},{v:60}]}>
                    <Bar dataKey="v" fill="#3b82f6" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer" style={{ boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}>
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
