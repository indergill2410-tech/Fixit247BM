'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, ToggleLeft, ToggleRight, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { toast } from 'sonner';
import { useLocationBroadcast } from '@/lib/socket/hooks';

interface TradieNavigationPanelProps {
  jobId: string;
  jobAddress: string;
  jobLatitude?: number | null;
  jobLongitude?: number | null;
  etaMinutes?: number | null;
}

export function TradieNavigationPanel({ jobId, jobAddress, jobLatitude, jobLongitude, etaMinutes }: TradieNavigationPanelProps) {
  const [sharingLocation, setSharingLocation] = useState(false);
  const [settingEta, setSettingEta] = useState(false);

  useLocationBroadcast(jobId, sharingLocation);

  function toggleSharing() {
    setSharingLocation((v) => !v);
    toast.success(sharingLocation ? 'Location sharing stopped' : 'Sharing live location with customer');
  }

  async function setEnRoute() {
    setSettingEta(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'EN_ROUTE', etaMinutes: etaMinutes ?? 15 }),
      });
      if (!res.ok) throw new Error();
      toast.success('Customer notified — you\'re on the way!');
      setSharingLocation(true);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSettingEta(false);
    }
  }

  const mapsUrl = jobLatitude && jobLongitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${jobLatitude},${jobLongitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jobAddress)}`;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Navigation size={18} className="text-brand-600" />
        <h3 className="font-semibold text-gray-900">Navigation</h3>
      </div>

      {/* Job address */}
      <div className="mb-4 flex items-start gap-3 rounded-xl bg-gray-50 p-3">
        <MapPin size={16} className="mt-0.5 shrink-0 text-red-500" />
        <div>
          <p className="text-xs text-gray-400">Job address</p>
          <p className="text-sm font-medium text-gray-900">{jobAddress}</p>
          {etaMinutes != null && <p className="mt-0.5 text-xs text-green-600">~{etaMinutes} min from current location</p>}
        </div>
      </div>

      {/* Open in Google Maps */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
      >
        <ExternalLink size={14} />
        Open in Google Maps
      </a>

      {/* Notify en route + start sharing */}
      <Button
        className="mb-3 w-full gap-2"
        onClick={setEnRoute}
        disabled={settingEta}
      >
        {settingEta ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
        I'm On My Way
      </Button>

      {/* Location sharing toggle */}
      <button
        onClick={toggleSharing}
        className="flex w-full items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${sharingLocation ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium text-gray-700">
            {sharingLocation ? 'Sharing live location' : 'Live location sharing off'}
          </span>
        </div>
        {sharingLocation
          ? <ToggleRight size={22} className="text-green-500" />
          : <ToggleLeft size={22} className="text-gray-300" />
        }
      </button>

      {sharingLocation && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 text-center text-xs text-gray-400"
        >
          Customer can see your location in real time
        </motion.p>
      )}
    </div>
  );
}
