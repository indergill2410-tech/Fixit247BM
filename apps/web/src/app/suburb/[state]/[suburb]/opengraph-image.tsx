import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STATE_MAP: Record<string, string> = {
  nsw: 'New South Wales', vic: 'Victoria', qld: 'Queensland',
  wa: 'Western Australia', sa: 'South Australia', tas: 'Tasmania',
  act: 'Australian Capital Territory', nt: 'Northern Territory',
};

function formatSuburb(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function Image({ params }: { params: Promise<{ state: string; suburb: string }> }) {
  const { state, suburb } = await params;
  const suburbName = formatSuburb(suburb);
  const stateName = STATE_MAP[state] ?? state.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#34d399' }} />
          <span style={{ color: '#a5b4fc', fontSize: 18, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Fixit 24/7
          </span>
        </div>
        <h1 style={{ color: '#ffffff', fontSize: 56, fontWeight: 800, textAlign: 'center', margin: 0, lineHeight: 1.1 }}>
          Tradies in {suburbName}
        </h1>
        <p style={{ color: '#a5b4fc', fontSize: 26, marginTop: 20, textAlign: 'center' }}>
          {stateName} · All trades · Same-day bookings
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
          {['Licensed & Insured', '4.9★ Rated', 'Dispatched in Minutes'].map((t) => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 20px', color: '#e0e7ff', fontSize: 16, fontWeight: 500 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
