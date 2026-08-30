import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  Flame,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Play,
  Radio,
  RefreshCw,
  Send,
  Server,
  ShieldAlert,
  Sliders,
  Sparkles,
  Terminal,
  Upload,
  Video,
  Waves,
  Zap,
} from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';
import { sampleFrames } from '../data/mockData';
import type { DefectCategory, DetectionEvent, Severity } from '../types/domain';

const prototypeScenarios = [
  {
    id: 'pothole-deep',
    title: 'P1 Severe Pothole Crater (>90mm)',
    category: 'pothole' as DefectCategory,
    severity: 'critical' as Severity,
    confidence: 0.97,
    busId: 'BUS-104',
    cameraId: 'CAM-104-FRONT',
    location: {
      latitude: 26.8524,
      longitude: 80.9412,
      roadName: 'Mahatma Gandhi Marg',
      city: 'Lucknow Central',
      zone: 'Zone 1 - Downtown',
    },
    imageUrl: sampleFrames.pothole1,
    telemetry: {
      vehicleSpeedKph: 41,
      gForceZ: 2.15,
      rainfallMm: 0,
      ambientTempC: 34,
    },
    boundingBoxes: [
      { id: 'b1', label: 'Primary Pothole Impact', confidence: 0.97, x: 38, y: 56, width: 32, height: 26, color: '#ef4444' },
      { id: 'b2', label: 'Fatigue Radial Crack', confidence: 0.89, x: 30, y: 50, width: 22, height: 16, color: '#f97316' },
    ],
    notes: 'Triggered extreme 2.15G vertical acceleration spike on rear axle sensor. High risk of vehicle tire blowout.',
  },
  {
    id: 'waterlogging-deep',
    title: 'Severe Urban Waterlogging (Underpass Overflow)',
    category: 'waterlogging' as DefectCategory,
    severity: 'high' as Severity,
    confidence: 0.94,
    busId: 'BUS-108',
    cameraId: 'CAM-108-FRONT',
    location: {
      latitude: 26.8392,
      longitude: 80.9255,
      roadName: 'Vikas Nagar Arterial Rd',
      city: 'Lucknow North',
      zone: 'Zone 2 - North',
    },
    imageUrl: sampleFrames.waterlogging1,
    telemetry: {
      vehicleSpeedKph: 14,
      gForceZ: 0.12,
      rainfallMm: 22.4,
      ambientTempC: 26,
    },
    boundingBoxes: [
      { id: 'b1', label: 'Submerged Road Surface', confidence: 0.94, x: 12, y: 44, width: 76, height: 48, color: '#0284c7' },
    ],
    notes: 'Blocked stormwater culvert causing 20cm pooling across both lanes. Transit buses slowed to 10 km/h.',
  },
  {
    id: 'traffic-jam',
    title: 'BRT Dedicated Lane Gridlock Obstruction',
    category: 'traffic-congestion' as DefectCategory,
    severity: 'high' as Severity,
    confidence: 0.92,
    busId: 'BUS-102',
    cameraId: 'CAM-102-FRONT',
    location: {
      latitude: 26.8611,
      longitude: 80.9523,
      roadName: 'Manoj Pandey Chauraha',
      city: 'Gomti Nagar',
      zone: 'Zone 4 - East',
    },
    imageUrl: sampleFrames.traffic1,
    telemetry: {
      vehicleSpeedKph: 3,
      gForceZ: 0.04,
      rainfallMm: 0,
      ambientTempC: 31,
    },
    boundingBoxes: [
      { id: 'b1', label: 'Unauthorized Heavy Vehicle Blockade', confidence: 0.92, x: 22, y: 32, width: 56, height: 48, color: '#f59e0b' },
    ],
    notes: 'Commercial delivery trucks blocking dedicated transit lane, delaying 4 scheduled buses by 24 minutes.',
  },
  {
    id: 'structural-crack',
    title: 'Longitudinal Asphalt Fatigue Fracture',
    category: 'road-crack' as DefectCategory,
    severity: 'medium' as Severity,
    confidence: 0.89,
    busId: 'BUS-106',
    cameraId: 'CAM-106-FRONT',
    location: {
      latitude: 26.8702,
      longitude: 80.9634,
      roadName: 'Faizabad Corridor Link',
      city: 'Indira Nagar',
      zone: 'Zone 5 - East Corridor',
    },
    imageUrl: sampleFrames.crack1,
    telemetry: {
      vehicleSpeedKph: 48,
      gForceZ: 0.88,
      rainfallMm: 0,
      ambientTempC: 33,
    },
    boundingBoxes: [
      { id: 'b1', label: 'Longitudinal Pavement Fracture', confidence: 0.89, x: 40, y: 48, width: 28, height: 38, color: '#8b5cf6' },
    ],
    notes: 'Continuous 12-meter surface fracture detected; scheduled for preventive bituminous crack sealing.',
  },
];

export const FlowPrototypeStudio: React.FC = () => {
  const {
    prototypeConfig,
    updatePrototypeConfig,
    injectPrototypeDetection,
    detections,
    incidents,
    escalateDetectionToIncident,
    isSimulationActive,
    setIsSimulationActive,
  } = useUrbanData();

  const [activeTab, setActiveTab] = useState<'embed' | 'runner' | 'webhook' | 'telemetry'>('runner');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('pothole-deep');
  const [isRunningInference, setIsRunningInference] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<DetectionEvent | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isIframeFullscreen, setIsIframeFullscreen] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [pingLatency, setPingLatency] = useState<number>(38);
  const [isTestingPing, setIsTestingPing] = useState(false);

  const currentScenario = prototypeScenarios.find((s) => s.id === selectedScenarioId) || prototypeScenarios[0];

  const handleRunInference = () => {
    setIsRunningInference(true);
    setInferenceResult(null);

    setTimeout(() => {
      const injected = injectPrototypeDetection({
        type: currentScenario.title,
        category: currentScenario.category,
        severity: currentScenario.severity,
        confidence: currentScenario.confidence,
        busId: currentScenario.busId,
        cameraId: currentScenario.cameraId,
        location: currentScenario.location,
        frame: {
          imageUrl: currentScenario.imageUrl,
          resolution: '1920x1080',
          cameraType: 'front-dash',
        },
        boundingBoxes: currentScenario.boundingBoxes,
        telemetry: currentScenario.telemetry,
        notes: currentScenario.notes,
        flowToolId: prototypeConfig.toolId,
      });

      setInferenceResult(injected);
      setIsRunningInference(false);
    }, 850);
  };

  const handlePingTest = () => {
    setIsTestingPing(true);
    setTimeout(() => {
      const newLatency = Math.floor(Math.random() * 15) + 32;
      setPingLatency(newLatency);
      updatePrototypeConfig({
        averageInferenceLatencyMs: newLatency,
        lastHeartbeat: new Date().toISOString(),
      });
      setIsTestingPing(false);
    }, 600);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(JSON.stringify(currentScenario, null, 2));
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Google Labs Flow Prototype Live Integration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
              ● GOOGLE LABS FLOW INTEGRATION
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              ID: {prototypeConfig.toolId}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            Flow AI Prototype Live Studio & Testing Bridge
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            Live bi-directional connection to Google Labs Flow tool{' '}
            <span className="font-mono text-slate-700 font-medium">#{prototypeConfig.toolId}</span>. Test optical video inferences, simulate dashcam frames, review bounding boxes, and stream municipal work orders directly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={handlePingTest}
            disabled={isTestingPing}
            className="text-xs font-mono"
          >
            <RefreshCw size={13} className={isTestingPing ? 'animate-spin' : ''} />
            <span>{isTestingPing ? 'Pinging...' : `${pingLatency}ms Ping`}</span>
          </Button>

          <a
            href={prototypeConfig.toolUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs transition-all"
          >
            <span>Open Tool in Google Labs</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('runner')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'runner'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Play size={14} />
          <span>Live Frame Inference Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('embed')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'embed'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sparkles size={14} />
          <span>Interactive Embedded Flow Tool</span>
        </button>

        <button
          onClick={() => setActiveTab('webhook')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'webhook'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Terminal size={14} />
          <span>Webhook & Event Contract</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'telemetry'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Activity size={14} />
          <span>Pipeline Telemetry & Logs</span>
        </button>
      </div>

      {/* TAB 1: LIVE FRAME INFERENCE RUNNER */}
      {activeTab === 'runner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Preset Scenarios & Input Selector */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-5 bg-white border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Select Test Video Frame</h3>
                  <span className="text-[11px] font-mono text-slate-500">Dashcam Optical Feed</span>
                </div>

                <div className="space-y-2.5">
                  {prototypeScenarios.map((scenario) => {
                    const isSelected = scenario.id === selectedScenarioId;
                    return (
                      <div
                        key={scenario.id}
                        onClick={() => setSelectedScenarioId(scenario.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 shadow-2xs ring-1 ring-blue-500/30'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                          <img src={scenario.imageUrl} alt={scenario.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                              {scenario.busId} · {scenario.cameraId}
                            </span>
                            <Badge severity={scenario.severity} className="text-[9px] py-0">
                              {scenario.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                            {scenario.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {scenario.location.roadName} ({scenario.location.zone})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inference Trigger Button */}
                <div className="pt-3 border-t border-slate-100">
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={handleRunInference}
                    disabled={isRunningInference}
                    className="w-full py-3 text-xs font-mono font-semibold"
                  >
                    {isRunningInference ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        Executing Flow Vision Model Inference...
                      </>
                    ) : (
                      <>
                        <Play size={15} />
                        Run Flow AI Model Inference (#{prototypeConfig.toolId.substring(0, 8)})
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Real-time Telemetry Attributes of selected frame */}
              <Card className="p-5 bg-white border-slate-200 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">Vehicle & Optical Telemetry</span>
                  <span className="text-slate-400 font-mono">1080p @ 30 FPS</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">BUS VELOCITY</span>
                    <strong className="text-slate-900 text-sm">{currentScenario.telemetry.vehicleSpeedKph} km/h</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">VERTICAL G-FORCE</span>
                    <strong className={`text-sm ${currentScenario.telemetry.gForceZ > 1.5 ? 'text-red-600 font-bold' : 'text-slate-900'}`}>
                      {currentScenario.telemetry.gForceZ} G
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">GPS COORDINATES</span>
                    <span className="text-slate-700 text-[11px] truncate block">
                      {currentScenario.location.latitude.toFixed(4)}, {currentScenario.location.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">MODEL CONFIDENCE</span>
                    <strong className="text-blue-600 text-sm">{(currentScenario.confidence * 100).toFixed(0)}%</strong>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Interactive Frame Preview & Visual Bounding Box Inspector */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="p-5 bg-white border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Optical Frame & Bounding Box HUD
                    </h3>
                    <p className="text-xs text-slate-500">
                      Visual neural network annotations computed via Google Flow tool.
                    </p>
                  </div>
                  <Badge tone="good">LIVE STREAM READY</Badge>
                </div>

                {/* Visual Viewport with Bounding Boxes */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                  <img
                    src={currentScenario.imageUrl}
                    alt={currentScenario.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Render Bounding Boxes */}
                  {currentScenario.boundingBoxes.map((box) => (
                    <div
                      key={box.id}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                      className="absolute border-2 border-red-500 bg-red-500/20 rounded-sm pointer-events-none transition-all animate-pulse"
                    >
                      <div className="absolute -top-6 left-0 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-white/20 whitespace-nowrap flex items-center gap-1 shadow-sm">
                        <span className="font-semibold">{box.label}</span>
                        <span className="text-emerald-400 font-bold">{(box.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}

                  {/* Watermarks */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-200 border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>FLOW-AI-CAM · {currentScenario.cameraId}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono flex items-center gap-2 shadow-md">
                    <span className="text-slate-500">TOOL:</span>
                    <span className="text-blue-600 font-bold">#2bb18e92</span>
                  </div>
                </div>

                {/* Inference Result Output Notification */}
                {inferenceResult && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800 font-medium text-xs">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Inference Ingested into GIS Map & Incident Stream ({inferenceResult.id})</span>
                      </div>
                      <Badge severity={inferenceResult.severity} className="text-[10px]">
                        {inferenceResult.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono">
                      Location: {inferenceResult.location.roadName} · Confidence: {(inferenceResult.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="brand"
                        onClick={() => escalateDetectionToIncident(inferenceResult)}
                        className="text-xs"
                      >
                        <ShieldAlert size={13} />
                        Dispatch Municipal Work Order
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE EMBEDDED PROTOTYPE TOOL */}
      {activeTab === 'embed' && (
        <div className="space-y-4">
          <Card className="p-4 bg-white border-slate-200 rounded-2xl shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Google Labs Flow Shared Tool Workspace
                </h3>
                <p className="text-xs text-slate-500">
                  Direct live preview of <span className="font-mono text-slate-700">{prototypeConfig.toolUrl}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIframeKey((k) => k + 1)}
                className="text-xs"
              >
                <RefreshCw size={12} />
                <span>Reload Tool</span>
              </Button>

              <button
                onClick={() => setIsIframeFullscreen(!isIframeFullscreen)}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 cursor-pointer"
              >
                {isIframeFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span className="hidden sm:inline">{isIframeFullscreen ? 'Exit Fullscreen' : 'Expand'}</span>
              </button>

              <a
                href={prototypeConfig.toolUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <span>Launch in Google Labs</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </Card>

          {/* Embedded iFrame Viewport */}
          <div
            className={`w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md transition-all ${
              isIframeFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[680px]'
            }`}
          >
            <iframe
              key={iframeKey}
              src={prototypeConfig.toolUrl}
              title="Google Labs Flow Tool"
              className="w-full h-full border-0 bg-white"
              allow="camera; microphone; geolocation; clipboard-read; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                If the Google Labs authentication or iframe policy prevents in-app embedding, click <strong>Launch in Google Labs</strong> above to open in a dedicated tab.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOK & EVENT CONTRACT */}
      {activeTab === 'webhook' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <Card className="p-5 bg-white border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Flow AI Tool Ingestion Webhook Contract
                  </h3>
                  <Button size="sm" variant="secondary" onClick={handleCopyContract} className="text-xs">
                    <Copy size={12} />
                    <span>{copiedContract ? 'Copied Contract!' : 'Copy Contract JSON'}</span>
                  </Button>
                </div>

                <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-[460px] leading-relaxed shadow-inner">
{`POST ${prototypeConfig.endpointUrl}
Content-Type: application/json
X-Flow-Tool-ID: ${prototypeConfig.toolId}

${JSON.stringify(
  {
    toolId: prototypeConfig.toolId,
    timestamp: new Date().toISOString(),
    event: 'ANOMALY_DETECTED',
    detection: currentScenario,
  },
  null,
  2
)}`}
                </pre>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Card className="p-5 bg-white border-slate-200 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Integration Configuration</h3>
                
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">PROTOTYPE TOOL ID</label>
                    <input
                      readOnly
                      value={prototypeConfig.toolId}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">INGESTION ENDPOINT</label>
                    <input
                      readOnly
                      value={prototypeConfig.endpointUrl}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">STREAM MODE</label>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-sans text-xs">
                      <strong>Continuous Vision Stream:</strong> Automatically syncs 30fps road hazard frames with edge GPU inference.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PIPELINE TELEMETRY & LOGS */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">INFERRED FRAMES</span>
              <strong className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
                {prototypeConfig.inferredFramesCount.toLocaleString()}
              </strong>
              <span className="text-xs text-emerald-600 font-medium">● 30 FPS Stable Stream</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AVG GPU LATENCY</span>
              <strong className="text-2xl font-bold font-mono text-blue-600 mt-1 block">
                {pingLatency} ms
              </strong>
              <span className="text-xs text-slate-500 font-medium">NVIDIA Jetson / TPU Edge</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">ACTIVE DETECTIONS</span>
              <strong className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
                {detections.length}
              </strong>
              <span className="text-xs text-slate-500 font-medium">Logged across Lucknow</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">WORK ORDERS</span>
              <strong className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
                {incidents.length}
              </strong>
              <span className="text-xs text-slate-500 font-medium">Auto-dispatched from Flow</span>
            </Card>
          </div>

          <Card className="p-5 bg-white border-slate-200 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Ingestion Event Log (Google Flow Tool #{prototypeConfig.toolId.substring(0, 8)})
              </h3>
              <span className="text-xs font-mono text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Log
              </span>
            </div>

            <div className="divide-y divide-slate-100 font-mono text-xs max-h-80 overflow-y-auto">
              {detections.slice(0, 8).map((det) => (
                <div key={det.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{new Date(det.timestamp).toLocaleTimeString()}</span>
                    <span className="font-semibold text-slate-900">{det.id}</span>
                    <span className="text-slate-600">{det.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 font-semibold">{(det.confidence * 100).toFixed(0)}%</span>
                    <Badge severity={det.severity} className="text-[9px] py-0">
                      {det.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
