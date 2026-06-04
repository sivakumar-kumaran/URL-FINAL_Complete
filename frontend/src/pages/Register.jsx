import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Zap, CheckCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { toast } from 'react-hot-toast';

export const Register = () => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Password validation checks (match backend: minimum 6 chars)
  const isPasswordStrong = password.length >= 6;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!isPasswordStrong) {
      toast.error('Password must contain uppercase, lowercase, and numbers');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backend}/api/auth/config`).then(r => r.json()).then(cfg => {
      if (!cfg.google) {
        toast.error('Google OAuth not configured on backend');
        return;
      }
      const url = `${backend}/api/auth/google`;
      const win = window.open(url, '_blank', 'width=500,height=700');
      if (!win) {
        toast.error('Popup blocked. Please allow popups for this site.');
      }
    }).catch(() => {
      toast.error('Unable to contact backend for OAuth configuration');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-4 transition-colors duration-300 relative overflow-hidden animate-fade-in">
      {/* Animated Background */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-cyan-300/40 to-teal-300/30 rounded-full blur-3xl -z-10 dark:from-cyan-900/20 dark:to-teal-900/10 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-teal-300/40 to-cyan-300/30 rounded-full blur-3xl -z-10 dark:from-teal-900/20 dark:to-cyan-900/10"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute sm:top-6 sm:right-6 top-4 right-4 p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg z-30"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-down">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 shadow-2xl hover:shadow-teal-200/50 dark:hover:shadow-teal-900/50 transition-all transform hover:scale-105 mb-4">
            <Zap className="w-10 h-10 text-white" />
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">Join thousands using LinkShrink</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-slate-800/50 p-8 space-y-5 animate-slide-in-up">
          
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 transition-colors group-focus-within:text-teal-600 z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 transition-colors group-focus-within:text-teal-600 z-10 pointer-events-none" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 transition-colors group-focus-within:text-teal-600 z-10 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-16 sm:pr-12 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors w-9 h-9 flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password strength visual removed to match backend validation */}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500 transition-colors group-focus-within:text-teal-600 z-10 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-16 sm:pr-12 py-3 rounded-xl border-2 transition-all backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  confirmPassword && passwordsMatch
                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30'
                    : confirmPassword && !passwordsMatch
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30'
                    : 'border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-200 dark:focus:ring-cyan-900/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors w-9 h-9 flex items-center justify-center"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && passwordsMatch && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Passwords match</span>
              </p>
            )}
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>Passwords don't match</span>
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !isPasswordStrong || !passwordsMatch}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700"></div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700"></div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold transition-all flex items-center justify-center space-x-3 group backdrop-blur-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-slate-600 dark:text-slate-400 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors hover:underline">
            Sign in here
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6">
          By signing up, you agree to our{' '}
          <a href="#" className="hover:underline text-cyan-600 dark:text-cyan-400">Terms of Service</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
