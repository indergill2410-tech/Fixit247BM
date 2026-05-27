-- Phase 8: Voice AI tables + Stripe idempotency table
-- Safe to run even if tables already exist (all statements use IF NOT EXISTS / DO blocks).

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "CallStatus" AS ENUM (
    'INITIATED', 'RINGING', 'IN_PROGRESS', 'AI_HANDLING',
    'HUMAN_TAKEOVER', 'COMPLETED', 'FAILED', 'ABANDONED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CallDirection" AS ENUM ('INBOUND', 'OUTBOUND');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "VoiceEventType" AS ENUM (
    'CALL_STARTED', 'CALL_ANSWERED', 'SPEECH_DETECTED', 'TRANSCRIPTION_RECEIVED',
    'EMERGENCY_DETECTED', 'JOB_CREATED', 'DISPATCH_TRIGGERED', 'TRADIE_ASSIGNED',
    'HUMAN_TAKEOVER_REQUESTED', 'HUMAN_TOOK_OVER', 'CALL_ENDED',
    'AI_CONFIDENCE_LOW', 'ESCALATION_TRIGGERED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "RiskLevel" AS ENUM (
    'SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'LIFE_THREATENING'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ConversationStatus" AS ENUM (
    'ACTIVE', 'GATHERING_INFO', 'CONFIRMING', 'JOB_CREATED',
    'DISPATCHING', 'COMPLETED', 'ABANDONED', 'ESCALATED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "voice_calls" (
    "id"              UUID          NOT NULL DEFAULT uuid_generate_v4(),
    "twilioCallSid"   TEXT,
    "customerId"      UUID,
    "phoneNumber"     TEXT          NOT NULL,
    "direction"       "CallDirection" NOT NULL,
    "status"          "CallStatus"  NOT NULL DEFAULT 'INITIATED',
    "duration"        INTEGER,
    "recordingUrl"    TEXT,
    "transcript"      TEXT,
    "urgencyScore"    INTEGER,
    "aiConfidence"    DOUBLE PRECISION,
    "jobId"           UUID,
    "assignedAgentId" UUID,
    "startedAt"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt"      TIMESTAMP(3),
    "endedAt"         TIMESTAMP(3),
    "metadata"        JSONB,
    CONSTRAINT "voice_calls_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "voice_events" (
    "id"        UUID              NOT NULL DEFAULT uuid_generate_v4(),
    "callId"    UUID              NOT NULL,
    "eventType" "VoiceEventType"  NOT NULL,
    "payload"   JSONB,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "emergency_assessments" (
    "id"                 UUID        NOT NULL DEFAULT uuid_generate_v4(),
    "jobId"              UUID,
    "callId"             UUID,
    "riskLevel"          "RiskLevel" NOT NULL,
    "emergencyScore"     INTEGER     NOT NULL,
    "detectedKeywords"   TEXT[],
    "tradeCategory"      TEXT,
    "recommendedAction"  TEXT        NOT NULL,
    "safetyInstructions" TEXT[],
    "autoDispatch"       BOOLEAN     NOT NULL DEFAULT false,
    "adminAlerted"       BOOLEAN     NOT NULL DEFAULT false,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "emergency_assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ai_conversations" (
    "id"                UUID                NOT NULL DEFAULT uuid_generate_v4(),
    "jobId"             UUID,
    "callId"            UUID,
    "sessionId"         TEXT                NOT NULL,
    "status"            "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "messages"          JSONB               NOT NULL,
    "extractedEntities" JSONB,
    "aiSummary"         TEXT,
    "tradeCategory"     TEXT,
    "urgencyScore"      INTEGER,
    "isEmergency"       BOOLEAN             NOT NULL DEFAULT false,
    "jobData"           JSONB,
    "turnCount"         INTEGER             NOT NULL DEFAULT 0,
    "createdAt"         TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "stripe_processed_events" (
    "eventId"     TEXT         NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType"   TEXT         NOT NULL,
    CONSTRAINT "stripe_processed_events_pkey" PRIMARY KEY ("eventId")
);

-- ─── Unique constraints ───────────────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS "voice_calls_twilioCallSid_key"       ON "voice_calls"("twilioCallSid");
CREATE UNIQUE INDEX IF NOT EXISTS "emergency_assessments_jobId_key"     ON "emergency_assessments"("jobId");
CREATE UNIQUE INDEX IF NOT EXISTS "emergency_assessments_callId_key"    ON "emergency_assessments"("callId");
CREATE UNIQUE INDEX IF NOT EXISTS "ai_conversations_jobId_key"          ON "ai_conversations"("jobId");
CREATE UNIQUE INDEX IF NOT EXISTS "ai_conversations_callId_key"         ON "ai_conversations"("callId");
CREATE UNIQUE INDEX IF NOT EXISTS "ai_conversations_sessionId_key"      ON "ai_conversations"("sessionId");

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "voice_calls_customerId_idx"            ON "voice_calls"("customerId");
CREATE INDEX IF NOT EXISTS "voice_calls_status_idx"                ON "voice_calls"("status");
CREATE INDEX IF NOT EXISTS "voice_calls_startedAt_idx"             ON "voice_calls"("startedAt");
CREATE INDEX IF NOT EXISTS "voice_calls_status_startedAt_idx"      ON "voice_calls"("status", "startedAt");
CREATE INDEX IF NOT EXISTS "voice_calls_twilioCallSid_idx"         ON "voice_calls"("twilioCallSid");
CREATE INDEX IF NOT EXISTS "voice_events_callId_idx"               ON "voice_events"("callId");
CREATE INDEX IF NOT EXISTS "voice_events_eventType_idx"            ON "voice_events"("eventType");
CREATE INDEX IF NOT EXISTS "voice_events_createdAt_idx"            ON "voice_events"("createdAt");
CREATE INDEX IF NOT EXISTS "emergency_assessments_riskLevel_idx"   ON "emergency_assessments"("riskLevel");
CREATE INDEX IF NOT EXISTS "emergency_assessments_emergencyScore_idx" ON "emergency_assessments"("emergencyScore");
CREATE INDEX IF NOT EXISTS "emergency_assessments_createdAt_idx"   ON "emergency_assessments"("createdAt");
CREATE INDEX IF NOT EXISTS "ai_conversations_sessionId_idx"        ON "ai_conversations"("sessionId");
CREATE INDEX IF NOT EXISTS "ai_conversations_status_idx"           ON "ai_conversations"("status");
CREATE INDEX IF NOT EXISTS "ai_conversations_isEmergency_idx"      ON "ai_conversations"("isEmergency");
CREATE INDEX IF NOT EXISTS "stripe_processed_events_processedAt_idx" ON "stripe_processed_events"("processedAt");

-- ─── Foreign keys (safe: only adds if table just created; ignored if FK already exists) ──

DO $$ BEGIN
  ALTER TABLE "voice_calls" ADD CONSTRAINT "voice_calls_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "voice_events" ADD CONSTRAINT "voice_events_callId_fkey"
    FOREIGN KEY ("callId") REFERENCES "voice_calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "emergency_assessments" ADD CONSTRAINT "emergency_assessments_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "emergency_assessments" ADD CONSTRAINT "emergency_assessments_callId_fkey"
    FOREIGN KEY ("callId") REFERENCES "voice_calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_callId_fkey"
    FOREIGN KEY ("callId") REFERENCES "voice_calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
