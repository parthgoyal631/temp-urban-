import type { DetectionEvent, DefectCategory, Severity, BoundingBox } from '../../types/domain';

export function adaptFlowDetection(raw: any, defaultBusId = 'BUS-104'): DetectionEvent {
  const categoryMap: Record<string, DefectCategory> = {
    pothole: 'pothole',
    crater: 'pothole',
    crack: 'road-crack',
    cracking: 'road-crack',
    water: 'waterlogging',
    flood: 'waterlogging',
    waterlogging: 'waterlogging',
    traffic: 'traffic-congestion',
    congestion: 'traffic-congestion',
    debris: 'debris-hazard',
    hazard: 'debris-hazard',
    signage: 'missing-signage',
    sign: 'missing-signage',
    encroachment: 'pedestrian-encroachment',
    drain: 'drainage-clog',
  };

  const rawType = (raw.label || raw.type || raw.category || 'Road Anomaly').toString();
  const normalizedKey = rawType.toLowerCase();
  
  let category: DefectCategory = 'pothole';
  for (const [key, val] of Object.entries(categoryMap)) {
    if (normalizedKey.includes(key)) {
      category = val;
      break;
    }
  }

  const confidence = typeof raw.confidence === 'number' ? raw.confidence : (parseFloat(raw.confidence) || 0.85);

  let severity: Severity = raw.severity || (confidence > 0.9 ? 'critical' : confidence > 0.75 ? 'high' : 'medium');
  if (category === 'waterlogging' && confidence > 0.85) severity = 'high';
  if (category === 'missing-signage' && severity === 'critical') severity = 'medium';

  const boundingBoxes: BoundingBox[] = [];
  if (raw.boundingBox) {
    boundingBoxes.push({
      id: `box-${Date.now()}`,
      label: rawType,
      confidence,
      x: raw.boundingBox.x ?? 30,
      y: raw.boundingBox.y ?? 40,
      width: raw.boundingBox.width ?? 40,
      height: raw.boundingBox.height ?? 30,
      color: severity === 'critical' ? '#ef4444' : severity === 'high' ? '#f97316' : '#eab308'
    });
  } else if (Array.isArray(raw.boundingBoxes)) {
    boundingBoxes.push(...raw.boundingBoxes);
  }

  return {
    id: raw.id || `DET-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
    type: raw.type || raw.label || `${category.toUpperCase().replace('-', ' ')} Detected`,
    category,
    severity,
    confidence: Number(confidence.toFixed(2)),
    busId: raw.busId || defaultBusId,
    cameraId: raw.cameraId || `CAM-${raw.busId || defaultBusId}-FRONT`,
    timestamp: raw.timestamp || new Date().toISOString(),
    location: {
      latitude: raw.location?.latitude ?? raw.coordinates?.latitude ?? (26.84 + Math.random() * 0.04),
      longitude: raw.location?.longitude ?? raw.coordinates?.longitude ?? (80.92 + Math.random() * 0.05),
      roadName: raw.location?.roadName ?? raw.roadName ?? 'Monitored Transit Corridor',
      address: raw.location?.address ?? raw.address ?? 'Live Prototype Ingest Point',
      city: raw.location?.city ?? raw.city ?? 'Lucknow Central',
      zone: raw.location?.zone ?? raw.zone ?? 'Zone 1'
    },
    frame: {
      id: raw.frame?.id || `FRM-${Date.now()}`,
      imageUrl: raw.frame?.imageUrl || raw.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      capturedAt: raw.timestamp || new Date().toISOString(),
      cameraType: raw.frame?.cameraType || 'front-dash',
      resolution: raw.frame?.resolution || '1920x1080'
    },
    boundingBoxes,
    status: raw.status || 'new',
    notes: raw.notes || `Inferred by Google Flow Tool #2bb18e92 with ${(confidence * 100).toFixed(1)}% confidence.`,
    flowToolId: '2bb18e92-ad04-4a87-9400-578ffc26e64b',
    telemetry: raw.telemetry || {
      vehicleSpeedKph: Math.floor(25 + Math.random() * 25),
      ambientTempC: 31,
      rainfallMm: category === 'waterlogging' ? 14 : 0,
      gForceZ: category === 'pothole' ? 1.45 : 0.2
    }
  };
}
