'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Calendar, Bell, ChevronDown, User, LogOut, Plus, Command } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40">
      <div className="flex items-center h-16 px-6">
        {/* Left: Search */}
        <div className="flex-1 flex items-center">
          <div className="relative w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-9 pr-20 py-2 text-sm bg-gray-50/80 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-gray-400">
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 border border-gray-200 rounded">
                <Command size={10} /> K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Date */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 mr-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-xs font-medium">{dateStr}</span>
          </div>

          <div className="w-px h-8 bg-gray-200 mx-1"></div>

          {/* New Button */}
          <button className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-white rounded-md cursor-pointer" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
            <Plus size={14} />
            <span>New</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="w-px h-8 bg-gray-200 mx-1"></div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'User'}</span>
                <span className="text-[10px] text-gray-400 leading-tight">{user?.role || 'Role'}</span>
              </div>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1" style={{ boxShadow: '0 10px 40px -4px rgba(0,0,0,0.1)' }}>
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.role || 'Role'}</div>
                </div>
                <div className="py-1">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                    <User size={15} /> Profile Settings
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
