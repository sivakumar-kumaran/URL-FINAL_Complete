import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Copy,
  Share2,
  QrCode,
  Trash2,
  Edit2,
  Plus,
  Search,
  Eye,
  EyeOff,
  Lock,
  Calendar,
  MousePointerClick,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  UploadCloud,
} from 'lucide-react';
import urlApi from '../services/urlApi';
import analyticsApi from '../services/analyticsApi';
import QRCodeModal from '../components/QRCodeModal';
import { toast } from 'react-hot-toast';

export const Dashboard = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [qrRecord, setQrRecord] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedUrlForShare, setSelectedUrlForShare] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  
  // Bulk state variables
  const [activeTab, setActiveTab] = useState('single');
  const [bulkInput, setBulkInput] = useState('');
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkParsedUrls, setBulkParsedUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [bulkError, setBulkError] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Fetch Metrics
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: analyticsApi.getDashboardSummary,
  });

  // Fetch URLs
  const { data: urlData, isLoading: isUrlsLoading, refetch } = useQuery({
    queryKey: ['urls', search],
    queryFn: () => urlApi.getUrls({ search, limit: 50 }),
    keepPreviousData: true,
  });

  // Create URL Mutation
  const createMutation = useMutation({
    mutationFn: urlApi.createUrl,
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      queryClient.invalidateQueries(['dashboardSummary']);
      toast.success('Short link created successfully! 🎉');
      setOriginalUrl('');
      setCustomAlias('');
      setPassword('');
      setExpiresAt('');
      setShowAdvanced(false);
    },
    onError: (err) => {
      // Prefer structured validation errors from backend
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const msg = data.errors.map(e => e.msg).join(' | ');
        toast.error(msg);
        return;
      }
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      toast.error('Failed to shorten URL');
    },
  });

  // Delete URL Mutation
  const deleteMutation = useMutation({
    mutationFn: urlApi.deleteUrl,
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      queryClient.invalidateQueries(['dashboardSummary']);
      toast.success('Link deleted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete URL');
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error('Please enter a URL to shorten');
      return;
    }
    createMutation.mutate({
      originalUrl,
      customAlias: customAlias.trim() || undefined,
      password: password || undefined,
      expiresAt: expiresAt || undefined,
    });
  };

  // Bulk URL Mutation
  const bulkCreateMutation = useMutation({
    mutationFn: urlApi.createBulkUrls,
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      queryClient.invalidateQueries(['dashboardSummary']);
      toast.success('Bulk URLs shortened successfully! 🚀');
      setBulkInput('');
      setBulkParsedUrls([]);
      setBulkFile(null);
      setActiveTab('single'); // Switch back to see list
    },
    onError: (err) => {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setBulkError(data.errors.join('\n'));
        toast.error('Some URLs failed validation. Check errors.');
      } else {
        toast.error(data?.message || 'Failed to shorten bulk URLs');
      }
    },
  });

  const handleParseBulk = (text) => {
    const lines = text.split('\n');
    const parsed = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim());
        const originalUrl = parts[0] || '';
        const customAlias = parts[1] || '';
        const password = parts[2] || '';
        const expiresAt = parts[3] || '';

        parsed.push({
          originalUrl,
          customAlias: customAlias || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
        });
      } else {
        parsed.push({
          originalUrl: line,
        });
      }
    }
    setBulkParsedUrls(parsed);
    setBulkError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a .csv or .txt file');
      return;
    }

    setBulkFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setBulkInput(text);
      handleParseBulk(text);
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (bulkParsedUrls.length === 0) {
      toast.error('Please add at least one URL');
      return;
    }
    setBulkError('');
    bulkCreateMutation.mutate(bulkParsedUrls);
  };

  const handleCopyLink = (record) => {
    const code = record.customAlias || record.shortCode;
    const fullLink = `${backendUrl}/${code}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedId(record._id);
    toast.success('Link copied to clipboard! 📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (url) => {
    setSelectedUrlForShare(url);
    setShareModalOpen(true);
  };

  const handleSendShare = async () => {
    if (!shareEmail) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success(`Share link sent to ${shareEmail}! 📧`);
    setShareModalOpen(false);
    setShareEmail('');
    setShareMessage('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 transition-colors duration-300 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="space-y-2 animate-slide-in-down">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Create, manage, and track your shortened links</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Links */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Links</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics?.totalUrls || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <Plus className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Clicks</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics?.totalClicks || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>

          {/* Active Links */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Links</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{metrics?.activeUrls || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Avg Clicks */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Avg Clicks/Link</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {metrics?.totalUrls ? Math.round(metrics.totalClicks / metrics.totalUrls) : 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Create New Link Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-800/50 shadow-lg animate-slide-in-up hover:shadow-xl transition-all duration-300">
          {/* Creation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setActiveTab('single')}
              className={`pb-4 px-6 font-bold text-base sm:text-lg border-b-2 transition-all ${
                activeTab === 'single'
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-black'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Single Link
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`pb-4 px-6 font-bold text-base sm:text-lg border-b-2 transition-all ${
                activeTab === 'bulk'
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-black'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Bulk Shortener
            </button>
          </div>

          {activeTab === 'single' ? (
            <form onSubmit={handleCreate} className="space-y-5 animate-fade-in">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Destination URL *</label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/very/long/path"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                  />
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center space-x-1 transition-colors"
              >
                <span>{showAdvanced ? '▼' : '▶'} Advanced Options</span>
              </button>

              {/* Advanced Panel */}
              {showAdvanced && (
                <div className="p-5 bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-900/10 dark:to-teal-900/10 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in border border-cyan-200/50 dark:border-cyan-900/30">
                  
                  {/* Custom Alias */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Custom Alias</label>
                    <input
                      type="text"
                      placeholder="mylink (optional)"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                    />
                  </div>

                  {/* Password Protection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Link Password</label>
                    <input
                      type="password"
                      placeholder="••••••• (optional)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                    />
                  </div>

                  {/* Expiration Date */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Expiration Date</label>
                    <input
                      type="date"
                      value={expiresAt}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Link will automatically expire on this date (optional)</p>
                  </div>
                </div>
              )}

              {/* Create Button */}
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {createMutation.isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Short Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-5 animate-fade-in">
              {/* Drag and Drop Container */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const fakeEvent = { target: { files: [file] } };
                    handleFileUpload(fakeEvent);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-cyan-400'
                }`}
              >
                <UploadCloud className="w-12 h-12 text-slate-400 dark:text-slate-655 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Drag & drop CSV or TXT file here</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Accepts format: url,alias,password,expiresAt</p>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="bulk-file-input"
                />
                <label
                  htmlFor="bulk-file-input"
                  className="mt-4 inline-block px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors border border-slate-200 dark:border-slate-750"
                >
                  Browse Files
                </label>
                {bulkFile && (
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-2">
                    📄 Loaded: {bulkFile.name}
                  </p>
                )}
              </div>

              {/* Textarea Paste */}
              <div>
                <label className="block text-sm font-semibold text-slate-750 dark:text-slate-300 mb-2">
                  Or Paste Links (one per line)
                </label>
                <textarea
                  rows="5"
                  placeholder="https://example1.com&#10;https://example2.com, custom-alias, password, 2026-12-31"
                  value={bulkInput}
                  onChange={(e) => {
                    setBulkInput(e.target.value);
                    handleParseBulk(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all font-mono text-xs sm:text-sm"
                />
              </div>

              {/* Validation errors alert */}
              {bulkError && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-750 dark:text-red-400 text-xs font-semibold whitespace-pre-line leading-relaxed">
                  <div className="flex items-center space-x-2 mb-1.5 text-sm font-bold text-red-800 dark:text-red-450">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Upload Validation Failed</span>
                  </div>
                  {bulkError}
                </div>
              )}

              {/* Parsed Preview Table */}
              {bulkParsedUrls.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Parsed Preview ({bulkParsedUrls.length})</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setBulkInput('');
                        setBulkParsedUrls([]);
                        setBulkFile(null);
                        setBulkError('');
                      }}
                      className="text-xs text-red-500 hover:text-red-650 font-semibold"
                    >
                      Clear Batch
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white/30 dark:bg-slate-950/20">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400">
                          <th className="p-3">#</th>
                          <th className="p-3">Destination URL</th>
                          <th className="p-3">Alias</th>
                          <th className="p-3">Password</th>
                          <th className="p-3">Expires</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkParsedUrls.map((url, idx) => (
                          <tr key={idx} className="border-b border-slate-100 dark:border-slate-850/50 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-800 dark:text-slate-350">
                            <td className="p-3 font-semibold text-slate-400">{idx + 1}</td>
                            <td className="p-3 font-medium truncate max-w-[180px] sm:max-w-xs" title={url.originalUrl}>{url.originalUrl}</td>
                            <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400">{url.customAlias || '-'}</td>
                            <td className="p-3 text-slate-400">{url.password ? '••••••' : '-'}</td>
                            <td className="p-3 text-slate-500">{url.expiresAt || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bulkCreateMutation.isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {bulkCreateMutation.isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>Shorten Batch ({bulkParsedUrls.length} links)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* URLs List */}
        <div className="space-y-4">
          {isUrlsLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-500 mb-2" />
              <p className="text-slate-600 dark:text-slate-400">Loading your links...</p>
            </div>
          ) : urlData?.urls && urlData.urls.length > 0 ? (
            urlData.urls.map((url) => (
              <div
                key={url._id}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-800/50 shadow-lg hover:shadow-2xl hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-300 animate-slide-in-up group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  
                  {/* Left Side - Link Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
                        {url.customAlias || url.shortCode}
                      </span>
                      {url.isPasswordProtected && (
                        <Lock className="w-4 h-4 text-amber-500" title="Password protected" />
                      )}
                      {url.expiresAt && (
                        <Calendar className="w-4 h-4 text-slate-400" title={`Expires: ${new Date(url.expiresAt).toLocaleDateString()}`} />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{url.originalUrl}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {url.clickCount} clicks • Created {new Date(url.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex items-center space-x-2 md:justify-end flex-wrap gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyLink(url)}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                        copiedId === url._id
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-800/50'
                      }`}
                    >
                      {copiedId === url._id ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(url)}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-all font-semibold text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>

                    {/* QR Code Button */}
                    <button
                      onClick={() => setQrRecord(url)}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all font-semibold text-sm"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-all font-semibold text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/50">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg font-semibold">No links yet</p>
              <p className="text-slate-500 dark:text-slate-500">Create your first shortened link to get started</p>
            </div>
          )}
        </div>

        {/* Share Modal */}
        {shareModalOpen && selectedUrlForShare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-scale-up border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Share Link</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Send this link to someone</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="recipient@example.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message (Optional)</label>
                  <textarea
                    placeholder="Add a personal message..."
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendShare}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {qrRecord && (
          <QRCodeModal
            isOpen={!!qrRecord}
            urlRecord={qrRecord}
            onClose={() => setQrRecord(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
