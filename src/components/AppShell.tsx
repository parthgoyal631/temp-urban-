import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  BusFront,
  Camera,
  Compass,
  Construction,
  Droplets,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  LayoutDashboard,
  MapPin,
  Menu,
  Play,
  Radio,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sliders,
  Sparkles,
  TrendingUp,
  Video,
  Waves,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { Badge, Button } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';
import { PrototypeIntegrationModal } from './PrototypeIntegrationModal';

export type ActiveTab =
  | 'overview'
  | 'prototype'
  | 'detections'
  | 'fleet'
  | 'incidents'
  | 'roads'
  | 'traffic'
  | 'heatmap'
  | 'routes'
  | 'infrastructure'
  | 'analytics'
  | 'reports'
  | 'alerts'
  | 'settings';

interface AppShellProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const {
    prototypeConfig,
    detections,
    incidents,
    alerts,
    isSimulationActive,
    setIsSimulationActive,
  } = useUrbanData();

  const [isPrototypeModalOpen, setIsPrototypeModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const criticalDetections = detections.filter((d) => d.severity === 'critical').length;

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: 'overview', label: 'Command GIS Center', icon: <LayoutDashboard size={17} /> },
    {
      id: 'prototype',
      label: 'Flow Prototype Studio',
      icon: <Sparkles size={17} className="text-blue-600" />,
      badge: 'LIVE',
    },
    {
      id: 'detections',
      label: 'Visual AI Detections',
      icon: <Camera size={17} />,
      badge: detections.length,
    },
    { id: 'fleet', label: 'Transit Fleet & Cams', icon: <BusFront size={17} /> },
    {
      id: 'incidents',
      label: 'Incident Work Orders',
      icon: <ShieldAlert size={17} />,
      badge: incidents.filter((i) => i.status === 'new' || i.status === 'in-progress').length,
    },
    { id: 'roads', label: 'Road PQI & Defects', icon: <Construction size={17} /> },
    { id: 'traffic', label: 'Traffic & Bottlenecks', icon: <Waves size={17} /> },
    { id: 'heatmap', label: 'Hazard Heatmaps', icon: <Flame size={17} /> },
    { id: 'routes', label: 'Transit Corridors', icon: <Compass size={17} /> },
    { id: 'infrastructure', label: 'Infrastructure Assets', icon: <Building2 size={17} /> },
    { id: 'analytics', label: 'Intelligence Analytics', icon: <BarChart3 size={17} /> },
    { id: 'reports', label: 'Executive Reports', icon: <Activity size={17} /> },
    {
      id: 'alerts',
      label: 'Supervisor Alerts',
      icon: <Bell size={17} />,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
    { id: 'settings', label: 'Bridge Settings', icon: <Settings size={17} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-500/20">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-xs">
        {/* Left: Brand Identity & Prototype Tool Indicator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            {isMobileSidebarOpen ? <X size={20} className="rounded-[1px]" /> : <Menu size={20} className="rounded-[1px]" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-slate-900">
                  UrbanFlow <span className="text-blue-600">AI</span>
                </h1>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
                  VISION OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Municipal Road & Transit Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center: External Prototype Status Pill */}
        <button
          onClick={() => onTabChange('prototype')}
          className="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-600 transition-colors cursor-pointer"
          title="Open Flow Prototype Studio"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400 font-medium">Flow Tool:</span>
          <span className="text-slate-900 font-semibold">{prototypeConfig.toolId.substring(0, 8)}...</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-medium">{prototypeConfig.averageInferenceLatencyMs}ms</span>
          <span className="px-1.5 py-0.2 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold border border-blue-200">
            OPEN STUDIO
          </span>
        </button>

        {/* Right: Actions & Integration Hub CTA */}
        <div className="flex items-center gap-2.5">
          {/* Prototype Bridge CTA Button */}
          <Button
            size="sm"
            variant="brand"
            className="text-xs font-mono px-3.5 py-1.5"
            onClick={() => setIsPrototypeModalOpen(true)}
          >
            <Radio size={14} className="text-white animate-pulse" />
            <span className="hidden sm:inline">Prototype Hub</span>
            <span className="sm:hidden">Bridge</span>
          </Button>

          {/* Quick Simulation Toggle */}
          <button
            onClick={() => setIsSimulationActive(!isSimulationActive)}
            title={isSimulationActive ? 'Pause Ingest Simulation' : 'Resume Live Ingest'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              isSimulationActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSimulationActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="hidden sm:inline">{isSimulationActive ? 'Live Monitoring' : 'Paused'}</span>
          </button>

          {/* Quick Alerts Button */}
          <button
            onClick={() => onTabChange('alerts')}
            className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Bell size={16} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Body Area: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-3.5 transition-transform duration-200 lg:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0 pt-20 shadow-xl' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Operations & Feeds
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Prototype Integration Quick Card */}
          <div className="pt-3 border-t border-slate-100">
            <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-blue-100 font-bold uppercase tracking-wider text-[10px]">PROTOTYPE LINK</span>
                <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">ONLINE</span>
              </div>
              <p className="text-xs font-medium text-white leading-relaxed">
                Detection engine synced with Google Flow Analysis Tool.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono bg-blue-700/60 p-2 rounded-lg">
                <span className="truncate">ID: {prototypeConfig.toolId.substring(0, 14)}...</span>
                <a
                  href={prototypeConfig.toolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:underline flex items-center gap-1 shrink-0 ml-1"
                >
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Bottom Status Footer */}
      <footer className="h-8 bg-white border-t border-slate-200 px-6 hidden sm:flex items-center justify-between text-[10px] text-slate-400 font-mono flex-shrink-0">
        <div className="flex items-center space-x-6">
          <span>FPS: 60.0</span>
          <span>LAT: {prototypeConfig.averageInferenceLatencyMs}ms</span>
          <span>INGEST: ACTIVE</span>
        </div>
        <div className="uppercase tracking-widest font-semibold text-slate-400">
          &copy; UrbanFlow AI — Clean Minimalist Intelligence Platform
        </div>
      </footer>

      {/* External Prototype Integration Modal */}
      <PrototypeIntegrationModal
        isOpen={isPrototypeModalOpen}
        onClose={() => setIsPrototypeModalOpen(false)}
      />
    </div>
  );
};
