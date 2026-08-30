import type {
  Alert,
  Bus,
  Camera,
  DetectionEvent,
  Incident,
  InfrastructureAsset,
  RoadSegment,
  Route,
} from '../types/domain';

// High quality SVG and vector visual representations for camera frames and detections
export const sampleFrames = {
  pothole1: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80", // Asphalt road with road defect
  waterlogging1: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80", // Wet / flooded road surface
  traffic1: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80", // Congested urban traffic
  crack1: "https://images.unsplash.com/photo-1584463623578-30129a39151c?auto=format&fit=crop&w=800&q=80", // Cracked road pavement
  debris1: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80", // Urban street
  curb1: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80", // Transit corridor
};

export const initialPrototypeDetections: DetectionEvent[] = [
  {
    id: 'DET-2026-9041',
    type: 'Critical Pothole (Depth > 85mm)',
    category: 'pothole',
    severity: 'critical',
    confidence: 0.96,
    busId: 'BUS-104',
    cameraId: 'CAM-104-FRONT',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    location: {
      latitude: 26.8524,
      longitude: 80.9412,
      roadName: 'Mahatma Gandhi Marg',
      address: 'MG Marg, Near Hazratganj Crossing, Pillar 14',
      city: 'Lucknow Central',
      zone: 'Zone 1 - Downtown'
    },
    frame: {
      id: 'FRM-8821',
      imageUrl: sampleFrames.pothole1,
      capturedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      cameraType: 'front-dash',
      resolution: '1920x1080'
    },
    boundingBoxes: [
      {
        id: 'BOX-1',
        label: 'Severe Pothole Cluster',
        confidence: 0.96,
        x: 42,
        y: 58,
        width: 28,
        height: 22,
        color: '#ef4444'
      },
      {
        id: 'BOX-2',
        label: 'Subsurface Radial Crack',
        confidence: 0.88,
        x: 34,
        y: 52,
        width: 18,
        height: 14,
        color: '#f97316'
      }
    ],
    status: 'new',
    notes: 'Triggered high z-axis vertical accelerometer impact (1.82G). Immediate patch crew needed.',
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: {
      vehicleSpeedKph: 38,
      ambientTempC: 32,
      rainfallMm: 0,
      gForceZ: 1.82
    }
  },
  {
    id: 'DET-2026-9042',
    type: 'Severe Waterlogging / Drainage Overflow',
    category: 'waterlogging',
    severity: 'high',
    confidence: 0.93,
    busId: 'BUS-108',
    cameraId: 'CAM-108-FRONT',
    timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    location: {
      latitude: 26.8392,
      longitude: 80.9255,
      roadName: 'Vikas Nagar Arterial Rd',
      address: 'Sector 4 Junction, Low-lying Underpass',
      city: 'Lucknow North',
      zone: 'Zone 2 - North'
    },
    frame: {
      id: 'FRM-8822',
      imageUrl: sampleFrames.waterlogging1,
      capturedAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
      cameraType: 'front-dash',
      resolution: '1920x1080'
    },
    boundingBoxes: [
      {
        id: 'BOX-3',
        label: 'Standing Water Pool (Depth ~15cm)',
        confidence: 0.93,
        x: 20,
        y: 48,
        width: 60,
        height: 38,
        color: '#38bdf8'
      }
    ],
    status: 'escalated',
    notes: 'Drainage grate blocked by storm silt. Left lane impassable for low-clearance vehicles.',
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: {
      vehicleSpeedKph: 14,
      ambientTempC: 28,
      rainfallMm: 12.4,
      gForceZ: 0.35
    }
  },
  {
    id: 'DET-2026-9043',
    type: 'Traffic Gridlock & Lane Encroachment',
    category: 'traffic-congestion',
    severity: 'high',
    confidence: 0.91,
    busId: 'BUS-102',
    cameraId: 'CAM-102-FRONT',
    timestamp: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    location: {
      latitude: 26.8611,
      longitude: 80.9523,
      roadName: 'Gomti Nagar Main Corridor',
      address: 'Manoj Pandey Chauraha near Flyover Ramp',
      city: 'Gomti Nagar',
      zone: 'Zone 4 - Trans-Gomti'
    },
    frame: {
      id: 'FRM-8823',
      imageUrl: sampleFrames.traffic1,
      capturedAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
      cameraType: 'front-dash',
      resolution: '1920x1080'
    },
    boundingBoxes: [
      {
        id: 'BOX-4',
        label: 'Bus Rapid Transit Lane Blockade',
        confidence: 0.94,
        x: 15,
        y: 35,
        width: 70,
        height: 50,
        color: '#eab308'
      }
    ],
    status: 'reviewing',
    notes: 'Illegal double parking encroaching dedicated public bus corridor.',
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: {
      vehicleSpeedKph: 6,
      ambientTempC: 31,
      rainfallMm: 0,
      gForceZ: 0.12
    }
  },
  {
    id: 'DET-2026-9044',
    type: 'Transverse Asphalt Fatigue Cracking',
    category: 'road-crack',
    severity: 'medium',
    confidence: 0.89,
    busId: 'BUS-115',
    cameraId: 'CAM-115-FRONT',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    location: {
      latitude: 26.8441,
      longitude: 80.9318,
      roadName: 'Charbagh Station Link Road',
      address: 'Opposite Railway Colony Gate 2',
      city: 'Lucknow South',
      zone: 'Zone 3 - Station Hub'
    },
    frame: {
      id: 'FRM-8824',
      imageUrl: sampleFrames.crack1,
      capturedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      cameraType: 'front-dash',
      resolution: '1920x1080'
    },
    boundingBoxes: [
      {
        id: 'BOX-5',
        label: 'Alligator Cracking Net',
        confidence: 0.89,
        x: 30,
        y: 62,
        width: 40,
        height: 25,
        color: '#f59e0b'
      }
    ],
    status: 'verified',
    notes: 'Progressive structural fatigue. Scheduled for resurfacing during Q3 maintenance cycle.',
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: {
      vehicleSpeedKph: 42,
      ambientTempC: 33,
      rainfallMm: 0,
      gForceZ: 0.85
    }
  },
  {
    id: 'DET-2026-9045',
    type: 'Construction Debris & Obstruction',
    category: 'debris-hazard',
    severity: 'medium',
    confidence: 0.87,
    busId: 'BUS-104',
    cameraId: 'CAM-104-CURB',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    location: {
      latitude: 26.8702,
      longitude: 80.9634,
      roadName: 'Faizabad Road Express',
      address: 'Near Polytechnic Chauraha Footbridge',
      city: 'Indira Nagar',
      zone: 'Zone 5 - East Corridor'
    },
    frame: {
      id: 'FRM-8825',
      imageUrl: sampleFrames.debris1,
      capturedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      cameraType: 'curb-side',
      resolution: '1920x1080'
    },
    boundingBoxes: [
      {
        id: 'BOX-6',
        label: 'Gravel & Sand Spill Hazard',
        confidence: 0.87,
        x: 55,
        y: 60,
        width: 32,
        height: 24,
        color: '#f97316'
      }
    ],
    status: 'new',
    notes: 'Uncovered aggregate pile on shoulder narrowing roadway.',
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: {
      vehicleSpeedKph: 45,
      ambientTempC: 34,
      rainfallMm: 0,
      gForceZ: 0.44
    }
  },
  {
    id: 'DET-2026-9046',
    type: 'Missing Speed Limit & Warning Sign',
    category: 'missing-signage',
    severity: 'low',
    confidence: 0.84,
    busId: 'BUS-110',
    cameraId: 'CAM-110-FRONT',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    location: {
      latitude: 26.8285,
      longitude: 80.9122,
      roadName: 'Kanpur Road Bypass',
      address: 'Near Alambagh Bus Terminal Junction',
      city: 'Alambagh',
      zone: 'Zone 3 - Station Hub'
    },
    frame: {
      id: 'FRM-8826',
      imageUrl: sampleFrames.curb1,
      capturedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      cameraType: 'front-dash',
      resolution: '1920x1080'
    },
    boundingBoxes: [
      {
        id: 'BOX-7',
        label: 'Bent / Missing Sign Post',
        confidence: 0.84,
        x: 78,
        y: 30,
        width: 14,
        height: 35,
        color: '#94a3b8'
      }
    ],
    status: 'verified',
    notes: 'Sign pole damaged after nocturnal collision. Speed limit sign unreadable.',
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: {
      vehicleSpeedKph: 52,
      ambientTempC: 30,
      rainfallMm: 0,
      gForceZ: 0.2
    }
  }
];

export const mockBuses: Bus[] = [
  {
    id: 'BUS-101',
    registration: 'UP-32-BZ-9102',
    routeId: 'RT-10',
    routeName: 'Route 10: Charbagh Central ⇄ Gomti Nagar IT Hub',
    driverName: 'Rajesh Kumar',
    status: 'active',
    location: {
      latitude: 26.8510,
      longitude: 80.9450,
      address: 'MG Marg, Near Capital Cinema',
      city: 'Lucknow Central',
      zone: 'Zone 1'
    },
    passengerCount: 38,
    capacity: 55,
    speedKph: 34,
    batteryOrFuelPercent: 82,
    lastUpdated: new Date(Date.now() - 15 * 1000).toISOString(),
    camerasCount: 4,
    activeDetectionsCount: 1,
    streamQuality: '1080p'
  },
  {
    id: 'BUS-102',
    registration: 'UP-32-CZ-4419',
    routeId: 'RT-10',
    routeName: 'Route 10: Charbagh Central ⇄ Gomti Nagar IT Hub',
    driverName: 'Amit Singh',
    status: 'delayed',
    location: {
      latitude: 26.8611,
      longitude: 80.9523,
      address: 'Manoj Pandey Chauraha',
      city: 'Gomti Nagar',
      zone: 'Zone 4'
    },
    passengerCount: 52,
    capacity: 55,
    speedKph: 6,
    batteryOrFuelPercent: 68,
    lastUpdated: new Date(Date.now() - 25 * 1000).toISOString(),
    camerasCount: 4,
    activeDetectionsCount: 3,
    streamQuality: '1080p'
  },
  {
    id: 'BUS-104',
    registration: 'UP-32-EV-7801',
    routeId: 'RT-22',
    routeName: 'Route 22: Alambagh Express ⇄ Polytechnic Junction',
    driverName: 'Vikram Verma',
    status: 'active',
    location: {
      latitude: 26.8524,
      longitude: 80.9412,
      address: 'Hazratganj Multi-Level Corridor',
      city: 'Lucknow Central',
      zone: 'Zone 1'
    },
    passengerCount: 29,
    capacity: 60,
    speedKph: 41,
    batteryOrFuelPercent: 74,
    lastUpdated: new Date(Date.now() - 8 * 1000).toISOString(),
    camerasCount: 4,
    activeDetectionsCount: 2,
    streamQuality: '1080p'
  },
  {
    id: 'BUS-108',
    registration: 'UP-32-FT-2290',
    routeId: 'RT-35',
    routeName: 'Route 35: Vikas Nagar Loop ⇄ PGI Medical Hub',
    driverName: 'Manoj Tiwari',
    status: 'active',
    location: {
      latitude: 26.8392,
      longitude: 80.9255,
      address: 'Sector 4 Arterial Link',
      city: 'Lucknow North',
      zone: 'Zone 2'
    },
    passengerCount: 44,
    capacity: 55,
    speedKph: 18,
    batteryOrFuelPercent: 55,
    lastUpdated: new Date(Date.now() - 30 * 1000).toISOString(),
    camerasCount: 3,
    activeDetectionsCount: 1,
    streamQuality: '720p'
  },
  {
    id: 'BUS-110',
    registration: 'UP-32-GV-3305',
    routeId: 'RT-14',
    routeName: 'Route 14: Airport Shuttle ⇄ Munshipulia Ring Rd',
    driverName: 'Sanjay Rawat',
    status: 'active',
    location: {
      latitude: 26.8285,
      longitude: 80.9122,
      address: 'Kanpur Bypass South Ramp',
      city: 'Alambagh',
      zone: 'Zone 3'
    },
    passengerCount: 21,
    capacity: 45,
    speedKph: 54,
    batteryOrFuelPercent: 91,
    lastUpdated: new Date(Date.now() - 40 * 1000).toISOString(),
    camerasCount: 4,
    activeDetectionsCount: 1,
    streamQuality: '1080p'
  },
  {
    id: 'BUS-115',
    registration: 'UP-32-HK-8114',
    routeId: 'RT-08',
    routeName: 'Route 08: Old City Heritage Line ⇄ Telibagh',
    driverName: 'Dinesh Yadav',
    status: 'active',
    location: {
      latitude: 26.8441,
      longitude: 80.9318,
      address: 'Railway Colony Approach',
      city: 'Lucknow South',
      zone: 'Zone 3'
    },
    passengerCount: 35,
    capacity: 55,
    speedKph: 28,
    batteryOrFuelPercent: 63,
    lastUpdated: new Date(Date.now() - 18 * 1000).toISOString(),
    camerasCount: 4,
    activeDetectionsCount: 1,
    streamQuality: '1080p'
  },
  {
    id: 'BUS-120',
    registration: 'UP-32-JA-5022',
    routeId: 'RT-22',
    routeName: 'Route 22: Alambagh Express ⇄ Polytechnic Junction',
    driverName: 'Gurpreet Singh',
    status: 'idle',
    location: {
      latitude: 26.8750,
      longitude: 80.9700,
      address: 'Polytechnic Depot Bay 3',
      city: 'Indira Nagar',
      zone: 'Zone 5'
    },
    passengerCount: 0,
    capacity: 60,
    speedKph: 0,
    batteryOrFuelPercent: 98,
    lastUpdated: new Date(Date.now() - 120 * 1000).toISOString(),
    camerasCount: 4,
    activeDetectionsCount: 0,
    streamQuality: '1080p'
  }
];

export const mockCameras: Camera[] = [
  {
    id: 'CAM-104-FRONT',
    busId: 'BUS-104',
    label: 'Front Optical Wide-Angle (AI Flow Ingest)',
    mountType: 'front',
    status: 'online',
    fps: 30,
    resolution: '1080p @ 30fps',
    location: { latitude: 26.8524, longitude: 80.9412, city: 'Lucknow Central' },
    lastFrameUrl: sampleFrames.pothole1,
    detectionsCount24h: 18
  },
  {
    id: 'CAM-104-CURB',
    busId: 'BUS-104',
    label: 'Curb & Pedestrian Asset Camera',
    mountType: 'door-side',
    status: 'online',
    fps: 30,
    resolution: '1080p @ 30fps',
    location: { latitude: 26.8524, longitude: 80.9412, city: 'Lucknow Central' },
    lastFrameUrl: sampleFrames.debris1,
    detectionsCount24h: 7
  },
  {
    id: 'CAM-108-FRONT',
    busId: 'BUS-108',
    label: 'Front Dash Pavement Camera',
    mountType: 'front',
    status: 'online',
    fps: 25,
    resolution: '720p @ 25fps',
    location: { latitude: 26.8392, longitude: 80.9255, city: 'Lucknow North' },
    lastFrameUrl: sampleFrames.waterlogging1,
    detectionsCount24h: 14
  },
  {
    id: 'CAM-102-FRONT',
    busId: 'BUS-102',
    label: 'Corridor Traffic & Lane Vision',
    mountType: 'front',
    status: 'online',
    fps: 30,
    resolution: '1080p @ 30fps',
    location: { latitude: 26.8611, longitude: 80.9523, city: 'Gomti Nagar' },
    lastFrameUrl: sampleFrames.traffic1,
    detectionsCount24h: 22
  },
  {
    id: 'CAM-FIX-HZ01',
    label: 'Hazratganj Smart Junction High Mast Fixed CCTV',
    mountType: 'pole-mounted',
    status: 'online',
    fps: 30,
    resolution: '4K @ 30fps',
    location: { latitude: 26.8530, longitude: 80.9420, city: 'Lucknow Central' },
    detectionsCount24h: 49
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-081',
    title: 'Severe Road Crater - Hazratganj Multi-Lane Hazard',
    category: 'pothole',
    severity: 'critical',
    status: 'new',
    location: {
      latitude: 26.8524,
      longitude: 80.9412,
      roadName: 'Mahatma Gandhi Marg',
      address: 'MG Marg, Near Hazratganj Crossing, Pillar 14',
      city: 'Lucknow Central',
      zone: 'Zone 1'
    },
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    detectionId: 'DET-2026-9041',
    assignedDepartment: 'Public Works',
    priority: 'P1',
    estimatedRepairCost: 45000,
    description: 'Autonomous AI detection confirmed depth > 85mm. Rapid cold-mix patching crew required to prevent tyre blowouts.'
  },
  {
    id: 'INC-2026-080',
    title: 'Underpass Submerged - Vikas Nagar Arterial Road',
    category: 'waterlogging',
    severity: 'high',
    status: 'acknowledged',
    location: {
      latitude: 26.8392,
      longitude: 80.9255,
      roadName: 'Vikas Nagar Arterial Rd',
      address: 'Sector 4 Junction Underpass',
      city: 'Lucknow North',
      zone: 'Zone 2'
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    detectionId: 'DET-2026-9042',
    assignedDepartment: 'Stormwater Drainage',
    priority: 'P2',
    workOrderId: 'WO-DRAIN-411',
    assignedOfficer: 'Er. R. K. Sharma',
    estimatedRepairCost: 28000,
    description: 'High volume silt blockage in culvert inlet. Mobile de-watering pump dispatched.'
  },
  {
    id: 'INC-2026-079',
    title: 'Dedicated BRT Corridor Encroachment & Illegal Parking',
    category: 'traffic-congestion',
    severity: 'high',
    status: 'in-progress',
    location: {
      latitude: 26.8611,
      longitude: 80.9523,
      roadName: 'Gomti Nagar Main Corridor',
      address: 'Manoj Pandey Chauraha',
      city: 'Gomti Nagar',
      zone: 'Zone 4'
    },
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    detectionId: 'DET-2026-9043',
    assignedDepartment: 'Traffic Police',
    priority: 'P2',
    workOrderId: 'TP-DISPATCH-98',
    assignedOfficer: 'Insp. V. K. Yadav',
    description: 'Towing cranes dispatched to clear commercial delivery trucks blocking scheduled transit flow.'
  },
  {
    id: 'INC-2026-077',
    title: 'Structural Road Base Cracking & Rutting',
    category: 'road-crack',
    severity: 'medium',
    status: 'in-progress',
    location: {
      latitude: 26.8441,
      longitude: 80.9318,
      roadName: 'Charbagh Station Link Road',
      address: 'Railway Colony Approach',
      city: 'Lucknow South',
      zone: 'Zone 3'
    },
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    detectionId: 'DET-2026-9044',
    assignedDepartment: 'Public Works',
    priority: 'P3',
    workOrderId: 'WO-ASPH-529',
    assignedOfficer: 'Asst. Eng. P. Gupta',
    estimatedRepairCost: 95000,
    description: 'Micro-surfacing seal and joint crack pour scheduled for midnight shift.'
  },
  {
    id: 'INC-2026-072',
    title: 'Damaged Overhead Directional & Speed Signage',
    category: 'missing-signage',
    severity: 'low',
    status: 'resolved',
    location: {
      latitude: 26.8285,
      longitude: 80.9122,
      roadName: 'Kanpur Road Bypass',
      address: 'Alambagh Terminal Ramp',
      city: 'Alambagh',
      zone: 'Zone 3'
    },
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    detectionId: 'DET-2026-9046',
    assignedDepartment: 'Public Works',
    priority: 'P4',
    workOrderId: 'WO-SIGN-102',
    description: 'Replaced retro-reflective 50km/h cautionary sign board and re-anchored vertical post.'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-1001',
    title: 'Critical Road Defect Detected by Flow AI',
    message: 'Google Flow Vision Pipeline #2bb18e92 detected high-risk pothole (>85mm) on MG Marg. Impact 1.82G recorded.',
    severity: 'critical',
    category: 'infrastructure',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: true,
    relatedEntityId: 'DET-2026-9041',
    relatedEntityType: 'detection'
  },
  {
    id: 'ALT-1002',
    title: 'Route 10 Transit Delay Spike (>18 mins)',
    message: 'Bus 102 reporting acute congestion due to commercial lane blockage at Manoj Pandey Chauraha.',
    severity: 'high',
    category: 'transit-delay',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: true,
    relatedEntityId: 'BUS-102',
    relatedEntityType: 'bus'
  },
  {
    id: 'ALT-1003',
    title: 'Waterlogging Inundation Alert',
    message: 'Standing flood pool detected on Vikas Nagar Sector 4 underpass. Drainage maintenance notified.',
    severity: 'high',
    category: 'safety',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false,
    relatedEntityId: 'INC-2026-080',
    relatedEntityType: 'incident'
  },
  {
    id: 'ALT-1004',
    title: 'Prototype AI Stream Heartbeat Verified',
    message: 'Google Labs Flow Tool #2bb18e92 connected. Ingesting live 30fps inference frames at 38ms latency.',
    severity: 'low',
    category: 'hardware',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false
  }
];

export const mockRoutes: Route[] = [
  {
    id: 'RT-10',
    name: 'Charbagh Central ⇄ Gomti Nagar IT Hub',
    start: 'Charbagh Central Railway Station',
    end: 'Gomti Nagar IT City',
    distanceKm: 14.8,
    avgDurationMins: 42,
    status: 'congested',
    activeBuses: 8,
    healthScore: 68,
    potholeHotspotsCount: 5,
    waterloggingZonesCount: 2,
    stopsCount: 22,
    color: '#38bdf8'
  },
  {
    id: 'RT-22',
    name: 'Alambagh Express ⇄ Polytechnic Junction',
    start: 'Alambagh Inter-State Terminal',
    end: 'Polytechnic Circle (Indira Nagar)',
    distanceKm: 18.2,
    avgDurationMins: 48,
    status: 'active',
    activeBuses: 12,
    healthScore: 84,
    potholeHotspotsCount: 3,
    waterloggingZonesCount: 0,
    stopsCount: 26,
    color: '#34d399'
  },
  {
    id: 'RT-35',
    name: 'Vikas Nagar Loop ⇄ PGI Medical Hub',
    start: 'Vikas Nagar Sector 4',
    end: 'Sanjay Gandhi PGI Campus',
    distanceKm: 22.4,
    avgDurationMins: 60,
    status: 'active',
    activeBuses: 6,
    healthScore: 72,
    potholeHotspotsCount: 6,
    waterloggingZonesCount: 3,
    stopsCount: 31,
    color: '#a855f7'
  },
  {
    id: 'RT-14',
    name: 'Airport Shuttle ⇄ Munshipulia Ring Rd',
    start: 'CCS International Airport',
    end: 'Munshipulia Metro Depot',
    distanceKm: 26.5,
    avgDurationMins: 55,
    status: 'active',
    activeBuses: 10,
    healthScore: 91,
    potholeHotspotsCount: 1,
    waterloggingZonesCount: 0,
    stopsCount: 18,
    color: '#f59e0b'
  },
  {
    id: 'RT-08',
    name: 'Old City Heritage Line ⇄ Telibagh',
    start: 'Bara Imambara Heritage Quarter',
    end: 'Telibagh Southern Terminal',
    distanceKm: 16.0,
    avgDurationMins: 52,
    status: 'active',
    activeBuses: 7,
    healthScore: 61,
    potholeHotspotsCount: 9,
    waterloggingZonesCount: 4,
    stopsCount: 28,
    color: '#ec4899'
  }
];

export const mockRoadSegments: RoadSegment[] = [
  {
    id: 'ROAD-MG-01',
    name: 'Mahatma Gandhi Marg (Hazratganj Stretch)',
    locality: 'Hazratganj Commercial Zone',
    zone: 'Zone 1 - Downtown',
    pavementQualityIndex: 62,
    condition: 'watch',
    defectCount: 8,
    trafficLoad: 'heavy',
    lastInspected: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    lengthKm: 3.4,
    coordinates: [[26.8524, 80.9412], [26.8540, 80.9440], [26.8560, 80.9480]]
  },
  {
    id: 'ROAD-GM-02',
    name: 'Gomti Nagar Riverside Arterial',
    locality: 'Vipin Khand / Manoj Pandey',
    zone: 'Zone 4 - Trans-Gomti',
    pavementQualityIndex: 88,
    condition: 'excellent',
    defectCount: 2,
    trafficLoad: 'moderate',
    lastInspected: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    lengthKm: 5.8,
    coordinates: [[26.8611, 80.9523], [26.8650, 80.9570], [26.8700, 80.9630]]
  },
  {
    id: 'ROAD-VN-03',
    name: 'Vikas Nagar Low-Lying Underpass Connector',
    locality: 'Vikas Nagar Sector 4',
    zone: 'Zone 2 - North',
    pavementQualityIndex: 48,
    condition: 'critical',
    defectCount: 14,
    trafficLoad: 'heavy',
    lastInspected: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    lengthKm: 2.1,
    coordinates: [[26.8392, 80.9255], [26.8420, 80.9280]]
  },
  {
    id: 'ROAD-CB-04',
    name: 'Charbagh Station Approach & Link Road',
    locality: 'Railway Station Hub',
    zone: 'Zone 3 - Station Hub',
    pavementQualityIndex: 55,
    condition: 'attention',
    defectCount: 11,
    trafficLoad: 'gridlock',
    lastInspected: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    lengthKm: 1.9,
    coordinates: [[26.8441, 80.9318], [26.8470, 80.9350]]
  },
  {
    id: 'ROAD-FZ-05',
    name: 'Faizabad Express Corridor',
    locality: 'Polytechnic to Indira Nagar',
    zone: 'Zone 5 - East Corridor',
    pavementQualityIndex: 94,
    condition: 'excellent',
    defectCount: 1,
    trafficLoad: 'light',
    lastInspected: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    lengthKm: 7.2,
    coordinates: [[26.8702, 80.9634], [26.8780, 80.9740]]
  }
];

export const mockInfrastructure: InfrastructureAsset[] = [
  {
    id: 'INF-STP-101',
    name: 'Hazratganj Metro Smart Transit Shelter',
    type: 'bus-stop',
    location: { latitude: 26.8528, longitude: 80.9416, city: 'Lucknow Central' },
    status: 'operational',
    healthScore: 92,
    lastMaintained: '2026-07-15',
    recentDetections: 0
  },
  {
    id: 'INF-SIG-204',
    name: 'Manoj Pandey Chauraha Adaptive Traffic Light',
    type: 'traffic-light',
    location: { latitude: 26.8615, longitude: 80.9528, city: 'Gomti Nagar' },
    status: 'operational',
    healthScore: 88,
    lastMaintained: '2026-08-02',
    recentDetections: 1
  },
  {
    id: 'INF-DRN-309',
    name: 'Vikas Nagar Culvert Silt Grate #4',
    type: 'storm-drain',
    location: { latitude: 26.8390, longitude: 80.9252, city: 'Lucknow North' },
    status: 'damaged',
    healthScore: 35,
    lastMaintained: '2026-06-10',
    recentDetections: 4
  },
  {
    id: 'INF-SGN-412',
    name: 'Alambagh Bypass Overhead Velocity Indicator',
    type: 'road-sign',
    location: { latitude: 26.8288, longitude: 80.9125, city: 'Alambagh' },
    status: 'degraded',
    healthScore: 58,
    lastMaintained: '2026-05-20',
    recentDetections: 2
  },
  {
    id: 'INF-BRG-501',
    name: 'Gomti Barrage Bridge Pavement Expansion Joint',
    type: 'bridge',
    location: { latitude: 26.8580, longitude: 80.9500, city: 'Trans-Gomti' },
    status: 'operational',
    healthScore: 81,
    lastMaintained: '2026-07-28',
    recentDetections: 1
  }
];
