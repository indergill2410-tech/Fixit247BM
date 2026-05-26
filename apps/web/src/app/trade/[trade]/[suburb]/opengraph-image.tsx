import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TRADE_MAP: Record<string, { name: string; singular: string; emoji: string }> = {
  plumbing:            { name: 'Plumbing',          singular: 'Plumber',              emoji: '🔧' },
  electrical:          { name: 'Electrical',         singular: 'Electrician',           emoji: '⚡' },
  hvac:                { name: 'HVAC',               singular: 'HVAC Technician',       emoji: '❄️' },
  carpentry:           { name: 'Carpentry',           singular: 'Carpenter',             emoji: '🪚' },
  painting:            { name: 'Painting',            singular: 'Painter',               emoji: '🖌️' },
  roofing:             { name: 'Roofing',             singular: 'Roofer',                emoji: '🏠' },
  tiling:              { name: 'Tiling',              singular: 'Tiler',                 emoji: '🔲' },
  'pest-control':      { name: 'Pest Control',        singular: 'Pest Controller',       emoji: '🐛' },
  locksmith:           { name: 'Locksmith',           singular: 'Locksmith',             emoji: '🔑' },
  glazing:             { name: 'Glazing',             singular: 'Glazier',               emoji: '🪟' },
  plastering:          { name: 'Plastering',          singular: 'Plasterer',             emoji: '🏗️' },
  landscaping:         { name: 'Landscaping',         singular: 'Landscaper',            emoji: '🌿' },
  cleaning:            { name: 'Cleaning',            singular: 'Cleaner',               emoji: '✨' },
  'appliance-repair':  { name: 'Appliance Repair',    singular: 'Appliance Technician',  emoji: '🔌' },
  'general-maintenance': { name: 'General Maintenance', singular: 'Handyman',            emoji: '🛠️' },
};

function formatSuburb(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function Image({ params }: { params: Promise<{ trade: string; suburb: string }> }) {
  const { trade, suburb } = await params;
  const tradeInfo = TRADE_MAP[trade] ?? { name: trade, singular: trade, emoji: '🛠️' };
  const suburbName = formatSuburb(suburb);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #2563eb 100%)',
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
        <div style={{ fontSize: 80, marginBottom: 16 }}>{tradeInfo.emoji}</div>
        <h1 style={{ color: '#ffffff', fontSize: 54, fontWeight: 800, textAlign: 'center', margin: 0, lineHeight: 1.1 }}>
          {tradeInfo.singular}s in {suburbName}
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: 26, marginTop: 20, textAlign: 'center' }}>
          Verified · Same-Day Bookings · Upfront Pricing
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 28px' }}>
          <span style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>FIXIT 24/7</span>
          <span style={{ color: '#93c5fd', fontSize: 16 }}>Australia&apos;s Trusted Trades Platform</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
