import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BusFront,
  Camera,
  CheckCircle2,
  Clock,
  Construction,
  Droplets,
  ExternalLink,
  Flame,
  Layers,
  MapPin,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Waves,
  Zap,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';
import { useUrbanData } from '../context/UrbanDataContext';
import { CommandMap, type MapLayers } from '../components/CommandMap';
import { LiveEvents } from '../components/LiveEvents';
import { DetectionViewer } from '../components/DetectionViewer';
import type { DetectionEvent, Bus, Incident } from '../types/domain';

interface FoundationPageProps {
  onNavigateToTab?: (tab: string) => void;
}

export const FoundationPage: React.FC<FoundationPageProps> = ({ onNavigateToTab }) => {
  const {
    buses,
    detections,
    incidents,
    roadSegments,
    prototypeConfig,
    escalateDetectionToIncident,
    isSimulationActive,
  } = useUrbanData();

  // Map layer states
  const [layers, setLayers] = useState<MapLayers>({
    buses: true,
    defects: true,
    waterlogging: true,
    traffic: true,
    incidents: true,
    heatmap: false,
    satellite: false,
  });

  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'bus' | 'detection' | 'incident';
    data: any;
  } | null>(null);

  const [viewingDetectionFrame, setViewingDetectionFrame] = useState<DetectionEvent | null>(null);

  const handleToggleLayer = (layer: keyof MapLayers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleMapSelect = (item: { type: 'bus' | 'detection' | 'incident'; data: any }) => {
    setSelectedEntity(item);
    if (item.type === 'detection') {
      setViewingDetectionFrame(item.data);
    }
  };

  const criticalDefects = detections.filter((d) => d.severity === 'critical');
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Prototype Bridge Alert Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0 mt-0.5">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                Google Flow AI Detection Engine Connected
              </h2>
              <Badge tone="good" className="text-[10px]">
                30 FPS SYNC
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Processing bus-mounted camera video streams via Flow Tool #{prototypeConfig.toolId.substring(0, 12)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Button
            size="sm"
            variant="brand"
            onClick={() => onNavigateToTab?.('prototype')}
            className="flex-1 md:flex-initial text-xs font-mono"
          >
            <Sparkles size={13} />
            <span>Open Prototype Studio</span>
          </Button>

          <a
            href={prototypeConfig.toolUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-initial px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
          >
            <span>Google Labs</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* 4 Metric Status Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACTIVE TRANSIT FLEET</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BusFront size={16} />
            </div>
          </div>
          <strong className="text-2xl font-semibold text-slate-900 mt-2 block tracking-tight">
            {buses.filter((b) => b.status === 'active').length} / {buses.length}
          </strong>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            ● Transmitting live dashcams
          </span>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOTAL AI DETECTIONS</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera size={16} />
            </div>
          </div>
          <strong className="text-2xl font-semibold text-slate-900 mt-2 block tracking-tight">{detections.length}</strong>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {criticalDefects.length} Critical P1 Hazards
          </span>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CITY AVG ROAD PQI</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Construction size={16} />
            </div>
          </div>
          <strong className="text-2xl font-semibold text-blue-600 mt-2 block tracking-tight">69.4 <span className="text-sm font-normal text-slate-400">/ 100</span></strong>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Fair condition (Zone 1 watch)</span>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WORK ORDERS</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert size={16} />
            </div>
          </div>
          <strong className="text-2xl font-semibold text-slate-900 mt-2 block tracking-tight">{activeIncidents.length}</strong>
          <span className="text-[11px] text-red-600 font-medium mt-1 block">
            {incidents.filter((i) => i.priority === 'P1').length} Emergency Dispatches
          </span>
        </Card>
      </div>

      {/* Main Core Area: GIS Map (8 cols) + Real-time Ingest Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive GIS Command Map */}
        <div className="lg:col-span-8 space-y-3">
          <CommandMap
            buses={buses}
            detections={detections}
            incidents={incidents}
            layers={layers}
            onToggleLayer={handleToggleLayer}
            selectedId={selectedEntity?.data?.id}
            onSelect={handleMapSelect}
          />
        </div>

        {/* Real-time Ingestion Stream */}
        <div className="lg:col-span-4 space-y-3">
          <LiveEvents
            events={detections}
            selectedId={selectedEntity?.data?.id}
            onSelect={(event) => {
              setSelectedEntity({ type: 'detection', data: event });
              setViewingDetectionFrame(event);
            }}
          />
        </div>
      </div>

      {/* Quick Operational Activity Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Construction size={14} className="text-amber-500" />
              <span>Pavement Degradation Hotspots</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Zone 1 Downtown</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Severe road crater cluster identified on Hazratganj Main Corridor. 3 public buses reported 1.8G vertical impacts.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-red-600 font-semibold">Priority P1 Hazard</span>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('roads')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Inspect PQI <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Droplets size={14} className="text-sky-500" />
              <span>Stormwater Flooding Alerts</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Zone 2 North</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vikas Nagar Underpass flagged for 18cm standing water inundation following heavy morning precipitation.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-sky-600 font-semibold">Drainage Dispatched</span>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('incidents')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View Work Order <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </Card>

        <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Waves size={14} className="text-amber-500" />
              <span>Transit Corridor Bottlenecks</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Route 10 & 24</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bus speeds dropped to 15 km/h on Gomti Nagar Link Road due to commercial loading zone encroachments.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-600 font-semibold">+24 min Delay</span>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('traffic')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Traffic Analytics <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Frame Inspection Modal */}
      <DetectionViewer
        detection={viewingDetectionFrame}
        isOpen={!!viewingDetectionFrame}
        onClose={() => setViewingDetectionFrame(null)}
      />
    </div>
  );
};
