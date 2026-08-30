import type { DetectionEvent, Incident, Bus } from '../../types/domain';

export interface PrototypeIngestPayload {
  toolId?: string;
  sourceCamera?: string;
  busId?: string;
  timestamp?: string;
  detections: {
    category: string;
    label: string;
    confidence: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    boundingBox?: { x: number; y: number; width: number; height: number };
    coordinates?: { latitude: number; longitude: number; roadName?: string; city?: string };
    imageUrl?: string;
    notes?: string;
    telemetry?: {
      vehicleSpeedKph?: number;
      ambientTempC?: number;
      rainfallMm?: number;
      gForceZ?: number;
    };
  }[];
}

class ApiClient {
  private baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
  private wsUrl = (import.meta as any).env?.VITE_WS_URL || '';

  async get<T>(path: string): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('No custom REST endpoint configured. Operating in Prototype Bridge Mode.');
    }
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('No custom REST endpoint configured.');
    }
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  createEventStream(path: string): EventSource | null {
    if (!this.baseUrl) return null;
    return new EventSource(`${this.baseUrl}${path}`);
  }

  createSocket(path = ''): WebSocket | null {
    if (!this.wsUrl) return null;
    return new WebSocket(`${this.wsUrl}${path}`);
  }
}

export const apiClient = new ApiClient();
