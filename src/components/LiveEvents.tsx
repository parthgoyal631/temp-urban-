import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  Construction,
  Droplets,
  Filter,
  Layers,
  MapPin,
  Radio,
  Search,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import type { DetectionEvent, Severity, DefectCategory } from '../types/domain';
import { Badge, Card, EmptyState } from './ui';

interface LiveEventsProps {
  events: DetectionEvent[];
  selectedId?: string;
  onSelect: (event: DetectionEvent) => void;
  className?: string;
}

export const LiveEvents: React.FC<LiveEventsProps> = ({
  events,
  selectedId,
  onSelect,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | Severity>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | DefectCategory>('all');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSeverity = selectedSeverity === 'all' || e.severity === selectedSeverity;
      const matchCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        `${e.type} ${e.location.roadName || ''} ${e.location.city || ''} ${e.busId || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchSeverity && matchCategory && matchSearch;
    });
  }, [events, selectedSeverity, selectedCategory, searchQuery]);

  const getCategoryIcon = (category: DefectCategory) => {
    switch (category) {
      case 'pothole':
      case 'road-crack':
        return <Construction size={14} className="text-amber-400" />;
      case 'waterlogging':
      case 'drainage-clog':
        return <Droplets size={14} className="text-sky-400" />;
      case 'traffic-congestion':
        return <Waves size={14} className="text-yellow-400" />;
      default:
        return <AlertCircle size={14} className="text-red-400" />;
    }
  };

  return (
    <Card className={`flex flex-col h-[520px] p-0 overflow-hidden bg-white border-slate-200 shadow-xs rounded-2xl ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              REAL-TIME DETECTION INGEST
            </span>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mt-0.5">
              <span>Prototype Telemetry Feed</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● LIVE
              </span>
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 font-medium">
            {filteredEvents.length} Event(s)
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by road, bus ID, hazard..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-sans transition-all shadow-2xs"
            />
          </div>

          {/* Severity Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap capitalize font-medium ${
                  selectedSeverity === sev
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const isSelected = selectedId === event.id;
            const timeFormatted = new Date(event.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <button
                key={event.id}
                onClick={() => onSelect(event)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors group focus:outline-none ${
                  isSelected
                    ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Visual Thumbnail or Category Icon */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                  <img
                    src={
                      event.frame?.imageUrl ||
                      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'
                    }
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] font-mono text-white font-semibold">
                      {(event.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600">
                      {event.type}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{timeFormatted}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <MapPin size={11} className="text-slate-400 shrink-0" />
                    <span>{event.location.roadName || event.location.city}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge severity={event.severity} className="text-[10px] py-0.5 px-2">
                      {event.severity}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">
                      {event.busId || 'CAM-INGEST'}
                    </span>
                    {event.status === 'escalated' && (
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                        Escalated
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight size={14} className="text-slate-300 self-center shrink-0 group-hover:text-slate-600" />
              </button>
            );
          })
        ) : (
          <EmptyState
            title="No anomalies match filter"
            description="Adjust search parameters or trigger a new payload from the prototype injector."
          />
        )}
      </div>
    </Card>
  );
};
