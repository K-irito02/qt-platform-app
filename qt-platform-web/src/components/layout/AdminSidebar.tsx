import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MessageSquare, 
  FolderTree, 
  Palette, 
  Server, 
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';

export const AdminSidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: t('admin.dashboard') || '仪表盘', end: true },
    { to: '/admin/users', icon: Users, label: t('admin.users') || '用户管理' },
    { to: '/admin/products', icon: Package, label: t('admin.products') || '产品管理' },
    { to: '/admin/categories', icon: FolderTree, label: t('admin.categories') || '分类管理' },
    { to: '/admin/comments', icon: MessageSquare, label: t('admin.comments') || '评论管理' },
    { to: '/admin/theme', icon: Palette, label: t('admin.theme') || '主题设置' },
    { to: '/admin/system', icon: Server, label: t('admin.system') || '系统设置' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 z-40 p-4">
      <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl text-white">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/30">
            Qt
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/10 text-white font-semibold shadow-sm" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={cn(
                    "transition-transform duration-300",
                    isActive ? "scale-110 text-rose-400" : "group-hover:scale-105"
                  )} />
                  <span className="z-10">{item.label}</span>
                  
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-l-full shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto p-4 border-t border-white/10 space-y-2 bg-black/20">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-white transition-colors" />
            <span className="font-medium">返回前台</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
