import React, { useState } from 'react';
import {
  Activity,
  Battery,
  BusFront,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Fuel,
  Gauge,
  Layers,
  MapPin,
  Radio,
  Search,
  ShieldAlert,
  Users,
  Video,
  Wifi,
} from 'lucide-react';
import type { Bus } from '../types/domain';
import { Badge, Button, Card, Modal } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';
import { sampleFrames } from '../data/mockData';

export const FleetTracker: React.FC = () => {
  const { buses, detections } = useUrbanData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Bus['status']>('all');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [cameraModalBus, setCameraModalBus] = useState<Bus | null>(null);

  const filteredBuses = buses.filter((bus) => {
    const matchStatus = filterStatus === 'all' || bus.status === filterStatus;
    const matchSearch =
      searchQuery === '' ||
      `${bus.id} ${bus.registration} ${bus.routeName} ${bus.driverName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● MUNICIPAL PUBLIC TRANSIT FLEET
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Live Transit & On-Board Dashcams</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, driver duty logs, and synchronized edge inference feeds from active buses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="good">
            {buses.filter((b) => b.status === 'active').length} Active On Route
          </Badge>
          <Badge tone="warn">
            {buses.filter((b) => b.status === 'delayed').length} Delayed
          </Badge>
        </div>
      </div>

      {/* Filter Row */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {(['all', 'active', 'delayed', 'idle'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-all font-medium ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-slate-200 bg-white'
              }`}
            >
              {st === 'all' ? 'All Vehicles' : st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicle ID, route, driver..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-sans shadow-2xs"
          />
        </div>
      </Card>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuses.map((bus) => {
          const busDetections = detections.filter((d) => d.busId === bus.id);

          return (
            <Card
              key={bus.id}
              className="p-5 border-slate-200 hover:border-slate-300 bg-white flex flex-col justify-between space-y-4 transition-all group rounded-2xl shadow-xs hover:shadow-md"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                      <BusFront size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 font-mono group-hover:text-blue-600">
                        {bus.id}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">{bus.registration}</span>
                    </div>
                  </div>

                  <Badge
                    tone={
                      bus.status === 'active'
                        ? 'good'
                        : bus.status === 'delayed'
                        ? 'warn'
                        : 'neutral'
                    }
                  >
                    {bus.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 font-medium mt-2">{bus.routeName}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-blue-600 shrink-0" />
                  <span className="truncate">{bus.location.address || bus.location.city}</span>
                </p>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">SPEED</span>
                  <strong className="text-slate-900 font-bold">{bus.speedKph} km/h</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">OCCUPANCY</span>
                  <strong className="text-blue-600 font-bold">
                    {bus.passengerCount}/{bus.capacity}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">BATTERY/FUEL</span>
                  <strong className="text-amber-600 font-bold">{bus.batteryOrFuelPercent}%</strong>
                </div>
              </div>

              {/* Live Dashcam Preview Strip */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Camera size={12} className="text-blue-600" />
                    <span>{bus.camerasCount} Dashcams Active</span>
                  </span>
                  <span className="text-slate-500">Stream: {bus.streamQuality}</span>
                </div>

                {busDetections.length > 0 ? (
                  <div className="bg-red-50 border border-red-200 p-2 rounded-xl text-[11px] font-mono text-red-700 flex items-center justify-between">
                    <span>⚠️ {busDetections.length} Anomaly Flagged</span>
                    <span className="text-[10px] text-red-600">Latest: {busDetections[0].type.slice(0, 18)}...</span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-[11px] font-mono text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>No active roadway hazards along corridor</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1 text-xs justify-center"
                  onClick={() => setCameraModalBus(bus)}
                >
                  <Video size={13} />
                  Live Camera Feed
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                  onClick={() => setSelectedBus(bus)}
                >
                  Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Live Camera Stream Modal */}
      {cameraModalBus && (
        <Modal
          isOpen={!!cameraModalBus}
          onClose={() => setCameraModalBus(null)}
          title={`Live In-Transit Optical Stream · ${cameraModalBus.id}`}
          subtitle={`${cameraModalBus.routeName} (Driver: ${cameraModalBus.driverName})`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
              <img
                src={sampleFrames.pothole1}
                alt="Live Dashcam Stream"
                className="w-full h-full object-cover"
              />

              {/* AI Overlay Box */}
              <div className="absolute top-[48%] left-[38%] w-[28%] h-[24%] border-2 border-blue-400 bg-blue-500/15 rounded-lg">
                <div className="absolute -top-6 left-0 bg-slate-900/90 text-white font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/20">
                  <span className="text-blue-300 font-bold">Pavement Surface Track: 96% Clear</span>
                </div>
              </div>

              {/* HUD Telemetry Watermark */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold">{cameraModalBus.id} / CAM-01-FRONT</span>
                <span className="text-slate-400">|</span>
                <span className="text-blue-400">{cameraModalBus.speedKph} KM/H</span>
                <span className="text-slate-400">|</span>
                <span>GPS: {cameraModalBus.location.latitude.toFixed(4)}, {cameraModalBus.location.longitude.toFixed(4)}</span>
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-900/80 px-2.5 py-1 rounded-lg text-[11px] font-mono text-blue-300 border border-white/10">
                PROTOTYPE INGEST: GOOGLE FLOW #2bb18e92
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Stream Protocol: WebRTC / H.264 Low Latency (~42ms)</span>
              <span>On-Board GPU: Edge Inference Enabled</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Bus Details Drawer Modal */}
      {selectedBus && (
        <Modal
          isOpen={!!selectedBus}
          onClose={() => setSelectedBus(null)}
          title={`Vehicle Specification & Duty Log · ${selectedBus.id}`}
          subtitle={selectedBus.registration}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">DRIVER ASSIGNED</span>
                <strong className="text-slate-900 text-sm">{selectedBus.driverName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">ROUTE CODE</span>
                <strong className="text-blue-600 text-sm">{selectedBus.routeId}</strong>
              </div>
              <div className="mt-2">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">PASSENGER CAPACITY</span>
                <strong className="text-slate-900 text-sm">{selectedBus.capacity} seats (Floor compliant)</strong>
              </div>
              <div className="mt-2">
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">AI CAMERAS MOUNTED</span>
                <strong className="text-slate-900 text-sm">{selectedBus.camerasCount} Units (Wide + Curb + Rear)</strong>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              This transit vehicle acts as a mobile optical probe for the Urban Intelligence Platform. As it traverses
              the city routes, high-resolution frames are automatically processed by Google Flow prototype pipelines to
              detect roadway degradation, standing water, and corridor obstructions without requiring separate dedicated
              inspection vans.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
