import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Alert,
  Bus,
  Camera,
  DetectionEvent,
  Incident,
  InfrastructureAsset,
  PrototypeConfig,
  RoadSegment,
  Route,
  Severity,
} from '../types/domain';
import {
  initialPrototypeDetections,
  mockAlerts,
  mockBuses,
  mockCameras,
  mockIncidents,
  mockInfrastructure,
  mockRoadSegments,
  mockRoutes,
  sampleFrames,
} from '../data/mockData';
import { adaptFlowDetection } from '../services/adapters/detectionAdapter';

interface UrbanDataContextType {
  // Data
  detections: DetectionEvent[];
  buses: Bus[];
  cameras: Camera[];
  incidents: Incident[];
  alerts: Alert[];
  routes: Route[];
  roadSegments: RoadSegment[];
  infrastructure: InfrastructureAsset[];
  
  // Prototype connection state
  prototypeConfig: PrototypeConfig;
  updatePrototypeConfig: (config: Partial<PrototypeConfig>) => void;
  
  // Selection
  selectedEntity: { type: 'bus' | 'detection' | 'incident' | 'road' | 'camera'; id: string; data: any } | null;
  setSelectedEntity: (entity: { type: 'bus' | 'detection' | 'incident' | 'road' | 'camera'; id: string; data: any } | null) => void;
  
  // Actions
  updateDetectionStatus: (id: string, status: DetectionEvent['status'], notes?: string) => void;
  escalateDetectionToIncident: (detection: DetectionEvent, dept?: Incident['assignedDepartment'], priority?: Incident['priority']) => Incident;
  updateIncidentStatus: (id: string, status: Incident['status'], dept?: Incident['assignedDepartment'], notes?: string) => void;
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => void;
  acknowledgeAlert: (id: string) => void;
  markAllAlertsRead: () => void;
  injectPrototypeDetection: (raw: any) => DetectionEvent;
  
  // Simulation control
  isSimulationActive: boolean;
  setIsSimulationActive: (active: boolean) => void;
  resetAllData: () => void;
  
  // Metrics
  metrics: {
    activeFleetCount: number;
    totalDetectionsToday: number;
    criticalHazardsCount: number;
    averagePqi: number;
    openIncidentsCount: number;
    liveInferenceFps: number;
  };
}

const defaultPrototypeConfig: PrototypeConfig = {
  toolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
  toolUrl: 'https://labs.google/fx/tools/flow/shared/tool/2bb18e92-ad04-4a87-9400-578ffc26e64b',
  mode: 'simulated-stream',
  endpointUrl: 'https://api.urbanintel.internal/v1/flow-ingest',
  autoRefreshIntervalMs: 5000,
  isConnected: true,
  lastHeartbeat: new Date().toISOString(),
  inferredFramesCount: 14820,
  averageInferenceLatencyMs: 38,
  modelConfidenceCutoff: 0.70,
};

const UrbanDataContext = createContext<UrbanDataContextType | undefined>(undefined);

export const UrbanDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [detections, setDetections] = useState<DetectionEvent[]>(initialPrototypeDetections);
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [routes] = useState<Route[]>(mockRoutes);
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>(mockRoadSegments);
  const [infrastructure, setInfrastructure] = useState<InfrastructureAsset[]>(mockInfrastructure);
  
  const [prototypeConfig, setPrototypeConfig] = useState<PrototypeConfig>(defaultPrototypeConfig);
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'bus' | 'detection' | 'incident' | 'road' | 'camera'; id: string; data: any } | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);

  const updatePrototypeConfig = useCallback((partial: Partial<PrototypeConfig>) => {
    setPrototypeConfig(prev => ({ ...prev, ...partial }));
  }, []);

  // Update detection status
  const updateDetectionStatus = useCallback((id: string, status: DetectionEvent['status'], notes?: string) => {
    setDetections(prev =>
      prev.map(d => (d.id === id ? { ...d, status, notes: notes || d.notes } : d))
    );
  }, []);

  // Escalate detection to incident
  const escalateDetectionToIncident = useCallback((detection: DetectionEvent, dept?: Incident['assignedDepartment'], priority?: Incident['priority']) => {
    const assignedDept: Incident['assignedDepartment'] = dept || (
      detection.category === 'waterlogging' || detection.category === 'drainage-clog' ? 'Stormwater Drainage' :
      detection.category === 'traffic-congestion' || detection.category === 'illegal-parking' ? 'Traffic Police' :
      'Public Works'
    );
    
    const incPriority: Incident['priority'] = priority || (
      detection.severity === 'critical' ? 'P1' :
      detection.severity === 'high' ? 'P2' :
      detection.severity === 'medium' ? 'P3' : 'P4'
    );

    const newIncident: Incident = {
      id: `INC-2026-${Math.floor(Math.random() * 900 + 100)}`,
      title: `Escalated: ${detection.type} (${detection.location.roadName || detection.location.city || 'Transit Route'})`,
      category: detection.category,
      severity: detection.severity,
      status: 'new',
      location: detection.location,
      createdAt: new Date().toISOString(),
      detectionId: detection.id,
      assignedDepartment: assignedDept,
      priority: incPriority,
      estimatedRepairCost: detection.severity === 'critical' ? 50000 : 25000,
      description: `Automated incident generated from Prototype Ingest (#${detection.id}). Notes: ${detection.notes || 'Awaiting supervisor triage.'}`
    };

    setIncidents(prev => [newIncident, ...prev]);
    updateDetectionStatus(detection.id, 'escalated');
    
    // Add alert
    const newAlert: Alert = {
      id: `ALT-${Date.now()}`,
      title: `New Incident: ${newIncident.title}`,
      message: `Assigned to ${assignedDept} with ${incPriority} priority.`,
      severity: detection.severity,
      category: 'safety',
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: true,
      relatedEntityId: newIncident.id,
      relatedEntityType: 'incident'
    };
    setAlerts(prev => [newAlert, ...prev]);

    return newIncident;
  }, [updateDetectionStatus]);

  // Update incident status
  const updateIncidentStatus = useCallback((id: string, status: Incident['status'], dept?: Incident['assignedDepartment'], notes?: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? {
        ...inc,
        status,
        assignedDepartment: dept || inc.assignedDepartment,
        updatedAt: new Date().toISOString(),
        description: notes ? `${inc.description}\n[Update]: ${notes}` : inc.description
      } : inc))
    );
  }, []);

  const createIncident = useCallback((incident: Omit<Incident, 'id' | 'createdAt'>) => {
    const newInc: Incident = {
      ...incident,
      id: `INC-2026-${Math.floor(Math.random() * 900 + 100)}`,
      createdAt: new Date().toISOString()
    };
    setIncidents(prev => [newInc, ...prev]);
  }, []);

  // Alert management
  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  }, []);

  // Ingest detection directly from Prototype
  const injectPrototypeDetection = useCallback((raw: any) => {
    const adapted = adaptFlowDetection(raw);
    setDetections(prev => [adapted, ...prev.slice(0, 49)]); // Keep latest 50
    
    setPrototypeConfig(prev => ({
      ...prev,
      inferredFramesCount: prev.inferredFramesCount + 1,
      lastHeartbeat: new Date().toISOString()
    }));

    // If critical/high, trigger alert
    if (adapted.severity === 'critical' || adapted.severity === 'high') {
      const alert: Alert = {
        id: `ALT-${Date.now()}`,
        title: `AI Prototype Alert: ${adapted.type}`,
        message: `High confidence anomaly (${(adapted.confidence * 100).toFixed(0)}%) detected by Flow pipeline at ${adapted.location.roadName || adapted.location.city}.`,
        severity: adapted.severity,
        category: 'infrastructure',
        timestamp: new Date().toISOString(),
        read: false,
        actionRequired: true,
        relatedEntityId: adapted.id,
        relatedEntityType: 'detection'
      };
      setAlerts(prev => [alert, ...prev]);
    }

    return adapted;
  }, []);

  // Reset to initial baseline
  const resetAllData = useCallback(() => {
    setDetections(initialPrototypeDetections);
    setBuses(mockBuses);
    setIncidents(mockIncidents);
    setAlerts(mockAlerts);
    setPrototypeConfig(defaultPrototypeConfig);
    setSelectedEntity(null);
  }, []);

  // Background Simulation Loop for continuous live prototype stream & bus telemetry
  useEffect(() => {
    if (!isSimulationActive || prototypeConfig.mode === 'manual-batch') return;

    const interval = setInterval(() => {
      // 1. Move active buses slightly to simulate GPS telemetry
      setBuses(prev => prev.map(bus => {
        if (bus.status !== 'active') return bus;
        const latDelta = (Math.random() - 0.48) * 0.0008;
        const lngDelta = (Math.random() - 0.48) * 0.0008;
        const newSpeed = Math.max(10, Math.min(65, bus.speedKph + Math.floor((Math.random() - 0.5) * 6)));
        return {
          ...bus,
          location: {
            ...bus.location,
            latitude: bus.location.latitude + latDelta,
            longitude: bus.location.longitude + lngDelta,
          },
          speedKph: newSpeed,
          lastUpdated: new Date().toISOString()
        };
      }));

      // 2. Increment prototype inferred frames counter
      setPrototypeConfig(prev => ({
        ...prev,
        inferredFramesCount: prev.inferredFramesCount + Math.floor(Math.random() * 8 + 4),
        lastHeartbeat: new Date().toISOString()
      }));

      // 3. Occasionally generate a new AI detection event (approx every 35-45s or 12% probability per tick)
      if (Math.random() < 0.15) {
        const categories: Array<{
          cat: DetectionEvent['category'];
          type: string;
          sev: Severity;
          sample: string;
          label: string;
        }> = [
          { cat: 'pothole', type: 'Surface Pothole (Depth ~45mm)', sev: 'medium', sample: sampleFrames.pothole1, label: 'Road Surface Crater' },
          { cat: 'road-crack', type: 'Longitudinal Seal Failure', sev: 'low', sample: sampleFrames.crack1, label: 'Asphalt Seam Split' },
          { cat: 'traffic-congestion', type: 'Intersection Stalling & Heavy Queue', sev: 'high', sample: sampleFrames.traffic1, label: 'Queue Length > 180m' },
          { cat: 'debris-hazard', type: 'Fallen Tree Branch / Roadway Obstruction', sev: 'medium', sample: sampleFrames.debris1, label: 'Shoulder Debris' },
        ];

        const pick = categories[Math.floor(Math.random() * categories.length)];
        const bus = mockBuses[Math.floor(Math.random() * mockBuses.length)];
        
        const autoDetection = adaptFlowDetection({
          type: pick.type,
          category: pick.cat,
          severity: pick.sev,
          confidence: Number((0.82 + Math.random() * 0.15).toFixed(2)),
          busId: bus.id,
          location: {
            ...bus.location,
            latitude: bus.location.latitude + (Math.random() - 0.5) * 0.003,
            longitude: bus.location.longitude + (Math.random() - 0.5) * 0.003,
          },
          frame: {
            imageUrl: pick.sample
          },
          boundingBox: {
            x: 25 + Math.floor(Math.random() * 30),
            y: 40 + Math.floor(Math.random() * 20),
            width: 35,
            height: 25
          }
        });

        setDetections(prev => [autoDetection, ...prev.slice(0, 49)]);
      }
    }, prototypeConfig.autoRefreshIntervalMs || 5000);

    return () => clearInterval(interval);
  }, [isSimulationActive, prototypeConfig.mode, prototypeConfig.autoRefreshIntervalMs]);

  // Derived KPIs
  const metrics = useMemo(() => {
    const activeFleetCount = buses.filter(b => b.status === 'active').length;
    const totalDetectionsToday = detections.length;
    const criticalHazardsCount = detections.filter(d => d.severity === 'critical' || d.severity === 'high').length;
    const averagePqi = Math.round(roadSegments.reduce((acc, r) => acc + r.pavementQualityIndex, 0) / (roadSegments.length || 1));
    const openIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;
    const liveInferenceFps = prototypeConfig.isConnected ? 30 : 0;

    return {
      activeFleetCount,
      totalDetectionsToday,
      criticalHazardsCount,
      averagePqi,
      openIncidentsCount,
      liveInferenceFps
    };
  }, [buses, detections, roadSegments, incidents, prototypeConfig.isConnected]);

  return (
    <UrbanDataContext.Provider
      value={{
        detections,
        buses,
        cameras,
        incidents,
        alerts,
        routes,
        roadSegments,
        infrastructure,
        prototypeConfig,
        updatePrototypeConfig,
        selectedEntity,
        setSelectedEntity,
        updateDetectionStatus,
        escalateDetectionToIncident,
        updateIncidentStatus,
        createIncident,
        acknowledgeAlert,
        markAllAlertsRead,
        injectPrototypeDetection,
        isSimulationActive,
        setIsSimulationActive,
        resetAllData,
        metrics,
      }}
    >
      {children}
    </UrbanDataContext.Provider>
  );
};

export const useUrbanData = () => {
  const context = useContext(UrbanDataContext);
  if (!context) {
    throw new Error('useUrbanData must be used within an UrbanDataProvider');
  }
  return context;
};
