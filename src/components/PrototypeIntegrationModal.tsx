import React, { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Layers,
  Play,
  Radio,
  RefreshCw,
  Send,
  Server,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { Badge, Button, Card, Modal } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';
import { sampleFrames } from '../data/mockData';

interface PrototypeIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const samplePayloads = {
  pothole: {
    type: 'Critical Pothole (Depth 92mm)',
    category: 'pothole',
    severity: 'critical',
    confidence: 0.98,
    busId: 'BUS-104',
    cameraId: 'CAM-104-FRONT',
    location: {
      latitude: 26.8535,
      longitude: 80.943,
      roadName: 'Hazratganj Main Corridor',
      city: 'Lucknow Central',
      zone: 'Zone 1 - Downtown',
    },
    frame: {
      imageUrl: sampleFrames.pothole1,
    },
    boundingBox: {
      x: 38,
      y: 55,
      width: 32,
      height: 26,
    },
    telemetry: {
      vehicleSpeedKph: 36,
      ambientTempC: 33,
      gForceZ: 1.95,
      rainfallMm: 0,
    },
    notes: 'Google Flow Vision AI detected high hazard crater. Triggered 1.95G bump telemetry.',
  },
  waterlogging: {
    type: 'Severe Stormwater Accumulation / Flooding',
    category: 'waterlogging',
    severity: 'high',
    confidence: 0.94,
    busId: 'BUS-108',
    cameraId: 'CAM-108-FRONT',
    location: {
      latitude: 26.841,
      longitude: 80.928,
      roadName: 'Vikas Nagar Underpass',
      city: 'Lucknow North',
      zone: 'Zone 2 - North',
    },
    frame: {
      imageUrl: sampleFrames.waterlogging1,
    },
    boundingBox: {
      x: 18,
      y: 45,
      width: 65,
      height: 40,
    },
    telemetry: {
      vehicleSpeedKph: 12,
      ambientTempC: 27,
      gForceZ: 0.15,
      rainfallMm: 18.2,
    },
    notes: 'Drain blockage resulting in 18cm water depth over 45 meters of roadway.',
  },
  traffic: {
    type: 'Transit BRT Lane Blockade & Congestion',
    category: 'traffic-congestion',
    severity: 'high',
    confidence: 0.91,
    busId: 'BUS-102',
    cameraId: 'CAM-102-FRONT',
    location: {
      latitude: 26.862,
      longitude: 80.954,
      roadName: 'Manoj Pandey Junction',
      city: 'Gomti Nagar',
      zone: 'Zone 4',
    },
    frame: {
      imageUrl: sampleFrames.traffic1,
    },
    boundingBox: {
      x: 20,
      y: 35,
      width: 60,
      height: 45,
    },
    telemetry: {
      vehicleSpeedKph: 4,
      ambientTempC: 30,
      gForceZ: 0.05,
      rainfallMm: 0,
    },
    notes: 'Commercial transport obstruction causing 22-minute transit corridor delay.',
  },
};

export const PrototypeIntegrationModal: React.FC<PrototypeIntegrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { prototypeConfig, updatePrototypeConfig, injectPrototypeDetection, isSimulationActive, setIsSimulationActive } =
    useUrbanData();

  const [activeTab, setActiveTab] = useState<'bridge' | 'tester' | 'schema'>('bridge');
  const [selectedTemplate, setSelectedTemplate] = useState<'pothole' | 'waterlogging' | 'traffic'>('pothole');
  const [customJson, setCustomJson] = useState(JSON.stringify(samplePayloads.pothole, null, 2));
  const [copied, setCopied] = useState(false);
  const [injectSuccess, setInjectSuccess] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleTemplateChange = (template: 'pothole' | 'waterlogging' | 'traffic') => {
    setSelectedTemplate(template);
    setCustomJson(JSON.stringify(samplePayloads[template], null, 2));
    setParseError(null);
  };

  const handleInject = () => {
    try {
      const parsed = JSON.parse(customJson);
      injectPrototypeDetection(parsed);
      setInjectSuccess(true);
      setParseError(null);
      setTimeout(() => setInjectSuccess(false), 2000);
    } catch (e: any) {
      setParseError(e.message || 'Invalid JSON format');
    }
  };

  const handleCopyEndpoint = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Radio size={18} />
          </div>
          <span>AI Prototype Integration Hub</span>
          <Badge tone="good">CONNECTED</Badge>
        </div>
      }
      subtitle="Bi-directional bridge to Google Labs Flow AI Prototype #2bb18e92-ad04-4a87-9400-578ffc26e64b"
    >
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
        <button
          onClick={() => setActiveTab('bridge')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            activeTab === 'bridge'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          ● Connection & Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            activeTab === 'tester'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          ⚡ Payload Test Injector
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            activeTab === 'schema'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          📄 API & Webhook Contract
        </button>
      </div>

      {/* Tab 1: Connection & Status */}
      {activeTab === 'bridge' && (
        <div className="space-y-5">
          {/* Main Hero Status Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 -ml-4.5" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Google Labs Flow AI Pipeline Active
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-mono break-all">
                Shared Tool ID: <span className="text-slate-900 font-semibold">{prototypeConfig.toolId}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Receiving real-time inference frames, bounding boxes, and road hazard telemetry.
              </p>
            </div>

            <a
              href={prototypeConfig.toolUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap shadow-xs transition-all"
            >
              <span>Open Tool in Google Labs</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Metric Diagnostics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">INFERRED FRAMES</span>
              <strong className="text-xl font-semibold text-slate-900 block mt-1">
                {prototypeConfig.inferredFramesCount.toLocaleString()}
              </strong>
              <span className="text-[10px] text-emerald-600 font-medium font-mono mt-0.5 block">● Stream active</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AVG LATENCY</span>
              <strong className="text-xl font-semibold text-blue-600 block mt-1">
                {prototypeConfig.averageInferenceLatencyMs} ms
              </strong>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Edge GPU acceleration</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">FPS THROUGHPUT</span>
              <strong className="text-xl font-semibold text-slate-900 block mt-1">30.0 fps</strong>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">1080p optical feed</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CONFIDENCE CUT</span>
              <strong className="text-xl font-semibold text-amber-600 block mt-1">
                {(prototypeConfig.modelConfidenceCutoff * 100).toFixed(0)}%
              </strong>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Minimum filter cut</span>
            </Card>
          </div>

          {/* Stream Modes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Data Ingestion Mode
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => {
                  updatePrototypeConfig({ mode: 'simulated-stream' });
                  setIsSimulationActive(true);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  prototypeConfig.mode === 'simulated-stream'
                    ? 'bg-blue-50/80 border-blue-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900 mb-1">Continuous Live Stream</div>
                <div className="text-[11px] text-slate-500 leading-snug">Simulates live 30fps vehicle camera inference feed.</div>
              </button>

              <button
                onClick={() => {
                  updatePrototypeConfig({ mode: 'live-endpoint' });
                  setIsSimulationActive(false);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  prototypeConfig.mode === 'live-endpoint'
                    ? 'bg-blue-50/80 border-blue-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900 mb-1">Custom Live Ingest URL</div>
                <div className="text-[11px] text-slate-500 leading-snug">Polls or listens to your custom REST/SSE server.</div>
              </button>

              <button
                onClick={() => {
                  updatePrototypeConfig({ mode: 'manual-batch' });
                  setIsSimulationActive(false);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  prototypeConfig.mode === 'manual-batch'
                    ? 'bg-blue-50/80 border-blue-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900 mb-1">Manual Payload Mode</div>
                <div className="text-[11px] text-slate-500 leading-snug">Receive detections only when manually triggered.</div>
              </button>
            </div>
          </div>

          {/* Quick Endpoint Info */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 shrink-0 font-medium">WEBHOOK INGEST URL:</span>
            <input
              readOnly
              value={prototypeConfig.endpointUrl}
              className="bg-transparent border-0 text-slate-800 focus:outline-none flex-1 text-xs font-mono"
            />
            <Button
              size="sm"
              variant="secondary"
              className="text-xs"
              onClick={() => handleCopyEndpoint(prototypeConfig.endpointUrl)}
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy URL'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Test Payload Injector */}
      {activeTab === 'tester' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Trigger Prototype Detection Event</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a pre-built prototype detection or edit the JSON payload to inject live into the UI.
              </p>
            </div>
            <div className="flex gap-1.5">
              {(['pothole', 'waterlogging', 'traffic'] as const).map((template) => (
                <button
                  key={template}
                  onClick={() => handleTemplateChange(template)}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded-lg border capitalize transition-all cursor-pointer ${
                    selectedTemplate === template
                      ? 'bg-blue-600 text-white shadow-2xs border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* JSON Editor */}
          <div className="relative">
            <textarea
              value={customJson}
              onChange={(e) => {
                setCustomJson(e.target.value);
                setParseError(null);
              }}
              rows={12}
              className="w-full bg-slate-900 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-200 focus:border-blue-500 focus:outline-none leading-relaxed shadow-inner"
            />
            {parseError && (
              <div className="absolute bottom-3 left-3 right-3 bg-red-900/90 text-red-100 border border-red-700 p-2.5 rounded-lg text-xs font-mono">
                Error: {parseError}
              </div>
            )}
          </div>

          {/* Inject Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Payload will immediately trigger map pin, live event stream, and alert triage.
            </span>
            <Button
              variant="brand"
              size="md"
              onClick={handleInject}
              className="text-xs px-6 py-2.5 font-medium"
            >
              {injectSuccess ? (
                <>
                  <CheckCircle2 size={15} className="text-white" />
                  Injected Successfully!
                </>
              ) : (
                <>
                  <Send size={15} />
                  Inject into Live Stream
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: API & Webhook Contract */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Format your Google Labs Flow tool export or Edge Video Pipeline POST payload with this schema:
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCopyEndpoint(JSON.stringify(samplePayloads.pothole, null, 2))}
            >
              <Copy size={12} />
              Copy Schema JSON
            </Button>
          </div>

          <pre className="bg-slate-900 border border-slate-200 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed shadow-inner">
{`POST /api/v1/prototype-ingest
Content-Type: application/json

{
  "toolId": "2bb18e92-ad04-4a87-9400-578ffc26e64b",
  "busId": "BUS-104",
  "cameraId": "CAM-104-FRONT",
  "timestamp": "2026-08-30T07:35:00Z",
  "detections": [
    {
      "category": "pothole | road-crack | waterlogging | traffic-congestion | debris-hazard | missing-signage",
      "label": "Severe Road Crater",
      "severity": "critical | high | medium | low",
      "confidence": 0.96,
      "boundingBox": { "x": 40, "y": 55, "width": 30, "height": 20 },
      "imageUrl": "https://...",
      "telemetry": {
        "vehicleSpeedKph": 38,
        "gForceZ": 1.82,
        "rainfallMm": 0
      }
    }
  ]
}`}
          </pre>
        </div>
      )}
    </Modal>
  );
};
