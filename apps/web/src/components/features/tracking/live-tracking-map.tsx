'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Navigation, MapPin } from 'lucide-react';
import { useRealTimeTracking } from '@/lib/socket/hooks';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGoogleMaps?: () => void;
  }
}

interface LiveTrackingMapProps {
  jobId: string;
  jobLatitude: number;
  jobLongitude: number;
  jobAddress: string;
}

export function LiveTrackingMap({ jobId, jobLatitude, jobLongitude, jobAddress }: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tradieMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobMarkerRef = useRef<any>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const { location, etaMinutes } = useRealTimeTracking(jobId);

  // Load Google Maps
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!key) { setMapsError(true); return; }

    if (window.google?.maps) { setMapsReady(true); return; }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry`;
    script.async = true;
    script.onload = () => setMapsReady(true);
    script.onerror = () => setMapsError(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapsReady || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: jobLatitude, lng: jobLongitude },
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    });
    mapInstanceRef.current = map;

    // Job location marker (destination pin)
    jobMarkerRef.current = new window.google.maps.Marker({
      position: { lat: jobLatitude, lng: jobLongitude },
      map,
      title: jobAddress,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#2563EB',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });
  }, [mapsReady, jobLatitude, jobLongitude, jobAddress]);

  // Update tradie marker when location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !location) return;

    const pos = { lat: location.lat, lng: location.lng };

    if (tradieMarkerRef.current) {
      tradieMarkerRef.current.setPosition(pos);
    } else {
      tradieMarkerRef.current = new window.google.maps.Marker({
        position: pos,
        map: mapInstanceRef.current,
        title: 'Tradie',
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#16A34A',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
          rotation: location.heading ?? 0,
        },
      });
    }

    // Fit bounds to show both markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pos);
    bounds.extend({ lat: jobLatitude, lng: jobLongitude });
    mapInstanceRef.current.fitBounds(bounds, 80);
  }, [location, jobLatitude, jobLongitude]);

  if (mapsError) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-gray-100 p-8 text-center">
        <MapPin size={40} className="text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-500">Map unavailable</p>
        <p className="text-xs text-gray-400">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border">
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Loading overlay */}
      {!mapsReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* ETA badge */}
      {etaMinutes !== null && (
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-lg">
          <Navigation size={16} className="text-green-500" />
          <div>
            <p className="text-xs text-gray-400">ETA</p>
            <p className="text-sm font-bold text-gray-900">{etaMinutes} min</p>
          </div>
        </div>
      )}

      {/* No live tracking yet */}
      {!location && mapsReady && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs text-gray-500 shadow">
          Live tracking will appear when tradie is en route
        </div>
      )}
    </div>
  );
}
