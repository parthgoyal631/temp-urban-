import React from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Construction,
  Layers,
  MapPin,
  Radio,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Badge, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const InfrastructureView: React.FC = () => {
  const { infrastructure } = useUrbanData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● MUNICIPAL ASSET AUDIT
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Public Infrastructure Assets & Sensors</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated visual health checks on bus shelters, traffic signals, culverts, and streetlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="good">5 Monitored Key Assets</Badge>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {infrastructure.map((asset) => {
          return (
            <Card
              key={asset.id}
              className="p-5 border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 rounded-2xl shadow-xs hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{asset.id}</span>
                  <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{asset.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{asset.type.replace('-', ' ')}</p>
                </div>

                <Badge
                  tone={
                    asset.status === 'operational'
                      ? 'good'
                      : asset.status === 'degraded'
                      ? 'warn'
                      : 'critical'
                  }
                >
                  {asset.status.toUpperCase()}
                </Badge>
              </div>

              {/* Health Score */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Asset Health Rating</span>
                  <strong className="text-slate-900">{asset.healthScore} / 100</strong>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${asset.healthScore}%` }}
                    className={`h-full rounded-full ${
                      asset.healthScore > 80
                        ? 'bg-emerald-500'
                        : asset.healthScore > 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-3 border-t border-slate-100">
                <span>Last Maintained: {asset.lastMaintained}</span>
                <span className="text-red-600 font-semibold">{asset.recentDetections} Flags</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
