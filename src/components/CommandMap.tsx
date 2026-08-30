import React, { useState } from 'react';
import {
  AlertTriangle,
  BusFront,
  Camera,
  CircleAlert,
  Compass,
  Construction,
  Droplets,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import type { Bus, DetectionEvent, Incident, Severity } from '../types/domain';
import { Badge } from './ui';

export type MapLayers = {
  buses: boolean;
  defects: boolean;
  waterlogging: boolean;
  traffic: boolean;
  incidents: boolean;
  heatmap: boolean;
  satellite: boolean;
};

interface CommandMapProps {
  buses: Bus[];
  detections: DetectionEvent[];
  incidents: Incident[];
  layers: MapLayers;
  onToggleLayer: (layer: keyof MapLayers) => void;
  selectedId?: string;
  onSelect: (item: { type: 'bus' | 'detection' | 'incident'; data: any }) => void;
  className?: string;
}

// Convert Lucknow coordinates to canvas percentage
const getCoordinatesPosition = (latitude: number, longitude: number) => {
  // Center: ~26.85, 80.94. Bounds: Lat [26.81 .. 26.89], Lng [80.90 .. 80.98]
  const minLat = 26.815;
  const maxLat = 26.885;
  const minLng = 26.895;
  const maxLng = 26.975;

  const left = Math.max(8, Math.min(92, ((longitude - minLng) / (maxLng - minLng)) * 100));
  const top = Math.max(8, Math.min(92, (1 - (latitude - minLat) / (maxLat - minLat)) * 100));

  return { left: `${left}%`, top: `${top}%` };
};

export const CommandMap: React.FC<CommandMapProps> = ({
  buses,
  detections,
  incidents,
  layers,
  onToggleLayer,
  selectedId,
  onSelect,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const roadDefects = detections.filter(
    (d) => d.category === 'pothole' || d.category === 'road-crack' || d.category === 'debris-hazard'
  );
  const waterEvents = detections.filter(
    (d) => d.category === 'waterlogging' || d.category === 'drainage-clog'
  );
  const trafficEvents = detections.filter(
    (d) => d.category === 'traffic-congestion' || d.category === 'illegal-parking'
  );

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex flex-col shadow-xs ${
        isFullScreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[520px]'
      } ${className}`}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Status Chip */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-sm text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-900 font-semibold">GIS COMMAND</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">
            {buses.length} Fleet · {detections.length} AI Detections
          </span>
        </div>

        {/* Map Layers Toolbar */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => onToggleLayer('buses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              layers.buses
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BusFront size={13} />
            <span>Fleet ({buses.length})</span>
          </button>

          <button
            onClick={() => onToggleLayer('defects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              layers.defects
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Construction size={13} />
            <span>Defects ({roadDefects.length})</span>
          </button>

          <button
            onClick={() => onToggleLayer('waterlogging')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              layers.waterlogging
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Droplets size={13} />
            <span>Floods ({waterEvents.length})</span>
          </button>

          <button
            onClick={() => onToggleLayer('traffic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              layers.traffic
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Waves size={13} />
            <span>Traffic</span>
          </button>

          <button
            onClick={() => onToggleLayer('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
              layers.heatmap
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles size={13} />
            <span>Heatmap</span>
          </button>
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden select-none transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Background Grid & GIS Aesthetic Vector Layers */}
        <div className="absolute inset-0 bg-[#070d12] bg-[linear-gradient(to_right,#142028_1px,transparent_1px),linear-gradient(to_bottom,#142028_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />

        {/* Gomti River Vector Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path
            d="M -50 160 Q 200 140, 360 220 T 700 280 T 1100 230 T 1400 320"
            fill="none"
            stroke="#164e63"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M -50 160 Q 200 140, 360 220 T 700 280 T 1100 230 T 1400 320"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
            strokeDasharray="8 6"
          />
        </svg>

        {/* Major Transit Corridors / Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
          {/* Main Arterial MG Marg (East-West) */}
          <path
            d="M 50 360 L 320 340 L 580 260 L 850 240 L 1200 210"
            fill="none"
            stroke="#243b47"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 50 360 L 320 340 L 580 260 L 850 240 L 1200 210"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* North-South Ring Road */}
          <path
            d="M 580 50 L 580 260 L 540 440 L 460 560"
            fill="none"
            stroke="#243b47"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Trans-Gomti Flyover */}
          <path
            d="M 320 340 L 420 180 L 720 120 L 980 160"
            fill="none"
            stroke="#1e3a47"
            strokeWidth="7"
          />
        </svg>

        {/* Heatmap Overlay Layer */}
        {layers.heatmap && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[32%] left-[44%] w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-600/30 via-orange-500/20 to-yellow-400/0 blur-2xl animate-pulse" />
            <div className="absolute top-[52%] left-[28%] w-56 h-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-transparent blur-2xl" />
            <div className="absolute top-[25%] left-[72%] w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-600/25 via-yellow-500/15 to-transparent blur-2xl" />
          </div>
        )}

        {/* Markers: Buses */}
        {layers.buses &&
          buses.map((bus) => {
            const pos = getCoordinatesPosition(bus.location.latitude, bus.location.longitude);
            const isSelected = selectedId === bus.id;

            return (
              <button
                key={bus.id}
                style={pos}
                onClick={() => onSelect({ type: 'bus', data: bus })}
                title={`${bus.id} - ${bus.routeName} (${bus.speedKph} km/h)`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all cursor-pointer group focus:outline-none`}
              >
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform ${
                    bus.status === 'delayed'
                      ? 'bg-[#3d2716] border-[#f97316] text-[#fed7aa]'
                      : bus.status === 'idle'
                      ? 'bg-[#222c33] border-[#64748b] text-[#cbd5e1]'
                      : 'bg-[#123838] border-[#34d399] text-[#bbf7d0]'
                  } ${isSelected ? 'scale-125 ring-4 ring-[#2dd4bf]/40' : 'group-hover:scale-115'}`}
                >
                  <BusFront size={16} />
                  {bus.status === 'active' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
                  )}
                </div>

                {/* Floating label on hover or selected */}
                <div
                  className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#091117]/95 backdrop-blur-sm border border-[#21353f] px-2 py-0.5 rounded text-[10px] font-mono text-white whitespace-nowrap shadow-xl transition-opacity pointer-events-none ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <span className="font-bold text-[#83dfca]">{bus.id}</span> · {bus.speedKph} km/h
                </div>
              </button>
            );
          })}

        {/* Markers: Road Defects (Potholes & Cracks) */}
        {layers.defects &&
          roadDefects.map((defect) => {
            const pos = getCoordinatesPosition(defect.location.latitude, defect.location.longitude);
            const isSelected = selectedId === defect.id;
            const isCritical = defect.severity === 'critical';

            return (
              <button
                key={defect.id}
                style={pos}
                onClick={() => onSelect({ type: 'detection', data: defect })}
                title={`${defect.type} (${(defect.confidence * 100).toFixed(0)}% AI confidence)`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group focus:outline-none`}
              >
                {isCritical && (
                  <span className="absolute -inset-2 rounded-full bg-red-500/30 animate-ping" />
                )}
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-transform shadow-lg ${
                    isCritical
                      ? 'bg-[#451616] border-[#ef4444] text-[#fca5a5]'
                      : 'bg-[#3b2314] border-[#f59e0b] text-[#fed7aa]'
                  } ${isSelected ? 'scale-125 ring-4 ring-red-500/40' : 'group-hover:scale-115'}`}
                >
                  <Construction size={14} />
                </div>

                <div
                  className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#120a0a]/95 backdrop-blur-sm border border-[#4a1d1d] px-2 py-0.5 rounded text-[10px] font-mono text-red-200 whitespace-nowrap shadow-xl transition-opacity pointer-events-none ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <span className="font-bold">{defect.category.toUpperCase()}</span> ·{' '}
                  {(defect.confidence * 100).toFixed(0)}%
                </div>
              </button>
            );
          })}

        {/* Markers: Waterlogging / Flood */}
        {layers.waterlogging &&
          waterEvents.map((water) => {
            const pos = getCoordinatesPosition(water.location.latitude, water.location.longitude);
            const isSelected = selectedId === water.id;

            return (
              <button
                key={water.id}
                style={pos}
                onClick={() => onSelect({ type: 'detection', data: water })}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group focus:outline-none`}
              >
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-transform shadow-lg bg-[#102438] border-[#38bdf8] text-[#bae6fd] ${
                    isSelected ? 'scale-125 ring-4 ring-sky-500/40' : 'group-hover:scale-115'
                  }`}
                >
                  <Droplets size={14} />
                </div>
              </button>
            );
          })}

        {/* Markers: Traffic Congestion Zones */}
        {layers.traffic &&
          trafficEvents.map((traffic) => {
            const pos = getCoordinatesPosition(traffic.location.latitude, traffic.location.longitude);
            const isSelected = selectedId === traffic.id;

            return (
              <button
                key={traffic.id}
                style={pos}
                onClick={() => onSelect({ type: 'detection', data: traffic })}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group focus:outline-none`}
              >
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-transform shadow-lg bg-[#382b13] border-[#eab308] text-[#fef08a] ${
                    isSelected ? 'scale-125 ring-4 ring-yellow-500/40' : 'group-hover:scale-115'
                  }`}
                >
                  <Waves size={14} />
                </div>
              </button>
            );
          })}
      </div>

      {/* Bottom Floating Legend & Zoom Controls */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 pointer-events-none">
        {/* Map Legend */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-3.5 text-xs font-mono text-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium">Active Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-medium">Critical Defect</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="font-medium">Waterlogging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-medium">Congestion</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 flex items-center gap-1 shadow-sm">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
            className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg font-bold font-mono text-sm"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2 h-7 text-xs font-mono text-slate-500 hover:text-slate-900 font-medium"
            title="Reset Zoom"
          >
            100%
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
            className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg font-bold font-mono text-sm"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            title="Toggle Map Fullscreen"
          >
            {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};
