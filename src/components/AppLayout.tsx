'use client';

import React from 'react';
import { AppContextProvider, useApp } from '@/context/AppContext';
import Auth from '@/components/Auth';
import Navigation from '@/components/Navigation';

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { currentUser, mounted } = useApp();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-slate-400 font-bold italic animate-pulse">Loading NutriFlux...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 relative overflow-hidden">
      {/* Light Neon Aurora Blur Blobs in Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-400/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-fuchsia-400/15 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none z-0" />

      <div className="flex">
        {/* Navigation Sidebar/Mobile Bar */}
        <Navigation />

        {/* Main Content Area */}
        <main className="w-full md:pl-64 min-h-screen pb-24 md:pb-8 relative z-10 transition-all duration-300">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AppContextProvider>
  );
}
