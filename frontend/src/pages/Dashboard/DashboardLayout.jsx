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
// import { GameButton } from '../../components/GameUI'; // Keeping your imports intact

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
    { label: 'Join Sphere', icon: LogIn, path: '/join' },
    { label: 'My Spheres', icon: Bookmark, path: '/dashboard/my-spheres' },
    { label: 'Joined Spheres', icon: Bookmark, path: '/dashboard/joined' },
    { label: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="h-screen w-full flex global-bg text-gray-900">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="w-64 bg-white border-r-2 border-black flex flex-col z-40 fixed md:relative h-full shadow-[2px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-black bg-white">
          <h1 className="text-3xl font-black text-black uppercase tracking-widest">
            Sphere
            <span className="text-yellow-500 block">Test</span>
          </h1>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b-2 border-black bg-white">
          <div className="flex items-center gap-3 p-3 bg-yellow-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center font-black text-white text-lg border-2 border-black">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase truncate">
                {user?.name}
              </p>
              <p className="text-xs font-bold truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/50">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 border-2 text-sm font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-yellow-300 border-black text-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-white border-black text-black rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  <Icon size={18} />
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              );
            })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-black bg-white">
          <button
            onClick={handleLogout}
            className="w-full game-box game-btn-danger"
          >
            <div className="game-box-shadow" />
            <div className="game-box-content text-white text-xs">
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-yellow-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
      >
        {sidebarOpen ? (
          <X size={20} className="text-black" />
        ) : (
          <Menu size={20} className="text-black" />
        )}
      </button>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}