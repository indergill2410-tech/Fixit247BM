'use client';

import * as React from 'react';
import { useSocketEvent } from './use-socket';

export interface JobStatusUpdate {
  jobId: string;
  status: string;
  tradie?: Record<string, unknown>;
  etaMinutes?: number;
  timestamp: Date;
}

export function useRealTimeJob(jobId: string) {
  const [latestUpdate, setLatestUpdate] = React.useState<JobStatusUpdate | null>(null);
  const [etaMinutes, setEtaMinutes] = React.useState<number | null>(null);

  useSocketEvent('job:status_changed', React.useCallback((payload) => {
    if (payload.jobId !== jobId) return;
    setLatestUpdate({
      jobId: payload.jobId,
      status: payload.status,
      tradie: payload.tradie,
      timestamp: new Date(),
    });
  }, [jobId]));

  useSocketEvent('job:tradie_en_route', React.useCallback((payload) => {
    if (payload.jobId !== jobId) return;
    setEtaMinutes(payload.etaMinutes);
    setLatestUpdate({ jobId, status: 'EN_ROUTE', etaMinutes: payload.etaMinutes, timestamp: new Date() });
  }, [jobId]));

  useSocketEvent('job:tradie_arrived', React.useCallback((payload) => {
    if (payload.jobId !== jobId) return;
    setEtaMinutes(0);
    setLatestUpdate({ jobId, status: 'ARRIVED', timestamp: new Date() });
  }, [jobId]));

  return { latestUpdate, etaMinutes };
}
