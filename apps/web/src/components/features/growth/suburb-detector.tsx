'use client';

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface SuburbInfo {
  suburb: string;
  state: string;
  postcode?: string;
}

interface Props {
  onDetected?: (suburb: SuburbInfo) => void;
  className?: string;
}

export function SuburbDetector({ onDetected, className }: Props) {
  const [suburb, setSuburb] = useState<SuburbInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function detectSuburb() {
    setLoading(true);
    setError(false);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        { navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 }); }
      );

      const { latitude, longitude } = position.coords;
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

      if (!apiKey) {
        // Fallback: just show coordinates
        setSuburb({ suburb: 'Your Location', state: 'AU' });
        return;
      }

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&result_type=sublocality|locality`
      );
      const data = await res.json();

      if (data.results?.[0]) {
        const components = data.results[0].address_components;
        const suburbComp = components.find((c: { types: string[]; long_name: string }) => c.types.includes('sublocality_level_1') || c.types.includes('locality'));
        const stateComp = components.find((c: { types: string[]; short_name: string }) => c.types.includes('administrative_area_level_1'));
        const postcodeComp = components.find((c: { types: string[]; long_name: string }) => c.types.includes('postal_code'));

        const detected = {
          suburb: suburbComp?.long_name ?? 'Your area',
          state: stateComp?.short_name ?? 'AU',
          postcode: postcodeComp?.long_name,
        };
        setSuburb(detected);
        onDetected?.(detected);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      {suburb ? (
        <div className="flex items-center gap-1.5 text-sm text-green-700">
          <MapPin size={14} className="text-green-500" />
          <span>Showing tradies near <strong>{suburb.suburb}</strong></span>
        </div>
      ) : (
        <button
          onClick={detectSuburb}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 transition-colors"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Detecting location&hellip;</>
            : <><MapPin size={14} /> Use my location</>
          }
        </button>
      )}
      {error && <p className="text-xs text-red-500 mt-1">Couldn&apos;t detect location. Enter your suburb manually.</p>}
    </div>
  );
}
