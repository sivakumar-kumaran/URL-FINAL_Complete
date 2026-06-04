import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  BarChart3,
  QrCode,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  MousePointerClick,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import Navbar from '../components/Navbar';

export const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [demoUrl, setDemoUrl] = useState('');
  const [demoShortCode, setDemoShortCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [demoCustomAlias, setDemoCustomAlias] = useState('');
  const [demoPassword, setDemoPassword] = useState('');

  const handleDemoShorten = (e) => {
    
    e.preventDefault();
    if (!demoUrl) return;

    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Mock shortening to showcase visual feedback, then prompt login
      // Use custom alias if provided, otherwise random code
      if (demoCustomAlias && demoCustomAlias.trim()) {
        setDemoShortCode(demoCustomAlias.trim());
      } else {
        setDemoShortCode(Math.random().toString(36).substring(2, 9));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 animate-fade-in">
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-cyan-500/10 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-slate-900/60 border border-cyan-100 dark:border-slate-800 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-6 animate-slide-in-down">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shorten, track, and optimize link paths</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight mb-6 animate-slide-in-up">
            Shrink Your Links,{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Expand Your Reach
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 animate-slide-in-up">
            Create custom short codes, download high-resolution QR codes, and monitor visitor analytics in real-time. Beautiful. Secure. Lightning fast.
          </p>

          {/* Quick shorten demo */}
          <div className="max-w-xl mx-auto mb-12 sm:mb-16">
            <form
              onSubmit={handleDemoShorten}
              className="flex flex-col sm:flex-row p-1.5 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 transition-colors animate-slide-in-up"
            >
              <input
                type="url"
                required
                placeholder="Paste your long link here..."
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="flex-grow px-4 py-3 rounded-xl bg-transparent focus:outline-none text-slate-850 dark:text-white placeholder-slate-400 text-sm"
              />
              <button
                type="submit"
                className="mt-2 sm:mt-0 px-4 sm:px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl shrink-0 border-2 border-slate-200 dark:border-slate-800"
              >
                <span>Shorten Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center mt-3 space-x-3">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {showAdvanced ? 'Hide options' : 'Show options'}
              </button>
            </div>

            {showAdvanced && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Custom Alias (optional)</label>
                    <input
                      type="text"
                      name="customAlias"
                      autoComplete="off"
                      placeholder="my-link"
                      value={demoCustomAlias}
                      onChange={(e) => setDemoCustomAlias(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password (optional)</label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="••••••"
                      value={demoPassword}
                      onChange={(e) => setDemoPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {demoShortCode && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-150 dark:border-green-900/30 text-left animate-slide-in">
                <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-1">Demo Shortened URL Created!</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate pr-4">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {window.location.origin}/{demoShortCode}
                      </span>
                      {demoPassword && (
                        <span className="text-xs inline-flex items-center px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/20">
                          <Lock className="w-3.5 h-3.5 mr-1" /> Protected
                        </span>
                      )}
                    </div>
                  <Link
                    to="/register"
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center shrink-0"
                  >
                    <span>Save & get analytics</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Analytics Preview Component Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-slate-100/60 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Real-Time Interactive Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Get deep user-agent details, browser analysis, and daily patterns.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Detailed Click Metrics</h3>
              <p className="text-sm text-slate-555 dark:text-slate-400">
                Track clicks, unique IPs, and timestamp timelines for every short URL instantly.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">QR Code Integrations</h3>
              <p className="text-sm text-slate-555 dark:text-slate-400">
                Auto-generate and download crisp, high-resolution QR codes to bridge the offline-online gap.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Custom Alias & Security</h3>
              <p className="text-sm text-slate-555 dark:text-slate-400">
                Brand your short codes with beautiful aliases, control expiration date boundaries, and keep users safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">About LinkShrink</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              LinkShrink is a modern URL shortening platform designed for professionals who need to track, analyze, and optimize their link performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Lightning Fast</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Get your links shortened instantly with our high-performance infrastructure.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-1">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Deep Analytics</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Track clicks, user agents, geographic data, and more with detailed dashboards.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Enterprise Grade Security</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Your data is encrypted and protected with industry-leading security standards.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose LinkShrink?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Free to get started - no credit card required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Custom short codes and branded links</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Automatic QR code generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Real-time click tracking and analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                  <span>Dark mode and light mode support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-100/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Contact & Support</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have questions about LinkShrink? Learn more about our platform or get in touch with our team.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Website Info Details Card */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About Our Platform</h3>
              <p className="text-slate-600 dark:text-slate-450 leading-relaxed mb-6">
                LinkShrink is a highly secure, lightning-fast URL shortening service engineered for marketers, content creators, and enterprise teams. Built on a modern database-driven architecture, we provide advanced features including custom aliases, password protection, and automatic high-resolution QR code generation.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Bulk URL Uploads</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload multiple links at once using standard CSV or TXT batch formats to shrink your campaign links in bulk.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Real-time Analytics</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monitor browser agents, operating systems, click timestamps, and user counts dynamically via our charts panel.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Advanced Security</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure link expirations and protect sensitive redirects with passwords, keeping your audience and data safe.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Interactive QR Codes</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate and download vector-crisp offline QR codes for marketing material, packaging, and business cards.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Form/Info */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6 animate-slide-in-up flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
                  <p className="text-slate-400 text-xs">Reach out and our support agents will respond within 24 hours.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <span className="font-bold text-sm">✉</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Support Email</p>
                      <p className="text-sm font-semibold text-slate-200">support@linkshrink.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-teal-400 shrink-0">
                      <span className="font-bold text-sm">🗺</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Main Office</p>
                      <p className="text-sm font-semibold text-slate-200">100 Tech Plaza, San Francisco, CA</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-purple-400 shrink-0">
                      <span className="font-bold text-sm">🛡</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Status & Uptime</p>
                      <p className="text-sm font-semibold text-slate-200">99.99% Operational</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  LinkShrink is designed to keep your metrics clean and redirects fast. Check out our dashboard or documentation for integrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
            Take Control of Your Links Today
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Join professional marketers and tech innovators tracking campaigns at scale.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-purple-650 dark:hover:bg-purple-700 text-white font-semibold shadow-md transition-all hover:scale-[1.02]"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Link2 className="w-5 h-5 text-blue-600 dark:text-purple-400" />
            <span className="font-bold text-slate-900 dark:text-white">LinkShrink</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; 2026 LinkShrink URL Shortener Inc. All rights reserved. Made for professionals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
