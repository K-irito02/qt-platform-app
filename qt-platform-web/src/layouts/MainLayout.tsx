import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full relative bg-slate-50/50 transition-colors duration-500">
      {/* Sidebar - Fixed/Sticky on Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10">
        <Header />
        
        <div className="flex-1 px-8 pb-8 pt-2 overflow-y-auto custom-scrollbar">
          <div className="glass-panel rounded-3xl min-h-full p-8 bg-white/30 backdrop-blur-md border-white/20 shadow-none">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
