import React from 'react';
import {
  AlertTriangle,
  BusFront,
  ChevronRight,
  Clock,
  Compass,
  Layers,
  MapPin,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { Badge, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const RouteIntelligenceView: React.FC = () => {
  const { routes, buses, detections } = useUrbanData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● TRANSIT CORRIDOR HEALTH
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Public Transit Corridors & Bottlenecks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time transit line health scores aggregated from road defects and transit delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="good">{routes.length} Active Bus Lines</Badge>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routes.map((route) => {
          const routeBuses = buses.filter((b) => b.routeId === route.id);
          const routeDetections = detections.filter(
            (d) => d.busId && routeBuses.some((b) => b.id === d.busId)
          );

          return (
            <Card
              key={route.id}
              className="p-5 border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 rounded-2xl shadow-xs hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: route.color }}
                      className="w-2.5 h-2.5 rounded-full"
                    />
                    <span className="text-xs font-mono font-bold text-slate-900">{route.id}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mt-1">{route.name}</h3>
                </div>

                <Badge
                  tone={
                    route.status === 'active'
                      ? 'good'
                      : route.status === 'congested'
                      ? 'warn'
                      : 'neutral'
                  }
                >
                  {route.status.toUpperCase()}
                </Badge>
              </div>

              {/* Waypoint Strip */}
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <MapPin size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">{route.start}</span>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                <span className="truncate font-semibold text-slate-900">{route.end}</span>
              </div>

              {/* Corridor Health Score */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Corridor Operational Health</span>
                  <strong className="text-slate-900">{route.healthScore}%</strong>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${route.healthScore}%` }}
                    className={`h-full rounded-full ${
                      route.healthScore > 80
                        ? 'bg-emerald-500'
                        : route.healthScore > 65
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 text-xs font-mono text-slate-600 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DISTANCE</span>
                  <span className="text-slate-900 font-semibold">{route.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EST. TRIP</span>
                  <span className="text-slate-900 font-semibold">{route.avgDurationMins}m</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BUSES</span>
                  <span className="text-blue-600 font-bold">{routeBuses.length}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HAZARDS</span>
                  <span className="text-red-600 font-bold">{routeDetections.length}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
