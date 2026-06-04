import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { User, Lock, Eye, Sun, Moon, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // State inputs
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Submit states
  const [submittingName, setSubmittingName] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSubmittingName(true);
    try {
      await updateProfile({ name });
      toast.success('Name updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    } finally {
      setSubmittingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Password is required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmittingPassword(true);
    try {
      await updateProfile({ name, password });
      toast.success('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-in-up max-w-3xl">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage profile information, secure your passwords, and personalize your theme.</p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        
        {/* 1. Profile Section */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600 dark:text-purple-400" />
            <span>Profile Details</span>
          </h2>
          
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Email Address (Unchangeable)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-slate-50 dark:bg-slate-950/60 text-slate-450 dark:text-slate-500 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label htmlFor="settings-name" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submittingName}
                className="flex items-center space-x-1.5 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-purple-650 dark:hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 disabled:opacity-75"
              >
                {submittingName ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Security Section */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-600 dark:text-purple-400" />
            <span>Security & Passwords</span>
          </h2>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="settings-password" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  id="settings-password"
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="settings-confirm" className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  id="settings-confirm"
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submittingPassword}
                className="flex items-center space-x-1.5 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-purple-650 dark:hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 disabled:opacity-75"
              >
                {submittingPassword ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3. Personalization Theme Preferences */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600 dark:text-purple-400" />
            <span>Personalization</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Select your default theme mode layout.</p>

          <div className="grid grid-cols-2 gap-4">
            {/* Light Card */}
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                theme === 'light'
                  ? 'border-blue-600 dark:border-purple-500 bg-blue-50/20 dark:bg-purple-950/10 ring-2 ring-blue-600 dark:ring-purple-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'border-slate-205 dark:border-slate-805 hover:bg-slate-50/60 dark:hover:bg-slate-950/20 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">Light Mode</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-550 block">Clean white background, gray cards, blue accents</span>
              </div>
            </button>

            {/* Dark Card */}
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all ${
                theme === 'dark'
                  ? 'border-blue-600 dark:border-purple-500 bg-blue-50/20 dark:bg-purple-950/10 ring-2 ring-blue-600 dark:ring-purple-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'border-slate-205 dark:border-slate-805 hover:bg-slate-50/60 dark:hover:bg-slate-950/20 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="p-2 rounded-lg bg-purple-950 text-purple-400">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">Dark Mode</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-550 block">Sleek slate backgrounds, modern glass cards, purple highlights</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
