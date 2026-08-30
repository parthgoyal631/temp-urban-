import React from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

const categoryColors: Record<string, string> = {
  Potholes: '#ef4444',
  'Road Cracks': '#f97316',
  Waterlogging: '#38bdf8',
  'Traffic Congestion': '#eab308',
  'Debris Hazards': '#a855f7',
  'Missing Signage': '#64748b',
};

export const AnalyticsDashboard: React.FC = () => {
  const { detections, incidents, prototypeConfig } = useUrbanData();

  // Category counts
  const categoryData = [
    { name: 'Potholes', count: detections.filter((d) => d.category === 'pothole').length },
    { name: 'Road Cracks', count: detections.filter((d) => d.category === 'road-crack').length },
    { name: 'Waterlogging', count: detections.filter((d) => d.category === 'waterlogging').length },
    { name: 'Traffic Congestion', count: detections.filter((d) => d.category === 'traffic-congestion').length },
    { name: 'Debris Hazards', count: detections.filter((d) => d.category === 'debris-hazard').length },
    { name: 'Missing Signage', count: detections.filter((d) => d.category === 'missing-signage').length },
  ];

  // Severity counts
  const severityData = [
    { name: 'Critical', value: detections.filter((d) => d.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: detections.filter((d) => d.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: detections.filter((d) => d.severity === 'medium').length, color: '#eab308' },
    { name: 'Low', value: detections.filter((d) => d.severity === 'low').length, color: '#38bdf8' },
  ];

  // Simulated 7-day inference rate
  const weeklyTrendData = [
    { day: 'Mon', detections: 42, resolved: 38, avgLatency: 39 },
    { day: 'Tue', detections: 56, resolved: 49, avgLatency: 37 },
    { day: 'Wed', detections: 68, resolved: 60, avgLatency: 41 },
    { day: 'Thu', detections: 82, resolved: 71, avgLatency: 38 },
    { day: 'Fri', detections: 94, resolved: 85, avgLatency: 36 },
    { day: 'Sat', detections: 48, resolved: 45, avgLatency: 35 },
    { day: 'Sun', detections: 35, resolved: 32, avgLatency: 36 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● PLATFORM INTELLIGENCE ANALYTICS
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Cross-Corridor AI Detection Metrics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time inference throughput, anomaly distribution, and municipal work order resolution rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="good">
            Google Flow Tool: #{prototypeConfig.toolId.substring(0, 8)}
          </Badge>
        </div>
      </div>

      {/* Top 4 KPI metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL DETECTIONS</span>
          <strong className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{detections.length}</strong>
          <span className="text-xs text-emerald-600 font-medium">100% Inferred via Flow AI</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL WORK ORDERS</span>
          <strong className="text-2xl font-bold font-mono text-blue-600 mt-1 block">{incidents.length}</strong>
          <span className="text-xs text-slate-500 font-medium">
            {incidents.filter((i) => i.status === 'resolved').length} Resolved
          </span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROTOTYPE FRAMES</span>
          <strong className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {prototypeConfig.inferredFramesCount.toLocaleString()}
          </strong>
          <span className="text-xs text-slate-500 font-medium">30 fps pipeline</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AVG INFERENCE LATENCY</span>
          <strong className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
            {prototypeConfig.averageInferenceLatencyMs} ms
          </strong>
          <span className="text-xs text-emerald-600 font-medium">Edge GPU acceleration</span>
        </Card>
      </div>

      {/* Chart Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Bar & Line */}
        <Card className="lg:col-span-8 p-6 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                7-DAY TEMPORAL INGESTION
              </span>
              <h3 className="text-sm font-semibold text-slate-900">AI Detections vs Resolved Work Orders</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Detections
              </span>
              <span className="flex items-center gap-1.5 text-sky-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="detections" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Severity Distribution Donut */}
        <Card className="lg:col-span-4 p-6 bg-white border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              SEVERITY COMPOSITION
            </span>
            <h3 className="text-sm font-semibold text-slate-900">Defect Severity Tiers</h3>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-slate-100">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span style={{ backgroundColor: item.color }} className="w-2.5 h-2.5 rounded-full" />
                <span className="text-slate-500">{item.name}:</span>
                <strong className="text-slate-900">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chart Row 2: Category Breakdown */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              TAXONOMY CLASSIFICATION
            </span>
            <h3 className="text-sm font-semibold text-slate-900">Detections by Anomaly Category</h3>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={130} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '11px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || '#2563eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
