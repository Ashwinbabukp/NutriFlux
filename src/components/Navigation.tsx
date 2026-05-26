'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Navigation() {
  const pathname = usePathname();
  const { currentUser, handleLogout } = useApp();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'Log Food',
      path: '/track',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Kerala Hub',
      path: '/kerala-hub',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Desktop Left Sidebar Navigation */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 bg-white/70 backdrop-blur-xl border-r border-slate-200/80 p-6 z-20 justify-between">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black italic bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent filter drop-shadow-[0_1px_5px_rgba(6,182,212,0.1)]">
              NutriFlux
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-700 border-l-4 border-cyan-500 pl-3'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  <span className={`${isActive ? 'text-cyan-600' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Info & Logout */}
        <div className="border-t border-slate-150 pt-4 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black">
              {currentUser ? currentUser.substring(0, 2).toUpperCase() : 'NF'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Logged in as</p>
              <p className="text-xs font-black text-slate-700 truncate mt-1 leading-tight" title={currentUser || ''}>
                {currentUser}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-150 py-2.5 text-xs font-black italic text-red-650 text-red-600 hover:text-red-750 transition active:scale-95 shadow-sm"
            style={{ fontFamily: 'Poppins' }}
          >
            <span>Logout ➔</span>
          </button>
        </div>
      </aside>

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-lg border border-slate-200/70 shadow-2xl rounded-2xl p-1 z-35 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl flex-1 text-center transition-all ${
                isActive
                  ? 'text-cyan-600 scale-105'
                  : 'text-slate-450 text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`p-1 rounded-lg ${isActive ? 'bg-cyan-50' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
