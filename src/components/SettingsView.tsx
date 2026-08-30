import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Radio,
  RefreshCw,
  Save,
  Server,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const SettingsView: React.FC = () => {
  const { prototypeConfig, updatePrototypeConfig } = useUrbanData();
  const [toolId, setToolId] = useState(prototypeConfig.toolId);
  const [toolUrl, setToolUrl] = useState(prototypeConfig.toolUrl);
  const [endpointUrl, setEndpointUrl] = useState(prototypeConfig.endpointUrl);
  const [confidenceCutoff, setConfidenceCutoff] = useState(prototypeConfig.modelConfidenceCutoff);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrototypeConfig({
      toolId,
      toolUrl,
      endpointUrl,
      modelConfidenceCutoff: confidenceCutoff,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● PLATFORM CONFIGURATION & FLOW BRIDGE
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Prototype Parameters & Edge Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure integration endpoints, confidence cutoff thresholds, and external model linkages.
          </p>
        </div>

        {saved && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>Configuration Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <Card className="p-6 bg-white border-slate-200 rounded-2xl shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 font-mono uppercase tracking-wider mb-1">
              Google Labs Flow Prototype Integration
            </h3>
            <p className="text-xs text-slate-500">
              The shared tool link that powers the autonomous edge detection and model inference pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">GOOGLE LABS FLOW TOOL ID</label>
              <input
                type="text"
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">FLOW PROTOTYPE WEB APP URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={toolUrl}
                  onChange={(e) => setToolUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <a
                  href={toolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center gap-1.5 font-medium text-xs hover:bg-blue-100 transition-all"
                >
                  <span>Open</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">WEBHOOK INGESTION ENDPOINT</label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-medium">
                  MINIMUM AI CONFIDENCE CUTOFF: {(confidenceCutoff * 100).toFixed(0)}%
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Filters out low-probability hallucinations</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={confidenceCutoff}
                onChange={(e) => setConfidenceCutoff(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" type="submit" className="font-mono text-xs px-6 py-2.5">
              <Save size={14} />
              Save Integration Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
