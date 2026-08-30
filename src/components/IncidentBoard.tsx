import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  MapPin,
  Plus,
  Radio,
  Search,
  ShieldAlert,
  Sliders,
  Sparkles,
  Tag,
  UserCheck,
  Wrench,
} from 'lucide-react';
import type { Incident, Severity } from '../types/domain';
import { Badge, Button, Card, Modal } from './ui';
import { useUrbanData } from '../context/UrbanDataContext';

const stages: Array<{ id: Incident['status']; label: string; tone: 'critical' | 'warn' | 'brand' | 'good' }> = [
  { id: 'new', label: 'New Anomalies', tone: 'critical' },
  { id: 'acknowledged', label: 'Under Review / Assigned', tone: 'warn' },
  { id: 'in-progress', label: 'Work Order Dispatched', tone: 'brand' },
  { id: 'resolved', label: 'Resolved / Verified', tone: 'good' },
];

export const IncidentBoard: React.FC = () => {
  const { incidents, updateIncidentStatus, createIncident } = useUrbanData();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New incident form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Incident['category']>('pothole');
  const [newSeverity, setNewSeverity] = useState<Severity>('high');
  const [newDept, setNewDept] = useState<Incident['assignedDepartment']>('Public Works');
  const [newRoad, setNewRoad] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchDept = filterDept === 'all' || inc.assignedDepartment === filterDept;
    const matchSearch =
      searchQuery === '' ||
      `${inc.title} ${inc.location.roadName || ''} ${inc.location.city || ''} ${inc.id}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createIncident({
      title: newTitle,
      category: newCategory,
      severity: newSeverity,
      status: 'new',
      assignedDepartment: newDept,
      priority: newSeverity === 'critical' ? 'P1' : newSeverity === 'high' ? 'P2' : 'P3',
      location: {
        latitude: 26.85,
        longitude: 80.94,
        roadName: newRoad || 'Central Transit Line',
        city: 'Lucknow Central',
        zone: 'Zone 1',
      },
      description: newDesc || 'Supervisor manual dispatch request.',
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewRoad('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">
            ● MUNICIPAL INCIDENT TRIAGE WORKFLOW
          </span>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">Incident Response & Work Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate autonomous defect detections directly with Public Works, Drainage, and Traffic Police.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="brand" size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={14} />
            Create Work Order
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {['all', 'Public Works', 'Traffic Police', 'Stormwater Drainage'].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                filterDept === dept
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-slate-200 bg-white'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident ID, road, title..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-sans shadow-2xs"
          />
        </div>
      </Card>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage) => {
          const columnIncidents = filteredIncidents.filter((i) => i.status === stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">{stage.label}</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs">
                  {columnIncidents.length}
                </span>
              </div>

              {/* Incidents Stack */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[620px] pr-1">
                {columnIncidents.map((incident) => {
                  return (
                    <div
                      key={incident.id}
                      onClick={() => setSelectedIncident(incident)}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 space-y-2.5 cursor-pointer transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-slate-400">{incident.id}</span>
                        <Badge severity={incident.severity} className="text-[9px] py-0.5 px-2">
                          {incident.priority} · {incident.severity}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 leading-snug hover:text-blue-600">
                        {incident.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin size={11} className="text-blue-600 shrink-0" />
                        <span className="truncate">{incident.location.roadName || incident.location.city}</span>
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Building2 size={11} className="text-slate-400" />
                          <span className="truncate max-w-[110px]">{incident.assignedDepartment}</span>
                        </span>
                        <span>{new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Quick Status Stage Advance Dropdown */}
                      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={incident.status}
                          onChange={(e) =>
                            updateIncidentStatus(incident.id, e.target.value as Incident['status'])
                          }
                          className="w-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
                        >
                          <option value="new">Status: New</option>
                          <option value="acknowledged">Status: Acknowledged</option>
                          <option value="in-progress">Status: Dispatched</option>
                          <option value="resolved">Status: Resolved</option>
                        </select>
                      </div>
                    </div>
                  );
                })}

                {columnIncidents.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No items in {stage.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Modal
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`Incident Detail · ${selectedIncident.id}`}
          subtitle={selectedIncident.title}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">PRIORITY</span>
                <span className="text-slate-900 font-bold">{selectedIncident.priority} ({selectedIncident.severity})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">DEPARTMENT</span>
                <span className="text-blue-600 font-bold">{selectedIncident.assignedDepartment}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">EST. REPAIR</span>
                <span className="text-emerald-600 font-bold">₹{selectedIncident.estimatedRepairCost?.toLocaleString() || '35,000'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">WORK ORDER</span>
                <span className="text-amber-600 font-bold">{selectedIncident.workOrderId || 'WO-PENDING'}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="text-xs font-semibold text-slate-900 font-mono">INCIDENT DESCRIPTION & AUDIT LOG</h5>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedIncident.description}
              </p>
            </div>

            {selectedIncident.detectionId && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs font-mono text-blue-700">
                <span>🔗 Linked to Autonomous AI Detection #{selectedIncident.detectionId}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                onClick={() => {
                  updateIncidentStatus(selectedIncident.id, 'resolved');
                  setSelectedIncident(null);
                }}
              >
                <CheckCircle2 size={14} />
                Mark Incident Resolved
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Create Incident Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Municipal Incident / Dispatch Work Order"
        subtitle="Manually log roadway hazards or dispatch emergency response teams."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">INCIDENT TITLE *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Broken Culvert & Waterlogging on MG Marg"
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">DEPARTMENT</label>
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-sans"
              >
                <option value="Public Works">Public Works</option>
                <option value="Traffic Police">Traffic Police</option>
                <option value="Stormwater Drainage">Stormwater Drainage</option>
                <option value="Transit Authority">Transit Authority</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">SEVERITY</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-sans"
              >
                <option value="critical">Critical (P1)</option>
                <option value="high">High (P2)</option>
                <option value="medium">Medium (P3)</option>
                <option value="low">Low (P4)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">LOCATION / ROAD NAME</label>
            <input
              type="text"
              value={newRoad}
              onChange={(e) => setNewRoad(e.target.value)}
              placeholder="e.g. Vikas Nagar Sector 4 Underpass"
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">DISPATCH INSTRUCTIONS & NOTES</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Provide repair guidelines, team contact, equipment needed..."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" type="submit">
              Dispatch Work Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
