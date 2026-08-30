import React, { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  Send,
  ShieldAlert,
  Sliders,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import type { DetectionEvent } from '../types/domain';
import { Badge, Button, Modal } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

interface DetectionViewerProps {
  detection: DetectionEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetectionViewer: React.FC<DetectionViewerProps> = ({ detection, isOpen, onClose }) => {
  const { updateDetectionStatus, escalateDetectionToIncident, prototypeConfig } = useUrbanData();
  const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [notes, setNotes] = useState('');
  const [escalateSuccess, setEscalateSuccess] = useState<string | null>(null);

  if (!detection) return null;

  const handleEscalate = () => {
    const inc = escalateDetectionToIncident(detection);
    setEscalateSuccess(inc.id);
    setTimeout(() => {
      setEscalateSuccess(null);
      onClose();
    }, 1800);
  };

  const handleVerify = () => {
    updateDetectionStatus(detection.id, 'verified', notes);
    onClose();
  };

  const handleDismiss = () => {
    updateDetectionStatus(detection.id, 'dismissed', notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Sparkles size={18} />
          </div>
          <span>AI Detection Frame Inspector</span>
          <Badge severity={detection.severity}>{detection.severity.toUpperCase()}</Badge>
        </div>
      }
      subtitle={`Inferred via Google Labs Flow Prototype (#${detection.flowToolId?.substring(0, 8) || '2bb18e92'})`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Frame Canvas Section */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm group">
            {/* Base Image Frame */}
            <img
              src={detection.frame?.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'}
              alt={detection.type}
              className="w-full h-full object-cover"
            />

            {/* Bounding Box Annotations */}
            {showBoundingBoxes &&
              detection.boundingBoxes?.map((box, idx) => {
                const isHovered = activeBoxIndex === idx;
                return (
                  <div
                    key={box.id || idx}
                    onMouseEnter={() => setActiveBoxIndex(idx)}
                    onMouseLeave={() => setActiveBoxIndex(null)}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                    className={`absolute border-2 transition-all cursor-pointer ${
                      isHovered
                        ? 'border-yellow-400 bg-yellow-400/25 shadow-lg shadow-yellow-500/30'
                        : 'border-red-500 bg-red-500/15'
                    }`}
                  >
                    <div className="absolute -top-6 left-0 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-white/20 whitespace-nowrap flex items-center gap-1 shadow-sm">
                      <span className="font-semibold">{box.label}</span>
                      <span className="text-emerald-400 font-bold">{(box.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}

            {/* Live Camera Watermark */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-200 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{detection.cameraId || 'CAM-FRONT-OPTICAL'}</span>
              <span className="text-slate-500">|</span>
              <span>{detection.frame?.resolution || '1080p'}</span>
            </div>

            {/* Confidence HUD Overlay */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono flex items-center gap-2 shadow-md">
              <span className="text-slate-500">AI CONFIDENCE:</span>
              <span className="text-blue-600 font-bold text-sm">
                {(detection.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="flex items-center justify-between px-1 py-1 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all font-medium ${
                  showBoundingBoxes
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {showBoundingBoxes ? '● Bounding Boxes Visible' : '○ Hide Bounding Boxes'}
              </button>
              <span>{detection.boundingBoxes?.length || 1} Region(s) Flagged</span>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Latency: {prototypeConfig.averageInferenceLatencyMs}ms · FPS: 30
            </span>
          </div>

          {/* Telemetry Strip */}
          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">VEHICLE SPEED</span>
              <span className="text-slate-900 font-bold">{detection.telemetry?.vehicleSpeedKph || 38} km/h</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ROAD IMPACT</span>
              <span className="text-red-600 font-bold">{detection.telemetry?.gForceZ || 1.45} G</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">RAINFALL</span>
              <span className="text-sky-600 font-bold">{detection.telemetry?.rainfallMm || 0} mm/h</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TEMP</span>
              <span className="text-amber-600 font-bold">{detection.telemetry?.ambientTempC || 32}°C</span>
            </div>
          </div>
        </div>

        {/* Intelligence Metadata & Triage Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
                DETECTED CLASSIFICATION
              </span>
              <h4 className="text-base font-semibold text-slate-900 mt-0.5">{detection.type}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {detection.notes || 'Autonomous object detection model flagged structural road surface deviation.'}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-medium">{detection.location.roadName || 'Transit Route'}</strong>
                  <span className="text-xs text-slate-500">
                    {detection.location.address || detection.location.city} ({detection.location.zone || 'Zone 1'})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500">Vehicle / Bus ID:</span>
                <span className="font-mono text-slate-900 font-semibold">{detection.busId || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Captured Timestamp:</span>
                <span className="font-mono text-slate-700">{new Date(detection.timestamp).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Prototype Tool ID:</span>
                <a
                  href={prototypeConfig.toolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-blue-600 hover:underline flex items-center gap-1"
                >
                  {detection.flowToolId?.substring(0, 12)}...
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Supervisor Notes input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5">
                OPERATIONAL TRIAGE NOTES
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter field dispatch instructions or verification note..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {escalateSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Incident {escalateSuccess} created and dispatched!</span>
              </div>
            ) : (
              <>
                <Button
                  variant="danger"
                  className="w-full justify-center text-xs py-2.5 font-semibold"
                  onClick={handleEscalate}
                >
                  <ShieldAlert size={15} />
                  Escalate to Municipal Work Order
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="primary" className="text-xs justify-center" onClick={handleVerify}>
                    <CheckCircle2 size={14} />
                    Verify Anomaly
                  </Button>
                  <Button variant="secondary" className="text-xs justify-center" onClick={handleDismiss}>
                    <X size={14} />
                    Dismiss
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
