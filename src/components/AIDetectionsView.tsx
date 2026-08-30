import React, { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Construction,
  Download,
  Droplets,
  ExternalLink,
  Eye,
  Filter,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  Search,
  ShieldAlert,
  Sliders,
  Sparkles,
  Waves,
} from 'lucide-react';
import type { DetectionEvent, DefectCategory, Severity } from '../types/domain';
import { Badge, Button, Card, EmptyState } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';
import { DetectionViewer } from './DetectionViewer';

export const AIDetectionsView: React.FC = () => {
  const { detections, prototypeConfig, updateDetectionStatus, escalateDetectionToIncident } = useUrbanData();
  const [selectedCategory, setSelectedCategory] = useState<'all' | DefectCategory>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | Severity>('all');
  const [minConfidence, setMinConfidence] = useState<number>(0.75);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDetection, setViewingDetection] = useState<DetectionEvent | null>(null);

  const filteredDetections = detections.filter((d) => {
    const matchCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchSeverity = selectedSeverity === 'all' || d.severity === selectedSeverity;
    const matchConfidence = d.confidence >= minConfidence;
    const matchSearch =
      searchQuery === '' ||
      `${d.type} ${d.location.roadName || ''} ${d.location.city || ''} ${d.busId || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchCategory && matchSeverity && matchConfidence && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Prototype Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
              ● GOOGLE FLOW VISION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-500 font-medium">Tool #2bb18e92-ad04-4a87-9400-578ffc26e64b</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Autonomous Road & Transit Detections</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual anomaly frames inferred from on-board bus dashcams via the Google Labs Flow AI Prototype.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CONFIDENCE FILTER</span>
            <span className="text-sm font-bold font-mono text-blue-600">≥ {(minConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-32">
            <input
              type="range"
              min="0.60"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {(
            [
              { id: 'all', label: 'All Anomalies' },
              { id: 'pothole', label: 'Potholes' },
              { id: 'road-crack', label: 'Fatigue Cracks' },
              { id: 'waterlogging', label: 'Waterlogging' },
              { id: 'traffic-congestion', label: 'Congestion' },
              { id: 'debris-hazard', label: 'Debris Hazard' },
              { id: 'missing-signage', label: 'Signage' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                selectedCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-slate-200 bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search detections..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-sans shadow-2xs"
          />
        </div>
      </Card>

      {/* Grid of Detection Cards */}
      {filteredDetections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDetections.map((detection) => {
            return (
              <Card
                key={detection.id}
                className="p-0 overflow-hidden flex flex-col group border-slate-200 hover:border-slate-300 bg-white shadow-xs hover:shadow-md transition-all rounded-2xl"
              >
                {/* Visual Snapshot Frame */}
                <div
                  onClick={() => setViewingDetection(detection)}
                  className="relative aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={
                      detection.frame?.imageUrl ||
                      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={detection.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Bounding Box Visual Hint */}
                  {detection.boundingBoxes?.[0] && (
                    <div
                      style={{
                        left: `${detection.boundingBoxes[0].x}%`,
                        top: `${detection.boundingBoxes[0].y}%`,
                        width: `${detection.boundingBoxes[0].width}%`,
                        height: `${detection.boundingBoxes[0].height}%`,
                      }}
                      className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none rounded-sm"
                    >
                      <span className="absolute -top-5 left-0 bg-slate-900/90 text-white font-mono text-[9px] px-1 rounded">
                        {(detection.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <Badge severity={detection.severity}>
                      {detection.severity.toUpperCase()}
                    </Badge>
                    <div className="bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-800 border border-slate-200 font-bold shadow-2xs">
                      {(detection.confidence * 100).toFixed(1)}% AI
                    </div>
                  </div>

                  {/* Hover Inspect CTA */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono text-white pointer-events-none">
                    <Eye size={16} className="text-white" />
                    <span className="font-semibold">Inspect Frame & Annotations</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>{detection.id}</span>
                      <span>{new Date(detection.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-600">
                      {detection.type}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {detection.notes || 'Identified along municipal transit corridor.'}
                    </p>
                  </div>

                  {/* Location and Telemetry Strip */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin size={13} className="text-blue-600 shrink-0" />
                      <span className="truncate">{detection.location.roadName || detection.location.city}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Source: {detection.busId || 'Sensor'}</span>
                      <span>Speed: {detection.telemetry?.vehicleSpeedKph || 36} km/h</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs justify-center"
                      onClick={() => setViewingDetection(detection)}
                    >
                      <Eye size={13} />
                      Inspect
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => escalateDetectionToIncident(detection)}
                    >
                      <ShieldAlert size={13} className="text-red-500" />
                      Escalate
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No AI detections found"
          description="Try lowering the confidence cutoff or trigger a test event from the prototype bridge."
        />
      )}

      {/* Frame Inspector Modal */}
      <DetectionViewer
        detection={viewingDetection}
        isOpen={!!viewingDetection}
        onClose={() => setViewingDetection(null)}
      />
    </div>
  );
};
