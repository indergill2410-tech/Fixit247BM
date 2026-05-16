export function buildSuburbTradeSlug(trade: string, suburb: string, isEmergency: boolean): string {
  const t = trade.toLowerCase().replace(/_/g, '-');
  const s = suburb.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return isEmergency ? `emergency/${t}/${s}` : `trade/${t}/${s}`;
}

export function buildSuburbSlug(suburb: string, state: string): string {
  const s = suburb.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `suburb/${state.toLowerCase()}/${s}`;
}

export const TRADE_CATEGORIES = [
  'PLUMBING','ELECTRICAL','HVAC','CARPENTRY','PAINTING','ROOFING',
  'TILING','PEST_CONTROL','LOCKSMITH','GLAZING','PLASTERING','LANDSCAPING',
  'CLEANING','APPLIANCE_REPAIR','GENERAL_MAINTENANCE',
] as const;

export const MAJOR_SUBURBS = [
  { suburb: 'Sydney CBD', state: 'NSW' }, { suburb: 'Melbourne CBD', state: 'VIC' },
  { suburb: 'Brisbane CBD', state: 'QLD' }, { suburb: 'Perth CBD', state: 'WA' },
  { suburb: 'Adelaide', state: 'SA' }, { suburb: 'Parramatta', state: 'NSW' },
  { suburb: 'Blacktown', state: 'NSW' }, { suburb: 'Liverpool', state: 'NSW' },
  { suburb: 'Penrith', state: 'NSW' }, { suburb: 'Campbelltown', state: 'NSW' },
  { suburb: 'Bankstown', state: 'NSW' }, { suburb: 'Chatswood', state: 'NSW' },
  { suburb: 'Bondi', state: 'NSW' }, { suburb: 'Manly', state: 'NSW' },
  { suburb: 'Coogee', state: 'NSW' }, { suburb: 'St Kilda', state: 'VIC' },
  { suburb: 'Richmond', state: 'VIC' }, { suburb: 'Fitzroy', state: 'VIC' },
  { suburb: 'Southbank', state: 'VIC' }, { suburb: 'South Yarra', state: 'VIC' },
  { suburb: 'Gold Coast', state: 'QLD' }, { suburb: 'Sunshine Coast', state: 'QLD' },
  { suburb: 'Toowoomba', state: 'QLD' }, { suburb: 'Cairns', state: 'QLD' },
  { suburb: 'Fremantle', state: 'WA' }, { suburb: 'Joondalup', state: 'WA' },
  { suburb: 'Glenelg', state: 'SA' }, { suburb: 'Unley', state: 'SA' },
] as const;
