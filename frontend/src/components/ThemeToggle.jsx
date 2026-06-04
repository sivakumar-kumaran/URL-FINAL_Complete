import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl transition-all duration-300 focus:outline-none border
        ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-purple-400 hover:text-purple-300 hover:bg-slate-850'
            : 'bg-white border-slate-200 text-blue-600 hover:text-blue-500 hover:bg-slate-50'
        } shadow-sm group ${className}`}
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 transform transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transform transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
