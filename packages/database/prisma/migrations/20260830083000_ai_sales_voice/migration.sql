-- Fixit247 AI Sales Voice + PropertySafe acquisition foundation
-- Keeps operational call data in voice_calls while adding sales-specific context.

CREATE TABLE IF NOT EXISTS sales_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  agent_key TEXT NOT NULL DEFAULT 'propertysafe_closer',
  retell_agent_id TEXT,
  timezone TEXT NOT NULL DEFAULT 'Australia/Melbourne',
  daily_call_limit INTEGER NOT NULL DEFAULT 100,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sales_campaigns_status_check
    CHECK (status IN ('DRAFT', 'READY', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED')),
  CONSTRAINT sales_campaigns_daily_call_limit_check
    CHECK (daily_call_limit > 0)
);

CREATE INDEX IF NOT EXISTS sales_campaigns_status_idx ON sales_campaigns(status);
CREATE INDEX IF NOT EXISTS sales_campaigns_created_at_idx ON sales_campaigns(created_at);

CREATE TABLE IF NOT EXISTS sales_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  role_title TEXT,
  phone_number TEXT NOT NULL,
  email TEXT,
  suburb TEXT,
  state TEXT,
  source TEXT,
  target_segment TEXT NOT NULL DEFAULT 'OTHER',
  property_count INTEGER,
  status TEXT NOT NULL DEFAULT 'NEW',
  lead_score INTEGER,
  consent_source TEXT,
  consent_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  next_contact_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB,

  -- PropertySafe acquisition funnel
  propertysafe_stage TEXT NOT NULL DEFAULT 'NEW',
  signup_tracking_token UUID NOT NULL DEFAULT uuid_generate_v4(),
  signup_link_sent_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  propertysafe_account_id TEXT,
  first_property_added_at TIMESTAMPTZ,
  first_job_posted_at TIMESTAMPTZ,
  activation_source TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sales_leads_status_check
    CHECK (status IN ('NEW', 'READY', 'DIALING', 'CONNECTED', 'QUALIFIED', 'NURTURE', 'BOOKED', 'WON', 'LOST', 'DO_NOT_CALL', 'INVALID')),
  CONSTRAINT sales_leads_score_check
    CHECK (lead_score IS NULL OR (lead_score >= 0 AND lead_score <= 100)),
  CONSTRAINT sales_leads_property_count_check
    CHECK (property_count IS NULL OR property_count >= 0),
  CONSTRAINT sales_leads_target_segment_check
    CHECK (target_segment IN ('PROPERTY_MANAGER', 'REAL_ESTATE_AGENCY', 'LANDLORD', 'PROPERTY_OWNER', 'OTHER')),
  CONSTRAINT sales_leads_propertysafe_stage_check
    CHECK (propertysafe_stage IN ('NEW', 'QUALIFIED', 'LINK_SENT', 'SIGNED_UP', 'PROPERTY_ADDED', 'FIRST_JOB_POSTED')),
  CONSTRAINT sales_leads_signup_tracking_token_unique UNIQUE (signup_tracking_token)
);

CREATE INDEX IF NOT EXISTS sales_leads_phone_idx ON sales_leads(phone_number);
CREATE INDEX IF NOT EXISTS sales_leads_status_idx ON sales_leads(status);
CREATE INDEX IF NOT EXISTS sales_leads_next_contact_idx ON sales_leads(next_contact_at);
CREATE INDEX IF NOT EXISTS sales_leads_company_idx ON sales_leads(company_name);
CREATE INDEX IF NOT EXISTS sales_leads_propertysafe_stage_idx ON sales_leads(propertysafe_stage);
CREATE INDEX IF NOT EXISTS sales_leads_target_segment_idx ON sales_leads(target_segment);
CREATE INDEX IF NOT EXISTS sales_leads_signup_token_idx ON sales_leads(signup_tracking_token);

CREATE TABLE IF NOT EXISTS contact_suppressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'voice-agent',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_suppressions_active_idx
  ON contact_suppressions(phone_number, expires_at);

CREATE TABLE IF NOT EXISTS sales_call_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_call_id UUID NOT NULL UNIQUE REFERENCES voice_calls(id) ON DELETE CASCADE,
  retell_call_id TEXT UNIQUE,
  lead_id UUID REFERENCES sales_leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES sales_campaigns(id) ON DELETE SET NULL,
  outcome TEXT,
  sentiment TEXT,
  successful BOOLEAN,
  summary TEXT,
  disconnection_reason TEXT,
  transfer_destination TEXT,
  cost_metadata JSONB,
  analysis_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sales_call_links_lead_idx ON sales_call_links(lead_id);
CREATE INDEX IF NOT EXISTS sales_call_links_campaign_idx ON sales_call_links(campaign_id);
CREATE INDEX IF NOT EXISTS sales_call_links_retell_idx ON sales_call_links(retell_call_id);

-- Immutable activation events make the funnel auditable and easy to analyse.
CREATE TABLE IF NOT EXISTS propertysafe_activation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES sales_leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT propertysafe_activation_events_type_check
    CHECK (event_type IN ('QUALIFIED', 'SIGNUP_LINK_SENT', 'SIGNED_UP', 'PROPERTY_ADDED', 'FIRST_JOB_POSTED'))
);

CREATE INDEX IF NOT EXISTS propertysafe_activation_events_lead_idx
  ON propertysafe_activation_events(lead_id, occurred_at);
CREATE INDEX IF NOT EXISTS propertysafe_activation_events_type_idx
  ON propertysafe_activation_events(event_type, occurred_at);
