import React from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Construction,
  Layers,
  MapPin,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const RoadIntelligenceView: React.FC = () => {
  const { roadSegments, detections } = useUrbanData();

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'excellent':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'good':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'watch':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'attention':
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● MUNICIPAL PAVEMENT QUALITY MONITOR
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Road Surface Health & PQI Scoring</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated Pavement Quality Index (PQI 0–100) continuously calculated from bus-mounted vision AI feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right font-mono">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CITY-WIDE AVG PQI</span>
            <span className="text-lg font-bold text-blue-600">69.4 / 100</span>
          </div>
        </div>
      </div>

      {/* Road Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roadSegments.map((road) => {
          const roadDetections = detections.filter(
            (d) =>
              d.location.roadName?.toLowerCase().includes(road.name.toLowerCase().slice(0, 10)) ||
              d.location.city === road.locality
          );

          return (
            <Card
              key={road.id}
              className="p-5 border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 rounded-2xl shadow-xs hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{road.id} · {road.zone}</span>
                  <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{road.name}</h3>
                  <p className="text-xs text-slate-500">{road.locality}</p>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase ${getConditionColor(
                    road.condition
                  )}`}
                >
                  {road.condition}
                </div>
              </div>

              {/* PQI Score Bar */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Pavement Quality Index</span>
                  <strong className="text-slate-900 text-sm">{road.pavementQualityIndex} / 100</strong>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${road.pavementQualityIndex}%` }}
                    className={`h-full rounded-full ${
                      road.pavementQualityIndex > 80
                        ? 'bg-emerald-500'
                        : road.pavementQualityIndex > 60
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-600">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LENGTH</span>
                  <span className="text-slate-900 font-semibold">{road.lengthKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TRAFFIC</span>
                  <span className="text-blue-600 capitalize font-medium">{road.trafficLoad}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ANOMALIES</span>
                  <span className="text-red-600 font-bold">{road.defectCount}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>Inspected: {new Date(road.lastInspected).toLocaleDateString()}</span>
                <span>Active Defects: {roadDetections.length}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
