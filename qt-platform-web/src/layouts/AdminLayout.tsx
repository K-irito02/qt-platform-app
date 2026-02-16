import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Header } from '@/components/layout/Header';
import { useAppSelector } from '@/store/hooks';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check admin role
    const isAdmin = user?.roles?.some((r: string) => ['ADMIN', 'SUPER_ADMIN'].includes(r));
    if (!isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen w-full relative bg-slate-900/10 transition-colors duration-500">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10">
        <Header />
        
        <div className="flex-1 px-8 pb-8 pt-2 overflow-y-auto custom-scrollbar">
          <div className="glass-panel rounded-3xl min-h-full p-8 bg-white/40 backdrop-blur-xl border-white/20 shadow-none">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
