export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ConnectionStatus = 'connected' | 'offline' | 'connecting' | 'streaming';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  zone?: string;
  roadName?: string;
}

export interface BoundingBox {
  id?: string;
  label: string;
  confidence: number;
  x: number;      // normalized 0..100 percentage or 0..1
  y: number;      // normalized 0..100 percentage or 0..1
  width: number;  // normalized percentage
  height: number; // normalized percentage
  color?: string;
}

export interface DetectionFrame {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  capturedAt: string;
  width?: number;
  height?: number;
  cameraType?: 'front-dash' | 'curb-side' | 'rear-view' | 'fixed-cctv';
  resolution?: string;
}

export type DefectCategory = 
  | 'pothole'
  | 'road-crack'
  | 'waterlogging'
  | 'traffic-congestion'
  | 'illegal-parking'
  | 'debris-hazard'
  | 'missing-signage'
  | 'pedestrian-encroachment'
  | 'drainage-clog';

export interface DetectionEvent {
  id: string;
  type: string;
  category: DefectCategory;
  severity: Severity;
  confidence: number;
  busId?: string;
  cameraId?: string;
  timestamp: string;
  location: Location;
  frame?: DetectionFrame;
  boundingBoxes?: BoundingBox[];
  status: 'new' | 'reviewing' | 'verified' | 'escalated' | 'dismissed';
  notes?: string;
  flowToolId?: string; // Reference to Google Flow prototype
  telemetry?: {
    vehicleSpeedKph?: number;
    ambientTempC?: number;
    rainfallMm?: number;
    gForceZ?: number; // accelerometer bump impact
  };
}

export interface Bus {
  id: string;
  registration: string;
  routeId: string;
  routeName: string;
  driverName: string;
  status: 'active' | 'idle' | 'delayed' | 'offline';
  location: Location;
  passengerCount: number;
  capacity: number;
  speedKph: number;
  batteryOrFuelPercent: number;
  lastUpdated: string;
  camerasCount: number;
  activeDetectionsCount: number;
  streamQuality: '1080p' | '720p' | 'degraded' | 'offline';
}

export interface Camera {
  id: string;
  busId?: string;
  label: string;
  mountType: 'front' | 'rear' | 'door-side' | 'pole-mounted';
  status: 'online' | 'offline' | 'calibrating';
  streamUrl?: string;
  fps: number;
  resolution: string;
  location?: Location;
  lastFrameUrl?: string;
  detectionsCount24h: number;
}

export interface Incident {
  id: string;
  title: string;
  category: DefectCategory;
  severity: Severity;
  status: 'new' | 'acknowledged' | 'in-progress' | 'resolved';
  location: Location;
  createdAt: string;
  updatedAt?: string;
  detectionId?: string;
  assignedDepartment: 'Public Works' | 'Traffic Police' | 'Transit Authority' | 'Stormwater Drainage';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  estimatedRepairCost?: number;
  workOrderId?: string;
  assignedOfficer?: string;
  description: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  category: 'safety' | 'infrastructure' | 'transit-delay' | 'hardware';
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'bus' | 'detection' | 'incident' | 'road';
}

export interface Route {
  id: string;
  name: string;
  start: string;
  end: string;
  distanceKm: number;
  avgDurationMins: number;
  status: 'active' | 'congested' | 'diverted' | 'inactive';
  activeBuses: number;
  healthScore: number; // 0..100
  potholeHotspotsCount: number;
  waterloggingZonesCount: number;
  stopsCount: number;
  color: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  locality: string;
  zone: string;
  pavementQualityIndex: number; // 0..100 (PQI)
  condition: 'excellent' | 'good' | 'watch' | 'attention' | 'critical';
  defectCount: number;
  trafficLoad: 'light' | 'moderate' | 'heavy' | 'gridlock';
  lastInspected: string;
  lengthKm: number;
  coordinates: [number, number][];
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'bus-stop' | 'traffic-light' | 'road-sign' | 'storm-drain' | 'streetlight' | 'bridge';
  location: Location;
  status: 'operational' | 'degraded' | 'damaged' | 'offline';
  healthScore: number;
  lastMaintained: string;
  recentDetections: number;
}

export interface PrototypeConfig {
  toolId: string;
  toolUrl: string;
  mode: 'simulated-stream' | 'live-endpoint' | 'manual-batch';
  endpointUrl: string;
  apiKey?: string;
  autoRefreshIntervalMs: number;
  isConnected: boolean;
  lastHeartbeat?: string;
  inferredFramesCount: number;
  averageInferenceLatencyMs: number;
  modelConfidenceCutoff: number;
}
