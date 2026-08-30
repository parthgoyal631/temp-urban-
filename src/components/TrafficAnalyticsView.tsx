import React from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Navigation,
  Sparkles,
  TrendingUp,
  Waves,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

const hourlyTrafficData = [
  { time: '06:00', avgSpeed: 46, delayMinutes: 3, congestionIndex: 25 },
  { time: '07:00', avgSpeed: 38, delayMinutes: 6, congestionIndex: 42 },
  { time: '08:00', avgSpeed: 24, delayMinutes: 16, congestionIndex: 78 },
  { time: '09:00', avgSpeed: 18, delayMinutes: 24, congestionIndex: 92 },
  { time: '10:00', avgSpeed: 28, delayMinutes: 14, congestionIndex: 65 },
  { time: '11:00', avgSpeed: 34, delayMinutes: 8, congestionIndex: 48 },
  { time: '12:00', avgSpeed: 36, delayMinutes: 7, congestionIndex: 45 },
  { time: '13:00', avgSpeed: 35, delayMinutes: 9, congestionIndex: 50 },
  { time: '14:00', avgSpeed: 32, delayMinutes: 11, congestionIndex: 56 },
  { time: '15:00', avgSpeed: 30, delayMinutes: 13, congestionIndex: 62 },
  { time: '16:00', avgSpeed: 22, delayMinutes: 19, congestionIndex: 84 },
  { time: '17:00', avgSpeed: 16, delayMinutes: 28, congestionIndex: 96 },
  { time: '18:00', avgSpeed: 15, delayMinutes: 31, congestionIndex: 98 },
  { time: '19:00', avgSpeed: 25, delayMinutes: 15, congestionIndex: 70 },
  { time: '20:00', avgSpeed: 39, delayMinutes: 5, congestionIndex: 35 },
];

export const TrafficAnalyticsView: React.FC = () => {
  const { buses, detections } = useUrbanData();
  const trafficDetections = detections.filter((d) => d.category === 'traffic-congestion');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● TRANSIT CORRIDOR TRAFFIC ENGINE
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Traffic Velocity & Bottleneck Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Correlation between road defects, illegal parking encroachments, and public transit schedule variance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="warn">Peak Rush Hour: 17:00–19:00</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NETWORK AVG SPEED</span>
          <strong className="text-xl font-bold font-mono text-slate-900 mt-1 block">28.4 km/h</strong>
          <span className="text-xs text-amber-600 font-medium">↓ -12% vs free-flow</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PEAK TRANSIT DELAY</span>
          <strong className="text-xl font-bold font-mono text-red-600 mt-1 block">+31 mins</strong>
          <span className="text-xs text-slate-500 font-medium">Route 10 Corridor</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CONGESTION ANOMALIES</span>
          <strong className="text-xl font-bold font-mono text-blue-600 mt-1 block">{trafficDetections.length}</strong>
          <span className="text-xs text-slate-500 font-medium">Flagged by Flow AI</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CORRIDOR RELIABILITY</span>
          <strong className="text-xl font-bold font-mono text-emerald-600 mt-1 block">84.2%</strong>
          <span className="text-xs text-slate-500 font-medium">On-time adherence</span>
        </Card>
      </div>

      {/* Chart 1: Hourly Velocity & Congestion Trend */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              24-HOUR CORRIDOR TEMPORAL PROFILE
            </span>
            <h3 className="text-sm font-semibold text-slate-900">Transit Speed vs Congestion Index</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Avg Speed (km/h)
            </span>
            <span className="flex items-center gap-1.5 text-rose-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Congestion Index (%)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyTrafficData}>
              <defs>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
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
              <Area type="monotone" dataKey="avgSpeed" stroke="#2563eb" fill="url(#speedGrad)" strokeWidth={2} name="Avg Speed (km/h)" />
              <Area type="monotone" dataKey="congestionIndex" stroke="#f43f5e" fill="url(#congGrad)" strokeWidth={2} name="Congestion Index (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
