import { ImageResponse } from 'next/og';
import { db } from '@fixit247/database';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TRADE_MAP: Record<string, string> = {
  PLUMBING: 'Plumber', ELECTRICAL: 'Electrician', HVAC: 'HVAC Technician',
  CARPENTRY: 'Carpenter', PAINTING: 'Painter', ROOFING: 'Roofer',
  TILING: 'Tiler', PEST_CONTROL: 'Pest Controller', LOCKSMITH: 'Locksmith',
  GLAZING: 'Glazier', PLASTERING: 'Plasterer', LANDSCAPING: 'Landscaper',
  CLEANING: 'Cleaner', APPLIANCE_REPAIR: 'Appliance Technician',
  GENERAL_MAINTENANCE: 'Handyman',
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tradie = await db.tradieProfile.findUnique({
    where: { id },
    include: { user: { select: { firstName: true, lastName: true } } },
  }).catch(() => null);

  const name = tradie ? `${tradie.user.firstName} ${tradie.user.lastName}` : 'Verified Tradie';
  const trade = tradie?.trades[0] ? (TRADE_MAP[tradie.trades[0]] ?? tradie.trades[0].replace(/_/g, ' ')) : 'Tradie';
  const rating = tradie?.avgRating ? Number(tradie.avgRating).toFixed(1) : null;
  const reviews = tradie?.totalReviews ?? 0;
  const initial = name.charAt(0);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #1f2937 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: 64,
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 120, height: 120, borderRadius: 60,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, fontWeight: 800, color: '#ffffff', marginBottom: 28,
        }}>
          {initial}
        </div>

        <h1 style={{ color: '#ffffff', fontSize: 52, fontWeight: 800, margin: 0, textAlign: 'center' }}>
          {name}
        </h1>
        <p style={{ color: '#a5b4fc', fontSize: 26, marginTop: 12, textAlign: 'center' }}>
          Verified {trade} · Australia
        </p>

        {rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <span style={{ color: '#fbbf24', fontSize: 28 }}>★</span>
            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 700 }}>{rating}</span>
            <span style={{ color: '#6b7280', fontSize: 18 }}>({reviews} reviews)</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36, background: 'rgba(99,102,241,0.15)', borderRadius: 14, padding: '10px 24px' }}>
          <span style={{ color: '#a5b4fc', fontSize: 16, fontWeight: 600 }}>FIXIT 24/7</span>
          <span style={{ color: '#4b5563', fontSize: 14 }}>·</span>
          <span style={{ color: '#6b7280', fontSize: 16 }}>Verified &amp; Background Checked</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
