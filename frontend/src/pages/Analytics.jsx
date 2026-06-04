import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Activity,
  Globe,
  Monitor,
  CheckCircle,
  XCircle,
  HelpCircle,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import analyticsApi from '../services/analyticsApi';
import urlApi from '../services/urlApi';
import AnalyticsChart from '../components/AnalyticsChart';

export const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeChartTab, setActiveChartTab] = useState('daily');
  const [listSearch, setListSearch] = useState('');

  // 1. Fetch all URLs (to show the select menu if no URL is selected, or for navigation dropdown)
  const { data: urlListData, isLoading: isListLoading } = useQuery({
    queryKey: ['urlsForAnalytics', listSearch],
    queryFn: () => urlApi.getUrls({ search: listSearch, limit: 100 }),
    enabled: !id || id === '',
  });

  // 2. Fetch specific URL analytics
  const { data: analytics, isLoading: isAnalyticsLoading, error } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => analyticsApi.getUrlAnalytics(id),
    enabled: !!id,
    retry: false,
  });

  // Color scheme for Pie Charts (Browser, OS, Device)
  const COLORS = ['#2563eb', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const renderPieBreakdown = (data, title, Icon) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-52 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
          <span className="text-xs text-slate-400 dark:text-slate-500">No agent data recorded</span>
        </div>
      );
    }

  return (
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-purple-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{title} Distribution</h3>
        </div>
        
        <div className="grid grid-cols-2 items-center">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    borderRadius: '8px', 
                    fontSize: '11px', 
                    border: 'none',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-1.5 pl-2 max-h-36 overflow-y-auto">
            {data.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-650 dark:text-slate-400 font-semibold truncate max-w-[70px]">
                  {item.name}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">
                  ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // State if ID is not selected: Render picker list
  if (!id) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select Link Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Choose a link path below to analyze metrics and browser trends.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search links to analyze..."
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-905 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 outline-none text-sm shadow-sm"
          />
        </div>

        {/* Links Picker List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {isListLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-150 dark:bg-slate-850 rounded w-48"></div>
                    <div className="h-3 bg-slate-150 dark:bg-slate-850 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-slate-150 dark:bg-slate-850 rounded w-20"></div>
                </div>
              ))
            ) : urlListData?.urls?.length === 0 ? (
              <div className="p-8 text-center text-slate-450 dark:text-slate-500">
                No URLs found. Head back to the <Link to="/dashboard" className="text-blue-600 dark:text-purple-400 font-bold hover:underline">Dashboard</Link> to generate some short links first.
              </div>
            ) : (
              urlListData?.urls?.map((url) => (
                <div 
                  key={url._id} 
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-sm gap-4 animate-slide-in-up"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        /{url.customAlias || url.shortCode}
                      </span>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {url.clickCount} clicks
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-550 truncate break-all">
                      {url.originalUrl}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/analytics/${url._id}`)}
                    className="self-start sm:self-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 transition-all duration-300 hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // State: specific URL loading status
  if (isAnalyticsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 dark:border-slate-800 border-t-blue-600 dark:border-t-purple-500 animate-spin"></div>
        <span className="text-sm font-semibold text-slate-400">Loading Analytics Reports...</span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Failed to Load Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The link analytics record could not be loaded or you do not have permission to view it.
        </p>
        <Link
          to="/analytics"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 dark:bg-purple-650 text-white font-medium text-xs hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Select Another Link</span>
        </Link>
      </div>
    );
  }

  const { url, totalClicks, lastVisited, recentVisits, dailyTrends, weeklyTrends, browserMetrics, osMetrics, deviceMetrics } = analytics;
  const isExpired = url.expiresAt && new Date() > new Date(url.expiresAt);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header with navigation back */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-2">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Link Picker</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span>Link Performance Report</span>
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-550 break-all">
            Short Code: <span className="font-bold text-slate-700 dark:text-slate-300">/{url.customAlias || url.shortCode}</span>
            {' | '}
            Destination:{' '}
            <a 
              href={url.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-purple-400 hover:underline inline-flex items-center space-x-0.5"
            >
              <span className="truncate max-w-[200px] sm:max-w-xs">{url.originalUrl}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </div>
      </div>

      {/* 2. Top Section Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
          <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Total Clicks</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">{totalClicks}</span>
        </div>

        {/* Last Visited */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
          <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Last Visited</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 mt-2.5 block truncate">
            {lastVisited
              ? new Date(lastVisited).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Never visited'}
          </span>
        </div>

        {/* Created Date */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
          <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Created Date</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 mt-2.5 block">
            {new Date(url.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Status */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out animate-slide-in-up">
          <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Status</span>
          <div className="mt-2.5">
            {isExpired ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/35">
                Expired
              </span>
            ) : url.isActive ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 dark:bg-green-955/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/35">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 border border-slate-205 dark:border-slate-750">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Trends Charts Panel */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Activity className="w-5 h-5 text-blue-600 dark:text-purple-400" />
              <span>Visitor Traffic Over Time</span>
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review click trends and peaks for your campaigns.</p>
          </div>
          
          {/* Daily/Weekly Tabs */}
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-950 rounded-lg self-start sm:self-center">
            <button
              onClick={() => setActiveChartTab('daily')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeChartTab === 'daily'
                  ? 'bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-purple-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              Daily Trend
            </button>
            <button
              onClick={() => setActiveChartTab('weekly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeChartTab === 'weekly'
                  ? 'bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-purple-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              Weekly Trend
            </button>
          </div>
        </div>

        {/* Recharts chart */}
        <div key={activeChartTab} className="animate-fade-in">
          <AnalyticsChart 
            data={activeChartTab === 'daily' ? dailyTrends : weeklyTrends} 
            type={activeChartTab} 
          />
        </div>
      </div>

      {/* 4. Browser / Device / OS Distributions */}
      <div className="grid md:grid-cols-3 gap-6">
        {renderPieBreakdown(browserMetrics, 'Browser', Globe)}
        {renderPieBreakdown(deviceMetrics, 'Device', Monitor)}
        {renderPieBreakdown(osMetrics, 'Operating System', Monitor)}
      </div>

      {/* 5. Recent Visits Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Visitors Log (Latest 20)</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Real-time user agents details from clicks.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">IP Address</th>
                <th className="px-6 py-3.5">Browser</th>
                <th className="px-6 py-3.5">Device</th>
                <th className="px-6 py-3.5">Operating System</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-105 dark:divide-slate-800/80 text-sm">
              {recentVisits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 dark:text-slate-500">
                    No clicks recorded for this URL yet. Share it to collect visitor analytics!
                  </td>
                </tr>
              ) : (
                recentVisits.map((visit) => (
                  <tr key={visit._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/5 transition-colors">
                    <td className="px-6 py-3.5 text-xs text-slate-500 dark:text-slate-450">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(visit.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-medium font-mono text-xs text-slate-700 dark:text-slate-350">
                      {visit.ipAddress}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-350">
                      {visit.browser}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded-md font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400">
                        {visit.device || 'Desktop'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-350">
                      {visit.os}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
