import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, LogOut, X, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 md:hidden">
        <span className="font-bold text-lg text-slate-800 dark:text-white">Navigation</span>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-purple-950/40 dark:text-purple-400 border-l-4 border-blue-600 dark:border-purple-500'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-450 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-105" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-slate-500 hover:text-red-600 dark:text-slate-450 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-0.5" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-64 h-[calc(100vh-64px)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer Body */}
          <div className="relative flex flex-col w-full max-w-xs h-full bg-white dark:bg-slate-950 shadow-2xl animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
