import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Plus,
  LogIn,
  Bookmark,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Create Sphere', icon: Plus, path: '/dashboard/create' },
    { label: 'Join Sphere', icon: LogIn, path: '/dashboard/join' },
    { label: 'My Spheres', icon: Bookmark, path: '/dashboard/my-spheres' },
    { label: 'Joined Spheres', icon: Bookmark, path: '/dashboard/joined' },
    { label: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="h-screen w-full flex bg-[#0a0a0f] text-[#e2e8f0]">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="w-64 bg-[#0f0f1a] border-r border-[#1e1e2f] flex flex-col z-40 fixed md:relative h-full"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1e1e2f]">
          <h1 className="text-2xl font-black text-[#6366f1] tracking-tight">
            Sphere
            <span className="text-[#64748b]">Test</span>
          </h1>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-[#1e1e2f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6366f1] rounded-full flex items-center justify-center font-bold text-[#0a0a0f]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems
            .filter((item) => item.label !== 'Settings') // Hide settings for now
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/');

              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#6366f1]/10 text-[#6366f1] border-l-3 border-[#6366f1] pl-4'
                      : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1e1e2f]'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <Icon size={18} />
                  {item.label}
                </motion.button>
              );
            })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#1e1e2f]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-[#6366f1] rounded-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
