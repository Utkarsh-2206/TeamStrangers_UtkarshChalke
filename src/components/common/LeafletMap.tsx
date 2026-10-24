import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { WorkerProfile } from '../../types';
import { MapPin, AlertCircle, Navigation } from 'lucide-react';

interface LeafletMapProps {
  workers: WorkerProfile[];
  selectedWorkerId?: string;
  onSelectWorker?: (worker: WorkerProfile) => void;
  center?: [number, number];
  zoom?: number;
  userLocation?: [number, number];
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  workers,
  selectedWorkerId,
  onSelectWorker,
  center = [12.9716, 77.5946], // Default Bengaluru center
  zoom = 12,
  userLocation,
  height = '420px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [hasMapError, setHasMapError] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        // Initialize Leaflet map
        const map = L.map(mapContainerRef.current, {
          center,
          zoom,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        // OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
      }
    } catch (err) {
      console.error('Failed to initialize Leaflet Map:', err);
      setHasMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when workers or selectedWorkerId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // User location marker if available
    if (userLocation && userLocation[0] && userLocation[1]) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="background-color: #0D9488; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px rgba(13, 148, 136, 0.25); color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m12 8 4 4-4 4M8 12h8"/></svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(userLocation, { icon: userIcon })
        .bindPopup(`<strong>Your Location</strong><br/><span style="font-size:12px;color:#64748b;">Services will be matched around here</span>`)
        .addTo(markersLayer);
    }

    // Worker markers
    workers.forEach((worker) => {
      if (!worker.latitude || !worker.longitude) return;

      const isSelected = worker.id === selectedWorkerId;
      const isVerified = worker.verification_status === 'verified';

      const workerIcon = L.divIcon({
        className: 'custom-worker-marker',
        html: `
          <div style="
            background: ${isSelected ? '#0F172A' : '#0D9488'};
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            border: 2px solid #ffffff;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <span>₹${worker.starting_rate}</span>
            ${isVerified ? '<span style="color:#6EE7B7;">✓</span>' : ''}
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 15],
      });

      const marker = L.marker([worker.latitude, worker.longitude], { icon: workerIcon }).addTo(markersLayer);

      const popupContent = `
        <div style="padding: 4px; min-width: 170px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${worker.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100'}" 
                 style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover;" alt="${worker.full_name}" />
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${worker.full_name}</div>
              <div style="font-size: 11px; color: #64748b;">${worker.locality} • ${worker.skills[0]?.name || 'Service'}</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9;">
            <span style="font-weight: 700; color: #0d9488;">₹${worker.starting_rate} starting</span>
            <span style="color: #f59e0b; font-weight: 600;">★ ${worker.rating ? worker.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectWorker) {
          onSelectWorker(worker);
        }
      });
    });
  }, [workers, selectedWorkerId, userLocation, onSelectWorker]);

  if (hasMapError) {
    return (
      <div
        style={{ height }}
        className="w-full bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-600"
      >
        <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
        <h4 className="font-semibold text-slate-800 text-sm">Interactive Map Fallback Mode</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Map tiles could not be fetched from the tile server. All worker locations and approximate distances continue to work accurately in the list below.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
        <Navigation className="w-3.5 h-3.5 text-teal-600" />
        <span>Approx. locality radius shown</span>
      </div>
    </div>
  );
};
