import React, { useState } from 'react';
import {
  Calendar,
  Compass,
  Filter,
  Flame,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const HeatmapView: React.FC = () => {
  const { detections } = useUrbanData();
  const [heatmapType, setHeatmapType] = useState<'defects' | 'water' | 'congestion' | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [intensityCutoff, setIntensityCutoff] = useState<number>(75);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● GEOSPATIAL HAZARD CLUSTERING
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Hazard Density & Defect Heatmaps</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kernel density estimation calculated from historical and real-time detection coordinates.
          </p>
        </div>

        {/* Heatmap Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {(
            [
              { id: 'all', label: 'All Hazards' },
              { id: 'defects', label: 'Potholes & Cracks' },
              { id: 'water', label: 'Waterlogging / Floods' },
              { id: 'congestion', label: 'Transit Bottlenecks' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHeatmapType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                heatmapType === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-slate-200 bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Visual Canvas */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />

        {/* River vector */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
          <path
            d="M -50 160 Q 200 140, 360 220 T 700 280 T 1100 230 T 1400 320"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="32"
          />
        </svg>

        {/* Road vector paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
          <path d="M 50 360 L 320 340 L 580 260 L 850 240 L 1200 210" fill="none" stroke="#cbd5e1" strokeWidth="8" />
          <path d="M 580 50 L 580 260 L 540 440 L 460 560" fill="none" stroke="#cbd5e1" strokeWidth="7" />
        </svg>

        {/* Dynamic Glow Clusters */}
        {(heatmapType === 'all' || heatmapType === 'defects') && (
          <div className="absolute top-[42%] left-[45%] w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-500/40 via-orange-400/25 to-yellow-300/0 blur-3xl animate-pulse" />
        )}

        {(heatmapType === 'all' || heatmapType === 'water') && (
          <div className="absolute top-[58%] left-[26%] w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-500/40 via-blue-400/25 to-transparent blur-3xl" />
        )}

        {(heatmapType === 'all' || heatmapType === 'congestion') && (
          <div className="absolute top-[28%] left-[70%] w-60 h-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400/35 via-yellow-300/20 to-transparent blur-3xl" />
        )}

        {/* Point Annotations */}
        {detections.map((det) => (
          <div
            key={det.id}
            style={{
              left: `${30 + ((det.location.longitude - 80.92) / 0.05) * 50}%`,
              top: `${70 - ((det.location.latitude - 26.83) / 0.04) * 50}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 shadow-md shadow-blue-500/50 animate-ping"
          />
        ))}

        {/* Overlay Controls HUD */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 flex items-center gap-4 text-xs font-mono text-slate-800 shadow-md">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">INTENSITY:</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-blue-600 font-medium">Low Density</span>
              <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 shadow-2xs" />
              <span className="text-[10px] text-red-600 font-medium">Hotspot</span>
            </div>
          </div>

          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-xs font-mono text-slate-700 shadow-md">
            <Flame size={14} className="text-amber-500" />
            <span className="font-medium">Kernel Radius: 450m · Confidence &gt; 80%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
