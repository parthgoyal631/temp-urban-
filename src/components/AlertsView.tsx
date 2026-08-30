import React from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Radio,
  ShieldAlert,
  Volume2,
} from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

export const AlertsView: React.FC = () => {
  const { alerts, markAlertAsRead } = useUrbanData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● REAL-TIME DISPATCH ALERTS
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Supervisor Notifications & Alarms</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated escalation alerts triggered by critical prototype detections and high-G road impacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge severity="critical">
            {alerts.filter((a) => !a.read).length} Unread High-Priority
          </Badge>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          return (
            <Card
              key={alert.id}
              className={`p-4 border border-slate-200 flex items-start gap-4 transition-all rounded-2xl ${
                alert.read ? 'bg-slate-50/70 opacity-75' : 'bg-white shadow-xs'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                <ShieldAlert size={18} />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">{alert.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                  <Badge severity={alert.severity} className="text-[9px] py-0">
                    {alert.severity.toUpperCase()}
                  </Badge>

                  {!alert.read && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={12} />
                      Acknowledge Alert
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
